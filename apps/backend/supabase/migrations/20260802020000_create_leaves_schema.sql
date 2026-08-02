create schema if not exists leaves;

create table if not exists leaves.leave_types (
  id uuid not null default gen_random_uuid(),
  code varchar(32) not null,
  name varchar(100) not null,
  max_days_per_request int null,
  requires_documentation_over_days int null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint leave_types_pkey primary key (id),
  constraint uq_leave_types_code unique (code)
);
