alter table employees.employees
  add column user_id uuid null,
  add constraint uq_employees_user_id unique (user_id);
