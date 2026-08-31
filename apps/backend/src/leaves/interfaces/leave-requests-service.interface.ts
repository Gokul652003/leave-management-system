import { CreateLeaveRequestDto } from '../dto/create-leave-request.dto';
import {
  LeaveBalanceDto,
  LeaveRequestResponseDto,
} from '../dto/leave-request-response.dto';
import { RejectLeaveRequestDto } from '../dto/reject-leave-request.dto';

export interface ILeaveRequestsService {
  create(
    userId: string,
    dto: CreateLeaveRequestDto,
  ): Promise<LeaveRequestResponseDto>;
  findMine(userId: string): Promise<LeaveRequestResponseDto[]>;
  findAll(status?: string): Promise<LeaveRequestResponseDto[]>;
  findById(id: string): Promise<LeaveRequestResponseDto>;
  approve(id: string, reviewerUserId: string): Promise<LeaveRequestResponseDto>;
  reject(
    id: string,
    reviewerUserId: string,
    dto: RejectLeaveRequestDto,
  ): Promise<LeaveRequestResponseDto>;
  getBalances(userId: string): Promise<LeaveBalanceDto[]>;
}
