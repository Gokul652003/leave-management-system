import { AxiosError } from 'axios'

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiMessage = error.response?.data?.error?.message
    if (typeof apiMessage === 'string') return apiMessage
    if (Array.isArray(apiMessage)) return apiMessage.join(', ')
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}
