import { Employee } from '../entities/employee.entity';

export interface IEmployeesRepository {
  findById(id: string ): Promise<Employee | null>;
  findByEmail(email: string): Promise<Employee | null>;
  create(data: Partial<Employee>): Employee;
  save(employee: Employee): Promise<Employee>;
}
