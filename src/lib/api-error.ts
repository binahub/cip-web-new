import type { ApiError, ApiErrorDetail, CipApiResponse } from "@/types";
import { CipErrorCode } from "@/types";

export const API_ERROR_MESSAGES = {
  default: "خطایی رخ داده است. لطفا دوباره تلاش کنید.",
  badRequest: "خطا در ارسال اطلاعات! لطفا دوباره تلاش کنید.",
  unauthorized: "توکن احراز هویت نامعتبر است.",
  network: "خطا در ارتباط با سرور، لطفا دوباره تلاش کنید.",
  timeout: "زمان انتظار درخواست به پایان رسید. لطفا دوباره تلاش کنید.",
  connectionRefused: "ارتباط با سرور برقرار نشد.",
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isApiErrorDetail(value: unknown): value is ApiErrorDetail {
  return (
    isRecord(value) &&
    typeof value.message === "string" &&
    (typeof value.code === "number" || typeof value.code === "string")
  );
}

export function normalizeErrorCode(code: unknown): number | undefined {
  if (typeof code === "number" && Number.isFinite(code)) return code;
  if (typeof code === "string" && code.trim() !== "") {
    const parsed = Number(code);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

/** Prefer CIP `errorDetail.message`, then fall back safely. */
export function resolveApiErrorMessage(
  errorDetail: unknown,
  fallback: string = API_ERROR_MESSAGES.default,
): string {
  if (typeof errorDetail === "string" && errorDetail.trim()) return errorDetail;
  if (isApiErrorDetail(errorDetail) && errorDetail.message.trim()) {
    return errorDetail.message;
  }
  return fallback;
}

export function isInvalidAuthTokenError(error: Pick<ApiError, "code" | "status">): boolean {
  return error.code === CipErrorCode.INVALID_AUTH_TOKEN || error.status === 401;
}

/** Prefer API `errorDetail.message` for auth failures (code 89 / HTTP 401). */
export function resolveUnauthorizedMessage(errorDetail: unknown): string {
  return resolveApiErrorMessage(errorDetail, API_ERROR_MESSAGES.unauthorized);
}

/** Map axios network / timeout codes to Persian user-facing messages. */
export function resolveNetworkErrorMessage(error: unknown): string | null {
  if (!isRecord(error)) return null;
  const code = typeof error.code === "string" ? error.code : undefined;

  if (code === "ECONNABORTED") return API_ERROR_MESSAGES.timeout;
  if (code === "ERR_NETWORK" || code === "ERR_CONNECTION_REFUSED") {
    return API_ERROR_MESSAGES.connectionRefused;
  }
  if (!("response" in error) || error.response == null) {
    return API_ERROR_MESSAGES.network;
  }
  return null;
}

/**
 * Normalize any thrown value (axios / CIP envelope / unknown) into a stable ApiError.
 * Use this in UI for global, consistent error messages.
 */
export function resolveApiError(
  error: unknown,
  fallback: string = API_ERROR_MESSAGES.default,
): ApiError {
  if (isRecord(error) && typeof error.message === "string" && "status" in error) {
    const code = normalizeErrorCode(error.code);
    return {
      message: error.message.trim() || fallback,
      status: typeof error.status === "number" ? error.status : 0,
      code,
      errorDetail: isApiErrorDetail(error.errorDetail) ? error.errorDetail : null,
      trackingId: typeof error.trackingId === "string" ? error.trackingId : undefined,
    };
  }

  if (isRecord(error) && "response" in error) {
    const response = error.response as { status?: number; data?: unknown } | undefined;
    const body = response?.data;
    const cipBody = isRecord(body) ? (body as Partial<CipApiResponse<unknown>>) : null;
    const errorDetail = cipBody?.errorDetail;
    const bodyMessage =
      isRecord(body) && typeof body.message === "string" ? body.message : undefined;
    const trackingId =
      cipBody && typeof cipBody.trackingId === "string" ? cipBody.trackingId : undefined;
    const status = response?.status ?? 0;

    const statusFallback =
      status === 400 && !errorDetail
        ? API_ERROR_MESSAGES.badRequest
        : status === 401
          ? API_ERROR_MESSAGES.unauthorized
          : errorDetail === undefined && bodyMessage
            ? bodyMessage
            : fallback;

    return {
      message: resolveApiErrorMessage(errorDetail, statusFallback),
      status,
      code: normalizeErrorCode(isApiErrorDetail(errorDetail) ? errorDetail.code : undefined),
      errorDetail: isApiErrorDetail(errorDetail) ? errorDetail : null,
      trackingId,
    };
  }

  const networkMessage = resolveNetworkErrorMessage(error);
  if (networkMessage) {
    return { message: networkMessage, status: 0 };
  }

  if (error instanceof Error && error.message.trim()) {
    return { message: error.message, status: 0 };
  }

  return { message: fallback, status: 0 };
}
