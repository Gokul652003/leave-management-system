import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveType } from './entities/leave-type.entity';
import { LeavesController } from './leaves.controller';
import { LeavesServiceImpl } from './leaves.service';
import { TypeOrmLeavesRepository } from './repositories/leaves.repository';
import { LEAVES_REPOSITORY, LEAVES_SERVICE } from './tokens';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveType])],
  controllers: [LeavesController],
  providers: [
    { provide: LEAVES_REPOSITORY, useClass: TypeOrmLeavesRepository },
    { provide: LEAVES_SERVICE, useClass: LeavesServiceImpl },
  ],
  exports: [LEAVES_SERVICE],
})
export class LeavesModule {}
