export class LeaveTypeResponseDto {
  id: string;
  name: string;
  maxDaysPerRequest?: number | null;
  requiresDocumentationOverDays?: number | null;
}
