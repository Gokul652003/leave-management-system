import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomInt } from 'node:crypto';
import type { Role } from '../common/decorators/roles.decorator';
import { SupabaseAdminService } from '../common/supabase/supabase-admin.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeAccessRoleResponseDto } from './dto/employee-access-role-response.dto';
import {
  EmployeeResponseDto,
  MeResponseDto,
} from './dto/employee-response.dto';
import { Employee } from './entities/employee.entity';
import type { IEmployeesRepository } from './interfaces/employees-repository.interface';
import type { IEmployeesService } from './interfaces/employees-service.interface';
import { EMPLOYEES_REPOSITORY } from './tokens';

@Injectable()
export class EmployeesServiceImpl implements IEmployeesService {
  constructor(
    @Inject(EMPLOYEES_REPOSITORY)
    private readonly employeesRepository: IEmployeesRepository,
    private readonly supabaseAdmin: SupabaseAdminService,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    const existing = await this.employeesRepository.findByEmail(dto.email);

    if (existing) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const employeeId = `EMP-${String(randomInt(0, 10000)).padStart(4, '0')}-AC`;

    const employee = this.employeesRepository.create({
      name: dto.name,
      email: dto.email,
      department: dto.department,
      role: dto.role,
      managerId: dto.managerId ?? null,
      joinDate: dto.joinDate ?? null,
      employeeId,
      status: 'Active',
    });

    const saved = await this.employeesRepository.save(employee);

    return this.toResponse(saved);
  }

  async findAll(): Promise<EmployeeResponseDto[]> {
    const employees = await this.employeesRepository.findAll();
    return employees.map((employee) => this.toResponse(employee));
  }

  async getEmployeeRef(userId: string) {
    const employee = await this.employeesRepository.findByUserId(userId);

    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }

    return {
      id: employee.id,
      employeeId: employee.employeeId,
      name: employee.name,
    };
  }

  async getProfile(employeeId: string): Promise<EmployeeResponseDto> {
    const employee =
      await this.employeesRepository.findByEmployeeId(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.toResponse(employee);
  }

  async listWithAccessRoles(): Promise<EmployeeAccessRoleResponseDto[]> {
    const [employees, roleByUserId] = await Promise.all([
      this.employeesRepository.findAll(),
      this.supabaseAdmin.listUserRoles(),
    ]);

    return employees.map((employee) => ({
      ...this.toResponse(employee),
      accessRole: employee.userId
        ? (roleByUserId.get(employee.userId) ?? null)
        : null,
    }));
  }

  async updateAccessRole(
    employeeId: string,
    role: Role,
  ): Promise<EmployeeAccessRoleResponseDto> {
    const employee =
      await this.employeesRepository.findByEmployeeId(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (!employee.userId) {
      throw new BadRequestException(
        'Employee has no linked auth account to assign a role to',
      );
    }

    await this.supabaseAdmin.updateUserRole(employee.userId, role);

    return { ...this.toResponse(employee), accessRole: role };
  }

  private toResponse(employee: Employee): EmployeeResponseDto {
    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      managerId: employee.managerId,
      joinDate: employee.joinDate,
      employeeId: employee.employeeId,
      status: employee.status,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }

  async findByUserId(id: string): Promise<MeResponseDto> {
    const employee = await this.employeesRepository.findByUserId(id);

    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }
    return this.toMeResponse(employee);
  }

  private toMeResponse(employee: Employee): MeResponseDto {
    return {
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      employeeId: employee.employeeId,
    };
  }
}
