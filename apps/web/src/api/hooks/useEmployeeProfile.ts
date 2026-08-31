import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../client'
import { EMPLOYEE_API_PATHS, EMPLOYEE_QUERY_KEYS } from '../constants'
import type { ApiResponse, EmployeeProfile } from '../types'

export function useEmployeeProfile(employeeId: string) {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.profile(employeeId),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<EmployeeProfile>>(
        EMPLOYEE_API_PATHS.profile(employeeId),
      )
      return data.data
    },
    enabled: employeeId.length > 0,
  })
}
