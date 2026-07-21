import { toast } from "sonner";
import { resolveApiError } from "@/lib/api-error";

/** Show a CIP-styled error toast from any thrown API / unknown error. */
export function toastApiError(error: unknown, fallback?: string) {
  const apiError = resolveApiError(error, fallback);
  toast.error(apiError.message, {
    id: apiError.trackingId ?? `api-error-${apiError.code ?? apiError.status}-${apiError.message}`,
  });
  return apiError;
}

export function toastSuccess(message: string) {
  toast.success(message);
}

export function toastInfo(message: string) {
  toast.info(message);
}

export function toastWarning(message: string) {
  toast.warning(message);
}
