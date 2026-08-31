export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export const EMPLOYEE_API_PATHS = {
  create: () => '/employees',
  list: () => '/employees',
  profile: (employeeId: string) => `/employees/${employeeId}/profile`,
  accessRoles: () => '/employees/access-roles',
  updateAccessRole: (employeeId: string) =>
    `/employees/${employeeId}/access-role`,
} as const;

export const EMPLOYEE_QUERY_KEYS = {
  all: ['employees'] as const,
  list: ['employees', 'list'] as const,
  profile: (employeeId: string) => ['employees', employeeId, 'profile'] as const,
  accessRoles: ['employees', 'access-roles'] as const,
};

export const LEAVE_API_PATHS = {
  types: () => '/leaves/types',
  type: (code: string) => `/leaves/types/${code}`,
  requests: () => '/leaves/requests',
  myRequests: () => '/leaves/requests/me',
  balances: () => '/leaves/requests/balances',
  request: (id: string) => `/leaves/requests/${id}`,
  approve: (id: string) => `/leaves/requests/${id}/approve`,
  reject: (id: string) => `/leaves/requests/${id}/reject`,
} as const;

export const LEAVE_QUERY_KEYS = {
  types: ['leaves', 'types'] as const,
  myRequests: ['leaves', 'requests', 'me'] as const,
  balances: ['leaves', 'requests', 'balances'] as const,
  requests: (status?: string) => ['leaves', 'requests', status ?? 'all'] as const,
  request: (id: string) => ['leaves', 'requests', id] as const,
};
