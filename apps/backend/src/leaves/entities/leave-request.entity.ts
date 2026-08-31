import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'leave_requests', schema: 'leaves' })
export class LeaveRequest extends BaseEntity {
  @Column({ type: 'uuid', name: 'employee_id' })
  employeeId: string;

  @Column({ type: 'varchar', length: 32, name: 'leave_type_code' })
  leaveTypeCode: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate: string;

  @Column({ type: 'date', name: 'end_date' })
  endDate: string;

  @Column({ type: 'boolean', name: 'half_day', default: false })
  halfDay: boolean;

  @Column({ type: 'numeric', name: 'total_days' })
  totalDays: number;

  @Column({ type: 'text', nullable: true })
  reason?: string | null;

  @Column({ type: 'varchar', length: 16, default: 'pending' })
  status: string;

  @Column({ type: 'text', name: 'reviewer_comments', nullable: true })
  reviewerComments?: string | null;

  @Column({ type: 'uuid', name: 'reviewed_by', nullable: true })
  reviewedBy?: string | null;

  @Column({ type: 'timestamptz', name: 'reviewed_at', nullable: true })
  reviewedAt?: Date | null;
}
