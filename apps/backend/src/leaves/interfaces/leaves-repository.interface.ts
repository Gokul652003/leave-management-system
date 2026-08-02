import { LeaveType } from '../entities/leave-type.entity';

export interface ILeavesRepository {
  findAll(): Promise<LeaveType[]>;
}
