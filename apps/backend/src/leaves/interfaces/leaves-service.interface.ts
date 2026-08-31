import { CreateLeaveTypeDto } from '../dto/create-leave-type.dto';
import { LeaveTypeResponseDto } from '../dto/leave-type-response.dto';
import { UpdateLeaveTypeDto } from '../dto/update-leave-type.dto';

export interface ILeavesService {
  findTypes(): Promise<LeaveTypeResponseDto[]>;
  findTypeByCode(code: string): Promise<LeaveTypeResponseDto | null>;
  createType(dto: CreateLeaveTypeDto): Promise<LeaveTypeResponseDto>;
  updateType(
    code: string,
    dto: UpdateLeaveTypeDto,
  ): Promise<LeaveTypeResponseDto>;
  removeType(code: string): Promise<void>;
}
