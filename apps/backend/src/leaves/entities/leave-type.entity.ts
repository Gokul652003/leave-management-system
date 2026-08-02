import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'leave_types', schema: 'leaves' })
export class LeaveType extends BaseEntity {
  @Column({ type: 'varchar', length: 32, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', name: 'max_days_per_request', nullable: true })
  maxDaysPerRequest?: number | null;

  @Column({
    type: 'int',
    name: 'requires_documentation_over_days',
    nullable: true,
  })
  requiresDocumentationOverDays?: number | null;
}
