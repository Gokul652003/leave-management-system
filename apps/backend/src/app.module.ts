import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { validate } from './config/env.validation';
import { createTypeOrmOptions } from './config/typeorm.config';
import { EmployeesModule } from './modules/employees/employees.module';
import { LeavesModule } from './modules/leaves/leaves.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { PoliciesModule } from './modules/policies/policies.module';
import { RolesModule } from './modules/roles/roles.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createTypeOrmOptions(config),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SUPABASE_JWT_SECRET'),
      }),
    }),
    EmployeesModule,
    LeavesModule,
    ApprovalsModule,
    PoliciesModule,
    RolesModule,
    DepartmentsModule,
    SettingsModule,
    NotificationsModule,
    ReportsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
