import axios, { type InternalAxiosRequestConfig } from "axios";
import { config } from "@/config";
import {
  isInvalidAuthTokenError,
  normalizeErrorCode,
  resolveApiErrorMessage,
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
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

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
    clearAuthToken();
  }
}

apiClient.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
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
  (error) => {
    const status = (error.response?.status as number | undefined) ?? 0;
    const body = error.response?.data as CipApiResponse<unknown> | undefined;

    const errorDetail =
      body?.errorDetail && typeof body.errorDetail === "object" ? body.errorDetail : null;

    const apiError = toApiError({
      message: resolveApiErrorMessage(
        errorDetail,
        typeof body === "object" && body && "message" in body && typeof (body as { message?: string }).message === "string"
          ? (body as { message: string }).message
          : (error.message ?? "خطایی رخ داده است. لطفا دوباره تلاش کنید."),
      ),
      status,
      errorDetail,
      trackingId: body?.trackingId,
    });

    handleAuthFailure(apiError);
    return Promise.reject(apiError);
  },
);

export default apiClient;
