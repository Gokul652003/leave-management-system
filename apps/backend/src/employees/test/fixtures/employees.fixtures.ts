import { CreateEmployeeDto } from '../../dto/create-employee.dto';
import { EmployeeResponseDto } from '../../dto/employee-response.dto';
import { Employee } from '../../entities/employee.entity';

export const createEmployeeDtoFixture: CreateEmployeeDto = {
  name: 'Ravi Kumar',
  email: 'r.kumar@acme.corp',
  department: 'Engineering',
  role: 'Backend Engineer',
  managerId: 2940,
  joinDate: '2024-02-01',
};

export const employeeEntityFixture: Employee = {
  id: 3310,
  name: 'Ravi Kumar',
  email: 'r.kumar@acme.corp',
  department: 'Engineering',
  role: 'Backend Engineer',
  managerId: 2940,
  joinDate: '2024-02-01',
  employeeId: 'EMP-3310-AC',
  status: 'Active',
  createdAt: new Date('2024-02-01T10:00:00Z'),
  updatedAt: new Date('2024-02-01T10:00:00Z'),
  deletedAt: null,
};

export const employeeResponseFixture: EmployeeResponseDto = {
  id: 3310,
  name: 'Ravi Kumar',
  email: 'r.kumar@acme.corp',
  department: 'Engineering',
  role: 'Backend Engineer',
  managerId: 2940,
  joinDate: '2024-02-01',
  employeeId: 'EMP-3310-AC',
  status: 'Active',
  createdAt: new Date('2024-02-01T10:00:00Z'),
  updatedAt: new Date('2024-02-01T10:00:00Z'),
};
