import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeesController, MeController } from '../employees.controller';
import { EmployeesServiceImpl } from '../employees.service';
import { Employee } from '../entities/employee.entity';
import { TypeOrmEmployeesRepository } from '../repositories/employees.repository';
import { SupabaseAdminService } from '../../common/supabase/supabase-admin.service';
import { EMPLOYEES_REPOSITORY, EMPLOYEES_SERVICE } from '../tokens';

export interface EmployeesServiceMock {
  create: jest.Mock;
  findAll: jest.Mock;
  findByUserId: jest.Mock;
  getProfile: jest.Mock;
  listWithAccessRoles: jest.Mock;
  updateAccessRole: jest.Mock;
}

export interface EmployeesRepositoryMock {
  findAll: jest.Mock;
  findByUserId: jest.Mock;
  findByEmployeeId: jest.Mock;
  findByEmail: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
}

export interface TypeOrmRepositoryMock {
  find: jest.Mock;
  findOneBy: jest.Mock;
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
}

export interface SupabaseAdminServiceMock {
  listUserRoles: jest.Mock;
  updateUserRole: jest.Mock;
}

export function createEmployeesServiceMock(): EmployeesServiceMock {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findByUserId: jest.fn(),
    getProfile: jest.fn(),
    listWithAccessRoles: jest.fn(),
    updateAccessRole: jest.fn(),
  };
}

export function createEmployeesRepositoryMock(): EmployeesRepositoryMock {
  return {
    findAll: jest.fn(),
    findByUserId: jest.fn(),
    findByEmployeeId: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
}

export function createSupabaseAdminServiceMock(): SupabaseAdminServiceMock {
  return {
    listUserRoles: jest.fn(),
    updateUserRole: jest.fn(),
  };
}

export function createTypeOrmRepositoryMock(): TypeOrmRepositoryMock {
  return {
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
}

export async function createEmployeesControllerModule(
  employeesService: EmployeesServiceMock,
): Promise<TestingModule> {
  return Test.createTestingModule({
    controllers: [EmployeesController, MeController],
    providers: [
      Reflector,
      { provide: ConfigService, useValue: { get: jest.fn() } },
      { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      { provide: EMPLOYEES_SERVICE, useValue: employeesService },
    ],
  }).compile();
}

export async function createEmployeesServiceModule(
  employeesRepository: EmployeesRepositoryMock,
  supabaseAdmin: SupabaseAdminServiceMock = createSupabaseAdminServiceMock(),
): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [
      EmployeesServiceImpl,
      { provide: EMPLOYEES_REPOSITORY, useValue: employeesRepository },
      { provide: SupabaseAdminService, useValue: supabaseAdmin },
    ],
  }).compile();
}

export async function createEmployeesRepositoryModule(
  typeOrmRepo: TypeOrmRepositoryMock,
): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [
      TypeOrmEmployeesRepository,
      { provide: getRepositoryToken(Employee), useValue: typeOrmRepo },
    ],
  }).compile();
}
