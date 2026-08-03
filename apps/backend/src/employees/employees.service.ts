import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeResponseDto, MeResponseDto } from './dto/employee-response.dto';
import { Employee } from './entities/employee.entity';
import type { IEmployeesRepository } from './interfaces/employees-repository.interface';
import type { IEmployeesService } from './interfaces/employees-service.interface';
import { EMPLOYEES_REPOSITORY } from './tokens';

@Injectable()
export class EmployeesServiceImpl implements IEmployeesService {
  constructor(
    @Inject(EMPLOYEES_REPOSITORY)
    private readonly employeesRepository: IEmployeesRepository,
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

  async findById(id: string): Promise<MeResponseDto> {
    const employee = await this.employeesRepository.findById(id);

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
    }
  }
}
