export interface EmployeeProfile {
  id: string
  name: string
  email: string
  department: string
  role: string
  managerId?: number | null
  joinDate?: string | null
  employeeId: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeInput {
  name: string
  email: string
  department: string
  role: string
  managerId?: number | null
  joinDate?: string | null
}

export type AccessRole = 'admin' | 'hr' | 'manager' | 'employee'

export interface EmployeeAccessRole extends EmployeeProfile {
  accessRole: AccessRole | null
}

export interface LeavePolicy {
  id: string
  name: string
  annualQuota?: number | null
  maxDaysPerRequest?: number | null
  requiresDocumentationOverDays?: number | null
}

export interface CreateLeavePolicyInput {
  code: string
  name: string
  annualQuota?: number | null
  maxDaysPerRequest?: number | null
  requiresDocumentationOverDays?: number | null
}

export type UpdateLeavePolicyInput = Partial<
  Omit<CreateLeavePolicyInput, 'code'>
>

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected'

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  employeeCode: string
  leaveTypeCode: string
  leaveTypeName: string
  startDate: string
  endDate: string
  halfDay: boolean
  totalDays: number
  reason?: string | null
  status: LeaveRequestStatus
  reviewerComments?: string | null
  reviewedBy?: string | null
  reviewedAt?: string | null
  createdAt: string
}

export interface CreateLeaveRequestInput {
  leaveTypeCode: string
  startDate: string
  endDate: string
  halfDay?: boolean
  reason?: string | null
}

export interface LeaveBalance {
  leaveTypeCode: string
  leaveTypeName: string
  quota: number | null
  used: number
  remaining: number | null
}

export interface ApiResponse<T> {
  data: T
}
