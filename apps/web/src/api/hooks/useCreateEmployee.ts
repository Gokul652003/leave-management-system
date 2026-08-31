import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import { EMPLOYEE_API_PATHS, EMPLOYEE_QUERY_KEYS } from '../constants'
import type { ApiResponse, CreateEmployeeInput, EmployeeProfile } from '../types'

export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateEmployeeInput) => {
      const { data } = await apiClient.post<ApiResponse<EmployeeProfile>>(
        EMPLOYEE_API_PATHS.create(),
        input,
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.list })
    },
  })
}
