import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { LeaveTypeResponseDto } from './dto/leave-type-response.dto';
import type { ILeavesService } from './interfaces/leaves-service.interface';
import { LEAVES_SERVICE } from './tokens';

@Controller('leaves')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeavesController {
  constructor(
    @Inject(LEAVES_SERVICE)
    private readonly leavesService: ILeavesService,
  ) {}

  @Get('types')
  @Roles('employee')
  async getTypes(): Promise<ApiResponse<{ types: LeaveTypeResponseDto[] }>> {
    const types = await this.leavesService.findTypes();
    return { data: { types } };
  }
}
