import { Employee } from '../entities/employee.entity';

export interface IEmployeesRepository {
  findAll(): Promise<Employee[]>;
  findByUserId(id: string): Promise<Employee | null>;
  findByEmployeeId(employeeId: string): Promise<Employee | null>;
  findByEmail(email: string): Promise<Employee | null>;
  create(data: Partial<Employee>): Employee;
  save(employee: Employee): Promise<Employee>;
}
