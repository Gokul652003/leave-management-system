import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { type AuthUser, JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeResponseDto, MeResponseDto } from './dto/employee-response.dto';
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
}

@Controller('auth/me')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeController {
  constructor(
    @Inject(EMPLOYEES_SERVICE)
    private readonly employeesService: IEmployeesService,
  ){}
  
  @Get()
  async getMe(@CurrentUser() user:AuthUser): Promise<ApiResponse<MeResponseDto>> {
    const { id } = user;
    const employee = await this.employeesService.findByUserId(id);
    return { data: employee };
  }
}

