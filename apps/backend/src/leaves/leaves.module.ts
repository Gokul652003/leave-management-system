import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from '../employees/employees.module';
import { LeaveRequest } from './entities/leave-request.entity';
import { LeaveType } from './entities/leave-type.entity';
import { LeaveRequestsController } from './leave-requests.controller';
import { LeaveRequestsServiceImpl } from './leave-requests.service';
import { LeavesController } from './leaves.controller';
import { LeavesServiceImpl } from './leaves.service';
import { TypeOrmLeaveRequestsRepository } from './repositories/leave-requests.repository';
import { TypeOrmLeavesRepository } from './repositories/leaves.repository';
import {
  LEAVE_REQUESTS_REPOSITORY,
  LEAVE_REQUESTS_SERVICE,
  LEAVES_REPOSITORY,
  LEAVES_SERVICE,
} from './tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveType, LeaveRequest]),
    EmployeesModule,
  ],
  controllers: [LeavesController, LeaveRequestsController],
  providers: [
    { provide: LEAVES_REPOSITORY, useClass: TypeOrmLeavesRepository },
    { provide: LEAVES_SERVICE, useClass: LeavesServiceImpl },
    {
      provide: LEAVE_REQUESTS_REPOSITORY,
      useClass: TypeOrmLeaveRequestsRepository,
    },
    { provide: LEAVE_REQUESTS_SERVICE, useClass: LeaveRequestsServiceImpl },
  ],
  exports: [LEAVES_SERVICE],
})
export class LeavesModule {}
