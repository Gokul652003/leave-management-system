import { CreateEmployeeDto } from '../../dto/create-employee.dto';
import { EmployeeResponseDto, MeResponseDto } from '../../dto/employee-response.dto';
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
  id: '9f1c2d3e-4b5a-4c6d-8e7f-123456789abc',
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
  id: '9f1c2d3e-4b5a-4c6d-8e7f-123456789abc',
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

export const userIdDtoFixture = {
   id: "6713c410-5bcb-42ac-a0be-628f6e924420" ,
   email: 'r.kumar@acme.corp',
   role: 'Backend Engineer',
  };

export const meResponseFixture: MeResponseDto = {
  name: 'Ravi Kumar',
  email: 'r.kumar@acme.corp',
  department: 'Engineering',
  role: 'Backend Engineer',
  employeeId: 'EMP-3310-AC',
};
