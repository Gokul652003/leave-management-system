import { LeaveTypeResponseDto } from '../dto/leave-type-response.dto';

export interface ILeavesService {
  findTypes(): Promise<LeaveTypeResponseDto[]>;
}
