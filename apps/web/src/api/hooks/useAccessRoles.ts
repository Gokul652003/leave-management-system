import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import { EMPLOYEE_API_PATHS, EMPLOYEE_QUERY_KEYS } from '../constants'
import type { AccessRole, ApiResponse, EmployeeAccessRole } from '../types'

export function useEmployeesWithAccessRoles() {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.accessRoles,
    queryFn: async () => {
      const { data } = await apiClient.get<
        ApiResponse<{ employees: EmployeeAccessRole[] }>
      >(EMPLOYEE_API_PATHS.accessRoles())
      return data.data.employees
    },
  })
}

export function useUpdateAccessRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      employeeId,
      role,
    }: {
      employeeId: string
      role: AccessRole
    }) => {
      const { data } = await apiClient.patch<ApiResponse<EmployeeAccessRole>>(
        EMPLOYEE_API_PATHS.updateAccessRole(employeeId),
        { role },
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.accessRoles })
    },
  })
}
