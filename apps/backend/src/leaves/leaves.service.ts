import { Inject, Injectable } from '@nestjs/common';
import { LeaveTypeResponseDto } from './dto/leave-type-response.dto';
import { LeaveType } from './entities/leave-type.entity';
import type { ILeavesRepository } from './interfaces/leaves-repository.interface';
import type { ILeavesService } from './interfaces/leaves-service.interface';
import { LEAVES_REPOSITORY } from './tokens';

@Injectable()
export class LeavesServiceImpl implements ILeavesService {
  constructor(
    @Inject(LEAVES_REPOSITORY)
    private readonly leavesRepository: ILeavesRepository,
  ) {}

  async findTypes(): Promise<LeaveTypeResponseDto[]> {
    const types = await this.leavesRepository.findAll();
    return types.map((type) => this.toResponse(type));
  }

  private toResponse(type: LeaveType): LeaveTypeResponseDto {
    return {
      id: type.code,
      name: type.name,
      maxDaysPerRequest: type.maxDaysPerRequest ?? null,
      requiresDocumentationOverDays:
        type.requiresDocumentationOverDays ?? null,
    };
  }
}
