export class EmployeeResponseDto {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  managerId?: number | null;
  joinDate?: string | null;
  employeeId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
