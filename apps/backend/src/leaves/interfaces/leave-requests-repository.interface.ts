import { LeaveRequest } from '../entities/leave-request.entity';

export interface ILeaveRequestsRepository {
  create(data: Partial<LeaveRequest>): LeaveRequest;
  save(request: LeaveRequest): Promise<LeaveRequest>;
  findById(id: string): Promise<LeaveRequest | null>;
  findByEmployeeId(employeeId: string): Promise<LeaveRequest[]>;
  findAll(status?: string): Promise<LeaveRequest[]>;
  findApprovedByEmployeeSince(
    employeeId: string,
    since: Date,
  ): Promise<LeaveRequest[]>;
}
