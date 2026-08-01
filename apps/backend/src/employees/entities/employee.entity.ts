import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'employees', schema: 'employees' })
export class Employee extends BaseEntity {
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  department: string;

  @Column({ type: 'varchar', length: 100 })
  role: string;

  @Column({ type: 'int', name: 'manager_id', nullable: true })
  managerId?: number | null;

  @Column({ type: 'date', name: 'join_date', nullable: true })
  joinDate?: string | null;

  @Column({
    type: 'varchar',
    length: 32,
    name: 'employee_id',
    unique: true,
  })
  employeeId: string;

  @Column({ type: 'varchar', length: 32, default: 'Active' })
  status: string;
}
