import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeesController, MeController } from '../employees.controller';
import { EmployeesServiceImpl } from '../employees.service';
import { Employee } from '../entities/employee.entity';
import { TypeOrmEmployeesRepository } from '../repositories/employees.repository';
import { EMPLOYEES_REPOSITORY, EMPLOYEES_SERVICE } from '../tokens';

export interface EmployeesServiceMock {
  create: jest.Mock;
  findById: jest.Mock;
}

export interface EmployeesRepositoryMock {
  findById: jest.Mock;
  findByEmail: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
}

export interface TypeOrmRepositoryMock {
  findOneBy: jest.Mock;
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
}

export function createEmployeesServiceMock(): EmployeesServiceMock {
  return {
    create: jest.fn(),
    findById: jest.fn(),
  };
}

export function createEmployeesRepositoryMock(): EmployeesRepositoryMock {
  return {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
}

export function createTypeOrmRepositoryMock(): TypeOrmRepositoryMock {
  return {
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
): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [
      EmployeesServiceImpl,
      { provide: EMPLOYEES_REPOSITORY, useValue: employeesRepository },
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
