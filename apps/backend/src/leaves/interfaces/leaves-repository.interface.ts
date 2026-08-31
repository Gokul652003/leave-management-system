import { LeaveType } from '../entities/leave-type.entity';

export interface ILeavesRepository {
  findAll(): Promise<LeaveType[]>;
  findByCode(code: string): Promise<LeaveType | null>;
  create(data: Partial<LeaveType>): LeaveType;
  save(type: LeaveType): Promise<LeaveType>;
  remove(type: LeaveType): Promise<LeaveType>;
}
