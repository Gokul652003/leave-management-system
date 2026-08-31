create table if not exists leaves.leave_requests (
  id uuid not null default gen_random_uuid(),
  employee_id uuid not null,
  leave_type_code varchar(32) not null,
  start_date date not null,
  end_date date not null,
  half_day boolean not null default false,
  total_days numeric(5, 1) not null,
  reason text null,
  status varchar(16) not null default 'pending',
  reviewer_comments text null,
  reviewed_by uuid null,
  reviewed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint leave_requests_pkey primary key (id),
  constraint fk_leave_requests_employee foreign key (employee_id)
    references employees.employees (id),
  constraint fk_leave_requests_leave_type foreign key (leave_type_code)
    references leaves.leave_types (code)
);

create index if not exists idx_leave_requests_employee_id
  on leaves.leave_requests (employee_id);

create index if not exists idx_leave_requests_status
  on leaves.leave_requests (status);
