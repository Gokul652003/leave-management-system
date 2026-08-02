import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { LeaveType } from '../leaves/entities/leave-type.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [Employee, LeaveType],
  synchronize: false,
});

const employees: Partial<Employee>[] = [
  {
    name: 'Ravi Kumar',
    email: 'r.kumar@acme.corp',
    department: 'Engineering',
    role: 'Backend Engineer',
    managerId: 2940,
    joinDate: '2024-02-01',
    employeeId: 'EMP-3310-AC',
    status: 'Active',
  },
  {
    name: 'Priya Sharma',
    email: 'p.sharma@acme.corp',
    department: 'Engineering',
    role: 'Frontend Engineer',
    managerId: 2940,
    joinDate: '2024-06-15',
    employeeId: 'EMP-3311-AC',
    status: 'Active',
  },
];

const leaveTypes: Partial<LeaveType>[] = [
  { code: 'annual', name: 'Annual Leave', maxDaysPerRequest: 30 },
  { code: 'sick', name: 'Sick Leave', maxDaysPerRequest: 15, requiresDocumentationOverDays: 3 },
  { code: 'unpaid', name: 'Unpaid Leave' },
  { code: 'bereavement', name: 'Bereavement' },
  { code: 'maternity', name: 'Maternity/Paternity', maxDaysPerRequest: 120 },
];

async function seed() {
  await dataSource.initialize();
  try {
    for (const data of employees) {
      const existing = await dataSource
        .getRepository(Employee)
        .findOneBy({ email: data.email });
      if (existing) {
        console.log(`Skipping ${data.email}, already exists`);
        continue;
      }
      const employee = dataSource.getRepository(Employee).create(data);
      await dataSource.getRepository(Employee).save(employee);
      console.log(`Seeded ${data.email}`);
    }
    for (const data of leaveTypes) {
      const existing = await dataSource
        .getRepository(LeaveType)
        .findOneBy({ code: data.code });
      if (existing) {
        console.log(`Skipping ${data.code}, already exists`);
        continue;
      }
      const leaveType = dataSource.getRepository(LeaveType).create(data);
      await dataSource.getRepository(LeaveType).save(leaveType);
      console.log(`Seeded leave type ${data.code}`);
    }
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
