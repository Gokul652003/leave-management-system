import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { type AuthUser, JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeAccessRoleResponseDto } from './dto/employee-access-role-response.dto';
import {
  EmployeeResponseDto,
  MeResponseDto,
} from './dto/employee-response.dto';
import { UpdateAccessRoleDto } from './dto/update-access-role.dto';
import type { IEmployeesService } from './interfaces/employees-service.interface';
import { EMPLOYEES_SERVICE } from './tokens';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(
    @Inject(EMPLOYEES_SERVICE)
    private readonly employeesService: IEmployeesService,
  ) {}

  @Post()
  @Roles('admin', 'hr')
  async create(
    @Body() dto: CreateEmployeeDto,
  ): Promise<ApiResponse<EmployeeResponseDto>> {
    const employee = await this.employeesService.create(dto);
    return { data: employee };
  }

  @Get()
  @Roles('admin', 'hr', 'manager')
  async findAll(): Promise<ApiResponse<{ employees: EmployeeResponseDto[] }>> {
    const employees = await this.employeesService.findAll();
    return { data: { employees } };
  }

  @Get('access-roles')
  @Roles('admin')
  async listAccessRoles(): Promise<
    ApiResponse<{ employees: EmployeeAccessRoleResponseDto[] }>
  > {
    const employees = await this.employeesService.listWithAccessRoles();
    return { data: { employees } };
  }

  @Patch(':employeeId/access-role')
  @Roles('admin')
  async updateAccessRole(
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdateAccessRoleDto,
  ): Promise<ApiResponse<EmployeeAccessRoleResponseDto>> {
    const employee = await this.employeesService.updateAccessRole(
      employeeId,
      dto.role,
    );
    return { data: employee };
  }

  @Get(':employeeId/profile')
  @Roles('admin', 'hr', 'manager')
  async getProfile(
    @Param('employeeId') employeeId: string,
  ): Promise<ApiResponse<EmployeeResponseDto>> {
    const employee = await this.employeesService.getProfile(employeeId);
    return { data: employee };
  }
}

@Controller('auth/me')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeController {
  constructor(
    @Inject(EMPLOYEES_SERVICE)
    private readonly employeesService: IEmployeesService,
  ) {}

  @Get()
  async getMe(
    @CurrentUser() user: AuthUser,
  ): Promise<ApiResponse<MeResponseDto>> {
    const { id } = user;
    const employee = await this.employeesService.findByUserId(id);
    return { data: employee };
  }
}
