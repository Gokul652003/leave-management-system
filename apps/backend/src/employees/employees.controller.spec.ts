import { EmployeesController } from './employees.controller';
import {
  createEmployeesControllerModule,
  createEmployeesServiceMock,
  type EmployeesServiceMock,
} from './test/module-fixtures';
import {
  createEmployeeDtoFixture,
  employeeResponseFixture,
} from './test/fixtures/employees.fixtures';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  const employeesService: EmployeesServiceMock = createEmployeesServiceMock();

  beforeEach(async () => {
    const module = await createEmployeesControllerModule(employeesService);
    controller = module.get<EmployeesController>(EmployeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service and wrap the result in ApiResponse data', async () => {
      employeesService.create.mockResolvedValue(employeeResponseFixture);

      const result = await controller.create(createEmployeeDtoFixture);

      expect(employeesService.create).toHaveBeenCalledWith(
        createEmployeeDtoFixture,
      );
      expect(result).toEqual({ data: employeeResponseFixture });
    });
  });
});
