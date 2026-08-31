import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IEmployeesService } from '../employees/interfaces/employees-service.interface';
import { EMPLOYEES_SERVICE } from '../employees/tokens';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import {
  LeaveBalanceDto,
  LeaveRequestResponseDto,
} from './dto/leave-request-response.dto';
import { RejectLeaveRequestDto } from './dto/reject-leave-request.dto';
import { LeaveRequest } from './entities/leave-request.entity';
import type { ILeaveRequestsRepository } from './interfaces/leave-requests-repository.interface';
import type { ILeaveRequestsService } from './interfaces/leave-requests-service.interface';
import type { ILeavesService } from './interfaces/leaves-service.interface';
import { LEAVE_REQUESTS_REPOSITORY, LEAVES_SERVICE } from './tokens';

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function daysBetweenInclusive(start: string, end: string): number {
  const ms = parseDate(end).getTime() - parseDate(start).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
}

@Injectable()
export class LeaveRequestsServiceImpl implements ILeaveRequestsService {
  constructor(
    @Inject(LEAVE_REQUESTS_REPOSITORY)
    private readonly leaveRequestsRepository: ILeaveRequestsRepository,
    @Inject(LEAVES_SERVICE)
    private readonly leavesService: ILeavesService,
    @Inject(EMPLOYEES_SERVICE)
    private readonly employeesService: IEmployeesService,
  ) {}

  async create(
    userId: string,
    dto: CreateLeaveRequestDto,
  ): Promise<LeaveRequestResponseDto> {
    const employee = await this.employeesService.getEmployeeRef(userId);

    const leaveType = await this.leavesService.findTypeByCode(
      dto.leaveTypeCode,
    );
    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }

    if (parseDate(dto.endDate).getTime() < parseDate(dto.startDate).getTime()) {
      throw new BadRequestException('endDate must not be before startDate');
    }

    if (dto.halfDay && dto.startDate !== dto.endDate) {
      throw new BadRequestException(
        'Half-day requests must have the same startDate and endDate',
      );
    }

    const totalDays = dto.halfDay
      ? 0.5
      : daysBetweenInclusive(dto.startDate, dto.endDate);

    if (
      leaveType.maxDaysPerRequest != null &&
      totalDays > leaveType.maxDaysPerRequest
    ) {
      throw new BadRequestException(
        `This leave type allows a maximum of ${leaveType.maxDaysPerRequest} days per request`,
      );
    }

    const request = this.leaveRequestsRepository.create({
      employeeId: employee.id,
      leaveTypeCode: dto.leaveTypeCode,
      startDate: dto.startDate,
      endDate: dto.endDate,
      halfDay: !!dto.halfDay,
      totalDays,
      reason: dto.reason ?? null,
      status: 'pending',
    });

    const saved = await this.leaveRequestsRepository.save(request);
    return this.toResponse(saved, employee, leaveType.name);
  }

  async findMine(userId: string): Promise<LeaveRequestResponseDto[]> {
    const employee = await this.employeesService.getEmployeeRef(userId);
    const requests = await this.leaveRequestsRepository.findByEmployeeId(
      employee.id,
    );
    const typeNameByCode = await this.typeNameMap();
    return requests.map((r) =>
      this.toResponse(r, employee, typeNameByCode.get(r.leaveTypeCode)),
    );
  }

  async findAll(status?: string): Promise<LeaveRequestResponseDto[]> {
    const [requests, employees, typeNameByCode] = await Promise.all([
      this.leaveRequestsRepository.findAll(status),
      this.employeesService.findAll(),
      this.typeNameMap(),
    ]);

    const employeeById = new Map(employees.map((e) => [e.id, e]));

    return requests.map((r) => {
      const employee = employeeById.get(r.employeeId);
      return this.toResponse(
        r,
        employee
          ? { id: employee.id, employeeId: employee.employeeId, name: employee.name }
          : { id: r.employeeId, employeeId: '—', name: 'Unknown' },
        typeNameByCode.get(r.leaveTypeCode),
      );
    });
  }

  async findById(id: string): Promise<LeaveRequestResponseDto> {
    const request = await this.getOrThrow(id);
    const employees = await this.employeesService.findAll();
    const employee = employees.find((e) => e.id === request.employeeId);
    const typeNameByCode = await this.typeNameMap();

    return this.toResponse(
      request,
      employee
        ? { id: employee.id, employeeId: employee.employeeId, name: employee.name }
        : { id: request.employeeId, employeeId: '—', name: 'Unknown' },
      typeNameByCode.get(request.leaveTypeCode),
    );
  }

  async approve(
    id: string,
    reviewerUserId: string,
  ): Promise<LeaveRequestResponseDto> {
    const request = await this.getOrThrow(id);
    this.assertPending(request);

    request.status = 'approved';
    request.reviewedBy = reviewerUserId;
    request.reviewedAt = new Date();

    const saved = await this.leaveRequestsRepository.save(request);
    return this.findById(saved.id);
  }

  async reject(
    id: string,
    reviewerUserId: string,
    dto: RejectLeaveRequestDto,
  ): Promise<LeaveRequestResponseDto> {
    const request = await this.getOrThrow(id);
    this.assertPending(request);

    request.status = 'rejected';
    request.reviewedBy = reviewerUserId;
    request.reviewedAt = new Date();
    request.reviewerComments = dto.comments;

    const saved = await this.leaveRequestsRepository.save(request);
    return this.findById(saved.id);
  }

  async getBalances(userId: string): Promise<LeaveBalanceDto[]> {
    const employee = await this.employeesService.getEmployeeRef(userId);
    const yearStart = new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1));

    const [types, approved] = await Promise.all([
      this.leavesService.findTypes(),
      this.leaveRequestsRepository.findApprovedByEmployeeSince(
        employee.id,
        yearStart,
      ),
    ]);

    const usedByCode = new Map<string, number>();
    for (const r of approved) {
      usedByCode.set(
        r.leaveTypeCode,
        (usedByCode.get(r.leaveTypeCode) ?? 0) + Number(r.totalDays),
      );
    }

    return types.map((type) => {
      const used = usedByCode.get(type.id) ?? 0;
      return {
        leaveTypeCode: type.id,
        leaveTypeName: type.name,
        quota: type.annualQuota ?? null,
        used,
        remaining: type.annualQuota != null ? type.annualQuota - used : null,
      };
    });
  }

  private async getOrThrow(id: string): Promise<LeaveRequest> {
    const request = await this.leaveRequestsRepository.findById(id);
    if (!request) {
      throw new NotFoundException('Leave request not found');
    }
    return request;
  }

  private assertPending(request: LeaveRequest): void {
    if (request.status !== 'pending') {
      throw new ConflictException('Leave request has already been reviewed');
    }
  }

  private async typeNameMap(): Promise<Map<string, string>> {
    const types = await this.leavesService.findTypes();
    return new Map(types.map((t) => [t.id, t.name]));
  }

  private toResponse(
    request: LeaveRequest,
    employee: { id: string; employeeId: string; name: string },
    leaveTypeName: string | undefined,
  ): LeaveRequestResponseDto {
    return {
      id: request.id,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeCode: employee.employeeId,
      leaveTypeCode: request.leaveTypeCode,
      leaveTypeName: leaveTypeName ?? request.leaveTypeCode,
      startDate: request.startDate,
      endDate: request.endDate,
      halfDay: request.halfDay,
      totalDays: Number(request.totalDays),
      reason: request.reason ?? null,
      status: request.status,
      reviewerComments: request.reviewerComments ?? null,
      reviewedBy: request.reviewedBy ?? null,
      reviewedAt: request.reviewedAt ?? null,
      createdAt: request.createdAt,
    };
  }
}
