import { TypeOrmLeavesRepository } from './leaves.repository';
import {
  createLeavesRepositoryModule,
  createTypeOrmRepositoryMock,
  type TypeOrmRepositoryMock,
} from '../test/module-fixtures';
import { leaveTypesEntityFixtures } from '../test/fixtures/leaves.fixtures';

describe('TypeOrmLeavesRepository', () => {
  let repository: TypeOrmLeavesRepository;
  const typeOrmRepo: TypeOrmRepositoryMock = createTypeOrmRepositoryMock();

  beforeEach(async () => {
    const module = await createLeavesRepositoryModule(typeOrmRepo);
    repository = module.get<TypeOrmLeavesRepository>(TypeOrmLeavesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to typeorm find', async () => {
      typeOrmRepo.find.mockResolvedValue(leaveTypesEntityFixtures);

      const result = await repository.findAll();

      expect(typeOrmRepo.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(leaveTypesEntityFixtures);
    });
  });
});
