import { LeavesServiceImpl } from './leaves.service';
import {
  createLeavesRepositoryMock,
  createLeavesServiceModule,
  type LeavesRepositoryMock,
} from './test/module-fixtures';
import {
  leaveTypesEntityFixtures,
  leaveTypesResponseFixtures,
} from './test/fixtures/leaves.fixtures';

describe('LeavesService', () => {
  let service: LeavesServiceImpl;
  const leavesRepository: LeavesRepositoryMock = createLeavesRepositoryMock();

  beforeEach(async () => {
    const module = await createLeavesServiceModule(leavesRepository);
    service = module.get<LeavesServiceImpl>(LeavesServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findTypes', () => {
    it('should map leave type entities to response dto', async () => {
      leavesRepository.findAll.mockResolvedValue(leaveTypesEntityFixtures);

      const result = await service.findTypes();

      expect(leavesRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(leaveTypesResponseFixtures);
    });

    it('should return an empty list when no leave types exist', async () => {
      leavesRepository.findAll.mockResolvedValue([]);

      const result = await service.findTypes();

      expect(result).toEqual([]);
    });
  });
});
