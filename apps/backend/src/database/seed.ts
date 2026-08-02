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

interface AuthUserSeed {
  email: string;
  name: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  password: string;
}

const DEFAULT_AUTH_PASSWORD = 'Password123!';

const authUsers: AuthUserSeed[] = [
  {
    email: 'r.kumar@acme.corp',
    name: 'Ravi Kumar',
    role: 'employee',
    password: DEFAULT_AUTH_PASSWORD,
  },
  {
    email: 'p.sharma@acme.corp',
    name: 'Priya Sharma',
    role: 'employee',
    password: DEFAULT_AUTH_PASSWORD,
  },
  {
    email: 'admin@acme.corp',
    name: 'Admin User',
    role: 'admin',
    password: DEFAULT_AUTH_PASSWORD,
  },
  {
    email: 'hr@acme.corp',
    name: 'HR User',
    role: 'hr',
    password: DEFAULT_AUTH_PASSWORD,
  },
  {
    email: 'manager@acme.corp',
    name: 'Manager User',
    role: 'manager',
    password: DEFAULT_AUTH_PASSWORD,
  },
];

const authBaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function seedAuthUsers() {
  if (!authBaseUrl || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to seed auth users',
    );
  }

  for (const data of authUsers) {
    const response = await fetch(`${authBaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { name: data.name },
        app_metadata: { role: data.role },
      }),
    });

    if (response.ok) {
      console.log(`Seeded auth user ${data.email} (role: ${data.role})`);
    } else if (response.status === 422) {
      console.log(`Skipping auth user ${data.email}, already exists`);
    } else {
      const body = await response.text();
      throw new Error(
        `Failed to seed auth user ${data.email}: ${response.status} ${body}`,
      );
    }
  }
}

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
  {
    code: 'sick',
    name: 'Sick Leave',
    maxDaysPerRequest: 15,
    requiresDocumentationOverDays: 3,
  },
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
    await seedAuthUsers();
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
