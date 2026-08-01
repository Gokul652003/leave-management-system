import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { EmployeeResponseDto } from '../dto/employee-response.dto';

export interface IEmployeesService {
  create(dto: CreateEmployeeDto): Promise<EmployeeResponseDto>;
}
