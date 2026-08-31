import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { LeaveTypeResponseDto } from './dto/leave-type-response.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
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

  async findTypeByCode(code: string): Promise<LeaveTypeResponseDto | null> {
    const type = await this.leavesRepository.findByCode(code);
    return type ? this.toResponse(type) : null;
  }

  async createType(dto: CreateLeaveTypeDto): Promise<LeaveTypeResponseDto> {
    const existing = await this.leavesRepository.findByCode(dto.code);

    if (existing) {
      throw new UnprocessableEntityException('Leave type code already exists');
    }

    const type = this.leavesRepository.create({
      code: dto.code,
      name: dto.name,
      annualQuota: dto.annualQuota ?? null,
      maxDaysPerRequest: dto.maxDaysPerRequest ?? null,
      requiresDocumentationOverDays: dto.requiresDocumentationOverDays ?? null,
    });

    const saved = await this.leavesRepository.save(type);
    return this.toResponse(saved);
  }

  async updateType(
    code: string,
    dto: UpdateLeaveTypeDto,
  ): Promise<LeaveTypeResponseDto> {
    const type = await this.leavesRepository.findByCode(code);

    if (!type) {
      throw new NotFoundException('Leave type not found');
    }

    Object.assign(type, dto);
    const saved = await this.leavesRepository.save(type);
    return this.toResponse(saved);
  }

  async removeType(code: string): Promise<void> {
    const type = await this.leavesRepository.findByCode(code);

    if (!type) {
      throw new NotFoundException('Leave type not found');
    }

    await this.leavesRepository.remove(type);
  }

  private toResponse(type: LeaveType): LeaveTypeResponseDto {
    return {
      id: type.code,
      name: type.name,
      annualQuota: type.annualQuota ?? null,
      maxDaysPerRequest: type.maxDaysPerRequest ?? null,
      requiresDocumentationOverDays: type.requiresDocumentationOverDays ?? null,
    };
  }
}
