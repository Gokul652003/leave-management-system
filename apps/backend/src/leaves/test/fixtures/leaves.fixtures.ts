import { LeaveTypeResponseDto } from '../../dto/leave-type-response.dto';
import { LeaveType } from '../../entities/leave-type.entity';

export const leaveTypeEntityFixture: LeaveType = {
  id: '9f1c2d3e-4b5a-4c6d-8e7f-123456789abc',
  code: 'annual',
  name: 'Annual Leave',
  maxDaysPerRequest: 30,
  requiresDocumentationOverDays: null,
  createdAt: new Date('2024-01-01T10:00:00Z'),
  updatedAt: new Date('2024-01-01T10:00:00Z'),
  deletedAt: null,
};

export const leaveTypeResponseFixture: LeaveTypeResponseDto = {
  id: 'annual',
  name: 'Annual Leave',
  maxDaysPerRequest: 30,
  requiresDocumentationOverDays: null,
};

export const leaveTypesEntityFixtures: LeaveType[] = [
  leaveTypeEntityFixture,
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-abcdef123456',
    code: 'sick',
    name: 'Sick Leave',
    maxDaysPerRequest: 15,
    requiresDocumentationOverDays: 3,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
    deletedAt: null,
  },
];

export const leaveTypesResponseFixtures: LeaveTypeResponseDto[] = [
  leaveTypeResponseFixture,
  {
    id: 'sick',
    name: 'Sick Leave',
    maxDaysPerRequest: 15,
    requiresDocumentationOverDays: 3,
  },
];
