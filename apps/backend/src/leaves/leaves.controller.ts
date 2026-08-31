import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { LeaveTypeResponseDto } from './dto/leave-type-response.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
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
  @Roles('admin', 'hr', 'manager', 'employee')
  async getTypes(): Promise<ApiResponse<{ types: LeaveTypeResponseDto[] }>> {
    const types = await this.leavesService.findTypes();
    return { data: { types } };
  }

  @Post('types')
  @Roles('admin', 'hr')
  async createType(
    @Body() dto: CreateLeaveTypeDto,
  ): Promise<ApiResponse<LeaveTypeResponseDto>> {
    const type = await this.leavesService.createType(dto);
    return { data: type };
  }

  @Patch('types/:code')
  @Roles('admin', 'hr')
  async updateType(
    @Param('code') code: string,
    @Body() dto: UpdateLeaveTypeDto,
  ): Promise<ApiResponse<LeaveTypeResponseDto>> {
    const type = await this.leavesService.updateType(code, dto);
    return { data: type };
  }

  @Delete('types/:code')
  @Roles('admin', 'hr')
  @HttpCode(204)
  async removeType(@Param('code') code: string): Promise<void> {
    await this.leavesService.removeType(code);
  }
}
