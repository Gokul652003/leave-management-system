import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import { LEAVE_API_PATHS, LEAVE_QUERY_KEYS } from '../constants'
import type {
  ApiResponse,
  CreateLeavePolicyInput,
  LeavePolicy,
  UpdateLeavePolicyInput,
} from '../types'

export function useLeavePolicies() {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.types,
    queryFn: async () => {
      const { data } = await apiClient.get<
        ApiResponse<{ types: LeavePolicy[] }>
      >(LEAVE_API_PATHS.types())
      return data.data.types
    },
  })
}

export function useCreateLeavePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateLeavePolicyInput) => {
      const { data } = await apiClient.post<ApiResponse<LeavePolicy>>(
        LEAVE_API_PATHS.types(),
        input,
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.types })
    },
  })
}

export function useUpdateLeavePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      code,
      input,
    }: {
      code: string
      input: UpdateLeavePolicyInput
    }) => {
      const { data } = await apiClient.patch<ApiResponse<LeavePolicy>>(
        LEAVE_API_PATHS.type(code),
        input,
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.types })
    },
  })
}

export function useDeleteLeavePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (code: string) => {
      await apiClient.delete(LEAVE_API_PATHS.type(code))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.types })
    },
  })
}
