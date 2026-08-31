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

  findByCode(code: string): Promise<LeaveType | null> {
    return this.repository.findOne({ where: { code } });
  }

  create(data: Partial<LeaveType>): LeaveType {
    return this.repository.create(data);
  }

  save(type: LeaveType): Promise<LeaveType> {
    return this.repository.save(type);
  }

  remove(type: LeaveType): Promise<LeaveType> {
    return this.repository.softRemove(type);
  }
}
