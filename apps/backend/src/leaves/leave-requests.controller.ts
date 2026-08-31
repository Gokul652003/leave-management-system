import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import {
  LeaveBalanceDto,
  LeaveRequestResponseDto,
} from './dto/leave-request-response.dto';
import { RejectLeaveRequestDto } from './dto/reject-leave-request.dto';
import type { ILeaveRequestsService } from './interfaces/leave-requests-service.interface';
import { LEAVE_REQUESTS_SERVICE } from './tokens';

const ALL_ROLES = ['admin', 'hr', 'manager', 'employee'] as const;
const REVIEWER_ROLES = ['admin', 'hr', 'manager'] as const;

@Controller('leaves/requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveRequestsController {
  constructor(
    @Inject(LEAVE_REQUESTS_SERVICE)
    private readonly leaveRequestsService: ILeaveRequestsService,
  ) {}

  @Post()
  @Roles(...ALL_ROLES)
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateLeaveRequestDto,
  ): Promise<ApiResponse<LeaveRequestResponseDto>> {
    const request = await this.leaveRequestsService.create(userId, dto);
    return { data: request };
  }

  @Get('me')
  @Roles(...ALL_ROLES)
  async findMine(
    @CurrentUser('id') userId: string,
  ): Promise<ApiResponse<{ requests: LeaveRequestResponseDto[] }>> {
    const requests = await this.leaveRequestsService.findMine(userId);
    return { data: { requests } };
  }

  @Get('balances')
  @Roles(...ALL_ROLES)
  async getBalances(
    @CurrentUser('id') userId: string,
  ): Promise<ApiResponse<{ balances: LeaveBalanceDto[] }>> {
    const balances = await this.leaveRequestsService.getBalances(userId);
    return { data: { balances } };
  }

  @Get()
  @Roles(...REVIEWER_ROLES)
  async findAll(
    @Query('status') status?: string,
  ): Promise<ApiResponse<{ requests: LeaveRequestResponseDto[] }>> {
    const requests = await this.leaveRequestsService.findAll(status);
    return { data: { requests } };
  }

  @Get(':id')
  @Roles(...REVIEWER_ROLES)
  async findById(
    @Param('id') id: string,
  ): Promise<ApiResponse<LeaveRequestResponseDto>> {
    const request = await this.leaveRequestsService.findById(id);
    return { data: request };
  }

  @Patch(':id/approve')
  @Roles(...REVIEWER_ROLES)
  async approve(
    @Param('id') id: string,
    @CurrentUser('id') reviewerUserId: string,
  ): Promise<ApiResponse<LeaveRequestResponseDto>> {
    const request = await this.leaveRequestsService.approve(id, reviewerUserId);
    return { data: request };
  }

  @Patch(':id/reject')
  @Roles(...REVIEWER_ROLES)
  async reject(
    @Param('id') id: string,
    @CurrentUser('id') reviewerUserId: string,
    @Body() dto: RejectLeaveRequestDto,
  ): Promise<ApiResponse<LeaveRequestResponseDto>> {
    const request = await this.leaveRequestsService.reject(
      id,
      reviewerUserId,
      dto,
    );
    return { data: request };
  }
}
