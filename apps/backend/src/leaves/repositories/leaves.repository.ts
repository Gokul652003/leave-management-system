import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveType } from '../entities/leave-type.entity';
import type { ILeavesRepository } from '../interfaces/leaves-repository.interface';

@Injectable()
export class TypeOrmLeavesRepository implements ILeavesRepository {
  constructor(
    @InjectRepository(LeaveType)
    private readonly repository: Repository<LeaveType>,
  ) {}

  findAll(): Promise<LeaveType[]> {
    return this.repository.find();
  }
}
