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
