import { TypeOrmEmployeesRepository } from './employees.repository';
import {
  createEmployeesRepositoryModule,
  createTypeOrmRepositoryMock,
  type TypeOrmRepositoryMock,
} from '../test/module-fixtures';
import {
  employeeEntityFixture,
  userIdDtoFixture,
} from '../test/fixtures/employees.fixtures';

describe('TypeOrmEmployeesRepository', () => {
  let repository: TypeOrmEmployeesRepository;
  const typeOrmRepo: TypeOrmRepositoryMock = createTypeOrmRepositoryMock();

  beforeEach(async () => {
    const module = await createEmployeesRepositoryModule(typeOrmRepo);
    repository = module.get<TypeOrmEmployeesRepository>(
      TypeOrmEmployeesRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmployeeId', () => {
    it('should delegate to typeorm findOne with employeeId filter', async () => {
      typeOrmRepo.findOne.mockResolvedValue(employeeEntityFixture);

      const result = await repository.findByEmployeeId(
        employeeEntityFixture.employeeId,
      );

      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { employeeId: employeeEntityFixture.employeeId },
      });
      expect(result).toEqual(employeeEntityFixture);
    });
  });

  describe('findByEmail', () => {
    it('should delegate to typeorm findOne with email filter', async () => {
      typeOrmRepo.findOne.mockResolvedValue(employeeEntityFixture);

      const result = await repository.findByEmail(employeeEntityFixture.email);

      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { email: employeeEntityFixture.email },
      });
      expect(result).toEqual(employeeEntityFixture);
    });
  });

  describe('create', () => {
    it('should delegate to typeorm create', () => {
      typeOrmRepo.create.mockReturnValue(employeeEntityFixture);

      const data = { name: employeeEntityFixture.name };
      const result = repository.create(data);

      expect(typeOrmRepo.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(employeeEntityFixture);
    });
  });

  describe('save', () => {
    it('should delegate to typeorm save', async () => {
      typeOrmRepo.save.mockResolvedValue(employeeEntityFixture);

      const result = await repository.save(employeeEntityFixture);

      expect(typeOrmRepo.save).toHaveBeenCalledWith(employeeEntityFixture);
      expect(result).toEqual(employeeEntityFixture);
    });
  });

  describe('findByUserId', () => {
    it('should delegate to typeorm findOneBy with userId filter', () => {
      typeOrmRepo.findOneBy.mockReturnValue(employeeEntityFixture);

      const result = repository.findByUserId(userIdDtoFixture.id);

      expect(typeOrmRepo.findOneBy).toHaveBeenCalledWith({
        userId: userIdDtoFixture.id,
      });
      expect(result).toEqual(employeeEntityFixture);
    });
  });
});
