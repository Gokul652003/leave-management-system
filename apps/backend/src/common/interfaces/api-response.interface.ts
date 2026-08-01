export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: number;
    message: string;
    fields?: Record<string, string>;
  } | null;
}

export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null };
}

export function fail(
  code: number,
  message: string,
  fields?: Record<string, string>,
): ApiResponse<null> {
  return { success: false, data: null, error: { code, message, fields } };
}
