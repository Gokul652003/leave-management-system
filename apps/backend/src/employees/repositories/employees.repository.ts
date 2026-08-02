import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import type { IEmployeesRepository } from '../interfaces/employees-repository.interface';

@Injectable()
export class TypeOrmEmployeesRepository implements IEmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repository: Repository<Employee>,
  ) {}

  findById(employeeId: string ): Promise<Employee | null> {
    return this.repository.findOne({ where: { employeeId } });
  }

  findByEmail(email: string): Promise<Employee | null> {
    return this.repository.findOne({ where: { email } });
  }

  create(data: Partial<Employee>): Employee {
    return this.repository.create(data);
  }

  save(employee: Employee): Promise<Employee> {
    return this.repository.save(employee);
  }
}
