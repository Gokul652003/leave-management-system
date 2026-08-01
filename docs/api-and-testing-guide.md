# Backend: Writing APIs and Unit Tests

This guide explains how to build a new API endpoint and how to test it, following the patterns used in this codebase (NestJS + TypeORM + Jest). It explains *why* each layer exists and *how* they fit together.

---

## 1. Layered architecture

Every feature follows a strict layering. The rule is: **each layer may only depend on abstractions (interfaces), never on concrete classes of the layer below it.**

```
┌─────────────────────────────┐
│ Controller  (HTTP layer)    │  → depends on I<Feature>Service (interface)
├─────────────────────────────┤
│ Service     (business layer)│  → depends on I<Feature>Repository (interface)
├─────────────────────────────┤
│ Repository  (data layer)    │  → depends on TypeORM Repository<Entity>
├─────────────────────────────┤
│ Entity      (database)      │  → extends BaseEntity
└─────────────────────────────┘
```

Why:

- **Testability** – you can mock each dependency (a fake service, a fake repository) and test one layer in isolation without a database or HTTP server.
- **Dependency Inversion** – the high-level policy (service) no longer imports the low-level detail (TypeORM). Swap a database with an in-memory store by changing a single provider binding in the module.
- **No entity leaks** – the controller returns a **DTO** (Data Transfer Object), not the raw database entity. This decouples the API contract from the database schema.

---

## 2. The pieces of an API feature

Using the existing `employees` module as reference.

### 2.1 Base entity

Every entity extends `src/common/entities/base.entity.ts` so the primary key and audit columns are defined once.

```ts
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;   // enables soft deletes
}
```

### 2.2 Entity

```ts
@Entity('employees')
export class Employee extends BaseEntity {
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;
  // ...
}
```

### 2.3 Interfaces (abstractions)

Defining interfaces means dependents inject an *abstraction*, and the module later binds it to a concrete implementation.

```ts
// interfaces/employees-repository.interface.ts
export interface IEmployeesRepository {
  findByEmail(email: string): Promise<Employee | null>;
  create(data: Partial<Employee>): Employee;
  save(employee: Employee): Promise<Employee>;
}

// interfaces/employees-service.interface.ts
export interface IEmployeesService {
  create(dto: CreateEmployeeDto): Promise<EmployeeResponseDto>;
}
```

### 2.4 Tokens (injection keys)

NestJS injects by **token**, not by type. We export string tokens so the controller/service ask for the interface by token and the module maps the token to a concrete class.

```ts
// tokens.ts
export const EMPLOYEES_REPOSITORY = 'EMPLOYEES_REPOSITORY';
export const EMPLOYEES_SERVICE = 'EMPLOYEES_SERVICE';
```

### 2.5 Repository (the only layer that touches the entity)

```ts
@Injectable()
export class TypeOrmEmployeesRepository implements IEmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repository: Repository<Employee>,
  ) {}

  findByEmail(email: string): Promise<Employee | null> {
    return this.repository.findOne({ where: { email } });
  }

  create(data: Partial<Employee>): Employee {
    return this.repository.create(data);
  }

  save(employee: Employee): Promise<Employee> {
    return this.repository.save(employee);
  }
}
```

Why: all database queries live here. The service never imports `Repository` from TypeORM.

### 2.6 Service

```ts
@Injectable()
export class EmployeesServiceImpl implements IEmployeesService {
  constructor(
    @Inject(EMPLOYEES_REPOSITORY)
    private readonly employeesRepository: IEmployeesRepository,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    const existing = await this.employeesRepository.findByEmail(dto.email);
    if (existing) {
      throw new UnprocessableEntityException('Email already exists');
    }
    // ... business rules, then map to the response DTO
    return this.toResponse(saved);
  }

  private toResponse(employee: Employee): EmployeeResponseDto { /* ... */ }
}
```

### 2.7 Controller

```ts
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(
    @Inject(EMPLOYEES_SERVICE)
    private readonly employeesService: IEmployeesService,
  ) {}

  @Post()
  @Roles('admin', 'hr')
  async create(@Body() dto: CreateEmployeeDto): Promise<ApiResponse<EmployeeResponseDto>> {
    const employee = await this.employeesService.create(dto);
    return { data: employee };
  }
}
```

Notes:

- The controller depends only on `IEmployeesService` (an interface) injected via the token.
- The return type is `ApiResponse<...>` – a discriminated union. **Success has only `data`; failure has `data: null` + `error`.** There is no `error: null` in successful responses.

```ts
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
// ApiSuccess<T> = { data: T }
// ApiFailure   = { data: null; error: ApiError }
```

### 2.8 Module wiring

The module is where abstractions are bound to implementations:

```ts
@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeesController],
  providers: [
    { provide: EMPLOYEES_REPOSITORY, useClass: TypeOrmEmployeesRepository },
    { provide: EMPLOYEES_SERVICE, useClass: EmployeesServiceImpl },
  ],
  exports: [EMPLOYEES_SERVICE],
})
export class EmployeesModule {}
```

To swap implementations later (e.g. a fake repository), change **only** the `useClass` binding here. No other file changes.

---

## 3. How to write unit tests

Test each layer in isolation, **mocking the layer below it**.

```
Controller test  → mock IEmployeesService (via EMPLOYEES_SERVICE token)
Service test     → mock IEmployeesRepository (via EMPLOYEES_REPOSITORY token)
Repository test  → mock TypeORM Repository<Employee> (via getRepositoryToken(Employee))
```

### 3.1 Fixtures

Fixtures are **shared, typed, real-looking test data**. Put them in `test/fixtures/`.

Why: they remove duplication, keep every test in sync with the real DTO/entity shape, and changing a field in one place updates all tests.

```ts
export const createEmployeeDtoFixture: CreateEmployeeDto = {
  name: 'Ravi Kumar',
  email: 'r.kumar@acme.corp',
  department: 'Engineering',
  role: 'Backend Engineer',
  managerId: 2940,
  joinDate: '2024-02-01',
};

export const employeeEntityFixture: Employee = { /* full entity row */ };
export const employeeResponseFixture: EmployeeResponseDto = { /* API payload */ };
```

### 3.2 Module fixtures

Module fixtures centralize how a `TestingModule` is built for each layer, so every spec uses the exact same wiring.

```ts
// test/module-fixtures.ts
export function createEmployeesServiceMock(): EmployeesServiceMock {
  return { create: jest.fn() };
}

export async function createEmployeesControllerModule(
  employeesService: EmployeesServiceMock,
): Promise<TestingModule> {
  return Test.createTestingModule({
    controllers: [EmployeesController],
    providers: [
      Reflector,                                        // RolesGuard dep
      { provide: ConfigService, useValue: { get: jest.fn() } }, // JwtAuthGuard dep
      { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      { provide: EMPLOYEES_SERVICE, useValue: employeesService },
    ],
  }).compile();
}
```

Why `provide: TOKEN, useValue: mock`: this tells Nest "when anyone injects this token, hand them the mock." The controller then receives the fake service and never touches a real DB.

### 3.3 beforeEach – why fresh state per test

```ts
beforeEach(async () => {
  const module = await createEmployeesControllerModule(employeesService);
  controller = module.get<EmployeesController>(EmployeesController);
});
```

- `beforeEach` runs before **every** test, giving each one a fresh module and fresh mocks.
- `jest.fn()` records calls and return values; if tests shared one mock, call history and stubs would leak between tests and make assertions unreliable.
- Nest caches singletons inside a module, so a new module = a new isolated instance.

### 3.4 Controller test

Pattern: **mock the injected interface → call the method → assert it delegated to the mock → assert the return shape**.

```ts
it('should call the service and wrap the result in ApiResponse data', async () => {
  employeesService.create.mockResolvedValue(employeeResponseFixture); // (1) arrange

  const result = await controller.create(createEmployeeDtoFixture);   // (2) act

  expect(employeesService.create).toHaveBeenCalledWith(               // (3) delegation
    createEmployeeDtoFixture,
  );
  expect(result).toEqual({ data: employeeResponseFixture });          // (4) contract
});
```

Why assert the wrapper too: the controller is responsible for shaping the HTTP response (`{ data }`), not the service.

### 3.5 Service test

Mock the repository. Test both the happy path and the error path.

```ts
it('should throw UnprocessableEntityException when email already exists', async () => {
  employeesRepository.findByEmail.mockResolvedValue(employeeEntityFixture);

  await expect(service.create(createEmployeeDtoFixture)).rejects.toBeInstanceOf(
    UnprocessableEntityException,
  );
});

it('should create employee and return response dto', async () => {
  employeesRepository.findByEmail.mockResolvedValue(null);
  employeesRepository.create.mockImplementation((data: Partial<Employee>) => data);
  employeesRepository.save
    .mockResolvedValueOnce(employeeEntityFixture)
    .mockResolvedValueOnce(employeeEntityFixture);

  const result = await service.create(createEmployeeDtoFixture);

  expect(result).toEqual(employeeResponseFixture);
});
```

### 3.6 Repository test

Mock the TypeORM `Repository` and verify delegation.

```ts
it('should delegate to typeorm findOne with email filter', async () => {
  typeOrmRepo.findOne.mockResolvedValue(employeeEntityFixture);

  const result = await repository.findByEmail(employeeEntityFixture.email);

  expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
    where: { email: employeeEntityFixture.email },
  });
  expect(result).toEqual(employeeEntityFixture);
});
```

---

## 4. Common Jest mock methods

| Method                    | What it does                                              | When to use                          |
| ------------------------- | --------------------------------------------------------- | ------------------------------------ |
| `mockResolvedValue(x)`    | async fn resolves with `x`                                 | happy-path async tests               |
| `mockResolvedValueOnce(x)`| resolves with `x` for the **next** call only               | multi-step flows (e.g. two saves)    |
| `mockRejectedValue(e)`    | async fn rejects with `e`                                  | error-path tests                     |
| `mockReturnValue(x)`      | sync fn returns `x`                                        | synchronous methods                  |
| `mockImplementation(fn)`  | replace the implementation entirely                        | when you need custom behavior        |

---

## 5. Running the tests

```bash
# unit tests (backend workspace)
cd apps/backend && npm run test

# e2e tests
cd apps/backend && npm run test:e2e

# from repo root (delegates to backend's ts-jest config via jest.config.js)
npm test
```

> Note: run jest from the repo root or the backend dir — a root `jest.config.js` exists so ts-jest (not babel) is used to transform TypeScript.

---

## 6. Checklist for adding a new feature

1. Entity extends `BaseEntity`.
2. DTOs: one `Create<Feature>Dto` for input, one `<Feature>ResponseDto` for output.
3. `I<Feature>Service` and `I<Feature>Repository` interfaces + `tokens.ts`.
4. Repository implements the repository interface (only layer touching TypeORM).
5. Service implements the service interface; maps entity → response DTO; returns `ApiResponse` via controller.
6. Module binds tokens to implementations with `useClass`.
7. Tests: fixtures + module fixtures + controller/service/repository specs.
8. `npm run test`, `npm run test:e2e`, and `npm run build` all pass.

---

## 7. Commit & Pull Request conventions

### 7.1 Commit message format

Use **Conventional Commits**: `<ticket-no> <type>(<scope>): <subject>`. The **Jira ticket key comes first**, the scope is the **application layer** (`api` for backend, `web` for frontend) — not the feature/module — and the body must link to the relevant Confluence doc.

```
LMA-23 feat(api): add POST /api/employees endpoint

- Add base entity with id/createdAt/updatedAt/deletedAt
- Add repository layer + service/repository interfaces
- Add unit tests for controller, service and repository

Docs: https://gokulkr652003-1779809183261.atlassian.net/wiki/spaces/LMA/pages/688131
```

Common types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`.

Scope examples: `api` (backend), `web` (frontend), `db` (migrations/scripts), `docs`.

Examples in this repo's style:

```bash
git commit -m "LMA-23 feat(api): add employee create endpoint"
git commit -m "LMA-30 fix(web): correct leave balance calculation"
git commit -m "LMA-2 chore(db): add supabase local dev setup"
```

### 7.2 Pull Request format

The **PR must link to the Jira ticket** (and reference the Confluence doc). Use a description template like this:

```
## Summary
What this change does and why.

## Type of change
- [ ] feat / fix / refactor / test / docs / chore

## Tests
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## References
- Jira: [LMA-23](https://gokulkr652003-1779809183261.atlassian.net/browse/LMA-23)
- Confluence: [API & Testing Guide](https://gokulkr652003-1779809183261.atlassian.net/wiki/spaces/LMA/pages/688131)
```

Rules:

- Title format matches the commit format: `<ticket-no> <type>(<scope>): <subject>` — e.g. `LMA-23 feat(api): add POST /api/employees endpoint`.
- Scope is the application layer (`api`, `web`, `db`, `docs`), not the feature name.
- Reference the Jira ticket in the title, summary, or as a linked Jira issue.
- Always link the relevant Confluence doc for context.
- Keep the subject under ~50 characters.

