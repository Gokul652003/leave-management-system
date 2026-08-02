export interface ApiError {
  message: string;
  fields?: Record<string, string>;
}

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiFailure {
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
