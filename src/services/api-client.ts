import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { config } from "@/config";
import { clearAuthSession } from "@/lib/auth-storage";
import {
  API_ERROR_MESSAGES,
  isInvalidAuthTokenError,
  normalizeErrorCode,
  resolveApiErrorMessage,
  resolveNetworkErrorMessage,
} from "@/lib/api-error";
import type { ApiError, ApiErrorDetail, CipApiResponse } from "@/types";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** When true, do not attach Authorization (public endpoints). */
    skipAuth?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 100_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function toApiError(args: {
  message: string;
  status: number;
  errorDetail?: ApiErrorDetail | null;
  trackingId?: string;
}): ApiError {
  return {
    message: args.message,
    status: args.status,
    code: normalizeErrorCode(args.errorDetail?.code),
    errorDetail: args.errorDetail ?? null,
    trackingId: args.trackingId,
  };
}

function handleAuthFailure(apiError: ApiError) {
  if (isInvalidAuthTokenError(apiError)) {
    clearAuthSession();
  }
}

function resolveHttpErrorMessage(
  status: number,
  errorDetail: ApiErrorDetail | null,
  body: unknown,
  axiosError: AxiosError,
): string {
  if (errorDetail) {
    return resolveApiErrorMessage(errorDetail);
  }

  if (status === 400) {
    return API_ERROR_MESSAGES.badRequest;
  }

  if (status === 401) {
    return API_ERROR_MESSAGES.unauthorized;
  }

  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof (body as { message?: unknown }).message === "string"
  ) {
    return (body as { message: string }).message;
  }

  return axiosError.message || API_ERROR_MESSAGES.default;
}

apiClient.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    // Let axios set multipart boundary for FormData uploads.
    if (typeof FormData !== "undefined" && request.data instanceof FormData) {
      delete request.headers["Content-Type"];
    }

    if (request.skipAuth) {
      delete request.headers.Authorization;
      return request;
    }

    // Protected endpoints get Bearer when present; public ones should set skipAuth.
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as CipApiResponse<unknown> | undefined;

    // CIP business failures often still return HTTP 2xx with success: false
    if (body && typeof body === "object" && "success" in body && body.success === false) {
      const errorDetail = body.errorDetail;
      const apiError = toApiError({
        message: resolveApiErrorMessage(errorDetail),
        status: response.status,
        errorDetail,
        trackingId: body.trackingId,
      });
      handleAuthFailure(apiError);
      return Promise.reject(apiError);
    }

    return response;
  },
  (error: AxiosError) => {
    const networkMessage = resolveNetworkErrorMessage(error);
    if (networkMessage) {
      return Promise.reject(
        toApiError({
          message: networkMessage,
          status: 0,
        }),
      );
    }

    const status = error.response?.status ?? 0;
    const body = error.response?.data as CipApiResponse<unknown> | undefined;
    const errorDetail =
      body?.errorDetail && typeof body.errorDetail === "object" ? body.errorDetail : null;

    const apiError = toApiError({
      message: resolveHttpErrorMessage(status, errorDetail, body, error),
      status,
      errorDetail,
      trackingId: body?.trackingId,
    });

    handleAuthFailure(apiError);
    return Promise.reject(apiError);
  },
);

export default apiClient;
