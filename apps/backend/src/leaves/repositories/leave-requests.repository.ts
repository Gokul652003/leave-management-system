import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { LeaveRequest } from '../entities/leave-request.entity';
import type { ILeaveRequestsRepository } from '../interfaces/leave-requests-repository.interface';

@Injectable()
export class TypeOrmLeaveRequestsRepository
  implements ILeaveRequestsRepository
{
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly repository: Repository<LeaveRequest>,
  ) {}

  create(data: Partial<LeaveRequest>): LeaveRequest {
    return this.repository.create(data);
  }

  save(request: LeaveRequest): Promise<LeaveRequest> {
    return this.repository.save(request);
  }

  findById(id: string): Promise<LeaveRequest | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByEmployeeId(employeeId: string): Promise<LeaveRequest[]> {
    return this.repository.find({
      where: { employeeId },
      order: { createdAt: 'DESC' },
    });
  }

  findAll(status?: string): Promise<LeaveRequest[]> {
    return this.repository.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });
  }

  findApprovedByEmployeeSince(
    employeeId: string,
    since: Date,
  ): Promise<LeaveRequest[]> {
    return this.repository.find({
      where: {
        employeeId,
        status: 'approved',
        createdAt: MoreThanOrEqual(since),
      },
    });
  }
}
