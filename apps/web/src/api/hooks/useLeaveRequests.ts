import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import { LEAVE_API_PATHS, LEAVE_QUERY_KEYS } from '../constants'
import type {
  ApiResponse,
  CreateLeaveRequestInput,
  LeaveBalance,
  LeaveRequest,
} from '../types'

export function useMyLeaveRequests() {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.myRequests,
    queryFn: async () => {
      const { data } = await apiClient.get<
        ApiResponse<{ requests: LeaveRequest[] }>
      >(LEAVE_API_PATHS.myRequests())
      return data.data.requests
    },
  })
}

export function useLeaveBalances() {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.balances,
    queryFn: async () => {
      const { data } = await apiClient.get<
        ApiResponse<{ balances: LeaveBalance[] }>
      >(LEAVE_API_PATHS.balances())
      return data.data.balances
    },
  })
}

export function useLeaveRequests(status?: string) {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.requests(status),
    queryFn: async () => {
      const { data } = await apiClient.get<
        ApiResponse<{ requests: LeaveRequest[] }>
      >(LEAVE_API_PATHS.requests(), { params: status ? { status } : {} })
      return data.data.requests
    },
  })
}

export function useLeaveRequest(id: string) {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.request(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<LeaveRequest>>(
        LEAVE_API_PATHS.request(id),
      )
      return data.data
    },
    enabled: id.length > 0,
  })
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateLeaveRequestInput) => {
      const { data } = await apiClient.post<ApiResponse<LeaveRequest>>(
        LEAVE_API_PATHS.requests(),
        input,
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.myRequests })
      queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.balances })
    },
  })
}

function invalidateReviewQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['leaves', 'requests'] })
}

export function useApproveLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<ApiResponse<LeaveRequest>>(
        LEAVE_API_PATHS.approve(id),
      )
      return data.data
    },
    onSuccess: () => invalidateReviewQueries(queryClient),
  })
}

export function useRejectLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments: string }) => {
      const { data } = await apiClient.patch<ApiResponse<LeaveRequest>>(
        LEAVE_API_PATHS.reject(id),
        { comments },
      )
      return data.data
    },
    onSuccess: () => invalidateReviewQueries(queryClient),
  })
}
