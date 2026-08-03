import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { EmployeeResponseDto, MeResponseDto } from '../dto/employee-response.dto';

export interface IEmployeesService {
  create(dto: CreateEmployeeDto): Promise<EmployeeResponseDto>;
  findById(id: string): Promise<MeResponseDto>;
}