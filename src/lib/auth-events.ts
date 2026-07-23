type UnauthorizedHandler = (message: string) => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

/** Register UI handler (e.g. open login modal). Called from AuthProvider. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

/** Fired by the API client when token is missing/invalid (HTTP 401 / CIP code 89). */
export function notifyUnauthorized(message: string) {
  unauthorizedHandler?.(message);
}
