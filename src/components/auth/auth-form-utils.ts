import { resolveApiError } from "@/lib/api-error";

export function getFieldErrors(error: unknown): Record<string, string> {
  const apiError = resolveApiError(error);
  const fieldErrors = apiError.errorDetail?.fieldErrors;
  if (!fieldErrors || typeof fieldErrors !== "object") return {};
  return fieldErrors;
}

export function getFormErrorMessage(error: unknown, fallback: string): string {
  return resolveApiError(error, fallback).message;
}

/** Normalize API expireTime (ms, seconds, or TTL seconds) to a deadline timestamp. */
export function resolveOtpDeadline(expireTime: number): number {
  if (!expireTime) return Date.now() + 120_000;
  if (expireTime > 1e12) return expireTime;
  if (expireTime > 1e9) return expireTime * 1000;
  return Date.now() + expireTime * 1000;
}
