import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { EmployeeAccessRoleResponseDto } from '../dto/employee-access-role-response.dto';
import {
  EmployeeResponseDto,
  MeResponseDto,
} from '../dto/employee-response.dto';
import type { Role } from '../../common/decorators/roles.decorator';

export interface EmployeeRef {
  id: string;
  employeeId: string;
  name: string;
}

export interface IEmployeesService {
  create(dto: CreateEmployeeDto): Promise<EmployeeResponseDto>;
  findAll(): Promise<EmployeeResponseDto[]>;
  getEmployeeRef(userId: string): Promise<EmployeeRef>;
  findByUserId(id: string): Promise<MeResponseDto>;
  getProfile(employeeId: string): Promise<EmployeeResponseDto>;
  listWithAccessRoles(): Promise<EmployeeAccessRoleResponseDto[]>;
  updateAccessRole(
    employeeId: string,
    role: Role,
  ): Promise<EmployeeAccessRoleResponseDto>;
}
