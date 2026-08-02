create schema if not exists employees;

create table employees.employees (
  id uuid not null default gen_random_uuid(),
  name varchar(120) not null,
  email varchar(255) not null,
  department varchar(100) not null,
  role varchar(100) not null,
  manager_id int null,
  join_date date null,
  employee_id varchar(32) not null,
  status varchar(32) not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint employees_pkey primary key (id),
  constraint uq_employees_email unique (email),
  constraint uq_employees_employee_id unique (employee_id)
);
