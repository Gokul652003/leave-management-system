export interface ApiError {
  code: number;
  message: string;
  fields?: Record<string, string>;
}

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiFailure {
  data: null;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
