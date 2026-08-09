import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EmployeesServiceImpl } from './employees.service';
import { Employee } from './entities/employee.entity';
import {
  createEmployeesRepositoryMock,
  createEmployeesServiceModule,
  type EmployeesRepositoryMock,
} from './test/module-fixtures';
import {
  createEmployeeDtoFixture,
  employeeEntityFixture,
  employeeResponseFixture,
  meResponseFixture,
  userIdDtoFixture,
} from './test/fixtures/employees.fixtures';

describe('EmployeesService', () => {
  let service: EmployeesServiceImpl;
  const employeesRepository: EmployeesRepositoryMock =
    createEmployeesRepositoryMock();

  beforeEach(async () => {
    const module = await createEmployeesServiceModule(employeesRepository);
    service = module.get<EmployeesServiceImpl>(EmployeesServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw UnprocessableEntityException when email already exists', async () => {
      employeesRepository.findByEmail.mockResolvedValue(employeeEntityFixture);

      await expect(
        service.create(createEmployeeDtoFixture),
      ).rejects.toBeInstanceOf(UnprocessableEntityException);
      expect(employeesRepository.findByEmail).toHaveBeenCalledWith(
        createEmployeeDtoFixture.email,
      );
    });

    it('should create employee with EMP-xxxx-AC employeeId and return response dto', async () => {
      employeesRepository.findByEmail.mockResolvedValue(null);
      employeesRepository.create.mockImplementation(
        (data: Partial<Employee>) => data,
      );
      employeesRepository.save.mockResolvedValueOnce(employeeEntityFixture);

      const result = await service.create(createEmployeeDtoFixture);

      expect(result).toEqual(employeeResponseFixture);
      expect(employeesRepository.create).toHaveBeenCalledWith({
        name: 'Ravi Kumar',
        email: 'r.kumar@acme.corp',
        department: 'Engineering',
        role: 'Backend Engineer',
        managerId: 2940,
        joinDate: '2024-02-01',
        employeeId: expect.stringMatching(/^EMP-\d{4}-AC$/) as string,
        status: 'Active',
      });
      expect(employeesRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByUserId', () => {
    it('should throw NotFoundException when user with id not found', async () => {
      employeesRepository.findByUserId.mockResolvedValue(null);

      await expect(
        service.findByUserId(userIdDtoFixture.id),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should find employee with id and return response dto', async () => {
      employeesRepository.findByUserId.mockResolvedValue(employeeEntityFixture);

      const result = await service.findByUserId(userIdDtoFixture.id);
      expect(result).toEqual(meResponseFixture);
      expect(employeesRepository.findByUserId).toHaveBeenCalledWith(
        userIdDtoFixture.id,
      );
    });
  });

  describe('getProfile', () => {
    it('should throw NotFoundException when employee with employeeId not found', async () => {
      employeesRepository.findByEmployeeId.mockResolvedValue(null);

      await expect(
        service.getProfile(employeeEntityFixture.employeeId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should find employee by employeeId and return response dto', async () => {
      employeesRepository.findByEmployeeId.mockResolvedValue(
        employeeEntityFixture,
      );

      const result = await service.getProfile(employeeEntityFixture.employeeId);

      expect(result).toEqual(employeeResponseFixture);
      expect(employeesRepository.findByEmployeeId).toHaveBeenCalledWith(
        employeeEntityFixture.employeeId,
      );
    });
  });
});
