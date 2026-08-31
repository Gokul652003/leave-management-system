export class LeaveTypeResponseDto {
  id: string;
  name: string;
  annualQuota?: number | null;
  maxDaysPerRequest?: number | null;
  requiresDocumentationOverDays?: number | null;
}
