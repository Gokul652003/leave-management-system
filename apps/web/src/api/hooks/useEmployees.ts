import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../client'
import { EMPLOYEE_API_PATHS, EMPLOYEE_QUERY_KEYS } from '../constants'
import type { ApiResponse, EmployeeProfile } from '../types'

export function useEmployees() {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.list,
    queryFn: async () => {
      const { data } = await apiClient.get<
        ApiResponse<{ employees: EmployeeProfile[] }>
      >(EMPLOYEE_API_PATHS.list())
      return data.data.employees
    },
  })
}
