import { LeavesController } from './leaves.controller';
import {
  createLeavesControllerModule,
  createLeavesServiceMock,
  type LeavesServiceMock,
} from './test/module-fixtures';
import { leaveTypesResponseFixtures } from './test/fixtures/leaves.fixtures';

describe('LeavesController', () => {
  let controller: LeavesController;
  const leavesService: LeavesServiceMock = createLeavesServiceMock();

  beforeEach(async () => {
    const module = await createLeavesControllerModule(leavesService);
    controller = module.get<LeavesController>(LeavesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTypes', () => {
    it('should call the service and wrap the result in ApiResponse data', async () => {
      leavesService.findTypes.mockResolvedValue(leaveTypesResponseFixtures);

      const result = await controller.getTypes();

      expect(leavesService.findTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ data: { types: leaveTypesResponseFixtures } });
    });
  });
});
