import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeesController } from './employees.controller';
import { EmployeesServiceImpl } from './employees.service';
import { TypeOrmEmployeesRepository } from './repositories/employees.repository';
import { EMPLOYEES_REPOSITORY, EMPLOYEES_SERVICE } from './tokens';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeesController],
  providers: [
    { provide: EMPLOYEES_REPOSITORY, useClass: TypeOrmEmployeesRepository },
    { provide: EMPLOYEES_SERVICE, useClass: EmployeesServiceImpl },
  ],
  exports: [EMPLOYEES_SERVICE],
})
export class EmployeesModule {}
