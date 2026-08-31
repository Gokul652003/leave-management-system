export class LeaveRequestResponseDto {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  leaveTypeCode: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  halfDay: boolean;
  totalDays: number;
  reason?: string | null;
  status: string;
  reviewerComments?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
  createdAt: Date;
}

export class LeaveBalanceDto {
  leaveTypeCode: string;
  leaveTypeName: string;
  quota: number | null;
  used: number;
  remaining: number | null;
}
