import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LeavesController } from '../leaves.controller';
import { LeavesServiceImpl } from '../leaves.service';
import { LeaveType } from '../entities/leave-type.entity';
import { TypeOrmLeavesRepository } from '../repositories/leaves.repository';
import { LEAVES_REPOSITORY, LEAVES_SERVICE } from '../tokens';

export interface LeavesServiceMock {
  findTypes: jest.Mock;
}

export interface LeavesRepositoryMock {
  findAll: jest.Mock;
}

export interface TypeOrmRepositoryMock {
  find: jest.Mock;
}

export function createLeavesServiceMock(): LeavesServiceMock {
  return { findTypes: jest.fn() };
}

export function createLeavesRepositoryMock(): LeavesRepositoryMock {
  return { findAll: jest.fn() };
}

export function createTypeOrmRepositoryMock(): TypeOrmRepositoryMock {
  return { find: jest.fn() };
}

export async function createLeavesControllerModule(
  leavesService: LeavesServiceMock,
): Promise<TestingModule> {
  return Test.createTestingModule({
    controllers: [LeavesController],
    providers: [
      Reflector,
      { provide: ConfigService, useValue: { get: jest.fn() } },
      { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      { provide: LEAVES_SERVICE, useValue: leavesService },
    ],
  }).compile();
}

export async function createLeavesServiceModule(
  leavesRepository: LeavesRepositoryMock,
): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [
      LeavesServiceImpl,
      { provide: LEAVES_REPOSITORY, useValue: leavesRepository },
    ],
  }).compile();
}

export async function createLeavesRepositoryModule(
  typeOrmRepo: TypeOrmRepositoryMock,
): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [
      TypeOrmLeavesRepository,
      { provide: getRepositoryToken(LeaveType), useValue: typeOrmRepo },
    ],
  }).compile();
}
