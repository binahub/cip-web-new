import type { ApiError, ApiErrorDetail, CipApiResponse } from "@/types";
import { CipErrorCode } from "@/types";

const DEFAULT_ERROR_MESSAGE = "خطایی رخ داده است. لطفا دوباره تلاش کنید.";

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
  fallback: string = DEFAULT_ERROR_MESSAGE,
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

/**
 * Normalize any thrown value (axios / CIP envelope / unknown) into a stable ApiError.
 * Use this in UI for global, consistent error messages.
 */
export function resolveApiError(error: unknown, fallback: string = DEFAULT_ERROR_MESSAGE): ApiError {
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

    const message = resolveApiErrorMessage(
      errorDetail,
      errorDetail === undefined && bodyMessage ? bodyMessage : fallback,
    );

    return {
      message,
      status: response?.status ?? 0,
      code: normalizeErrorCode(isApiErrorDetail(errorDetail) ? errorDetail.code : undefined),
      errorDetail: isApiErrorDetail(errorDetail) ? errorDetail : null,
      trackingId,
    };
  }

  if (error instanceof Error && error.message.trim()) {
    return { message: error.message, status: 0 };
  }

  return { message: fallback, status: 0 };
}
