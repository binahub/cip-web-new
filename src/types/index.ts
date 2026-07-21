export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/** Standard envelope returned by the CIP third-party API. */
export interface CipApiResponse<T> {
  success: boolean;
  data: T | null;
  errorDetail: ApiErrorDetail | null;
  trackingId: string;
  doTime: string;
  doTimestamp?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * CIP errorDetail sample:
 * { "message": "توکن احراز هویت نامعتبر است.", "code": 89 }
 */
export interface ApiErrorDetail {
  message: string;
  code: number;
  details?: unknown;
}

export interface ApiError {
  message: string;
  status: number;
  code?: number;
  errorDetail?: ApiErrorDetail | null;
  trackingId?: string;
}

/** Known CIP business error codes. */
export const CipErrorCode = {
  INVALID_AUTH_TOKEN: 89,
} as const;
