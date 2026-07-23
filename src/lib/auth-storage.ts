const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";

export interface StoredAuthUser {
  firstName: string;
  lastName: string;
  username: string;
}

export interface AuthSnapshot {
  token: string | null;
  user: StoredAuthUser | null;
}

const listeners = new Set<() => void>();

/** Stable server snapshot — must be the same reference every call. */
const SERVER_AUTH_SNAPSHOT: AuthSnapshot = { token: null, user: null };

let cachedClientSnapshot: AuthSnapshot = SERVER_AUTH_SNAPSHOT;

function emitAuthChange() {
  listeners.forEach((listener) => listener());
}

/** Subscribe to auth storage changes — used by useSyncExternalStore. */
export function subscribeAuthStore(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): StoredAuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuthUser;
  } catch {
    return null;
  }
}

/**
 * Must return a cached reference when data is unchanged.
 * Returning a new object every call causes infinite re-renders with useSyncExternalStore.
 */
export function getAuthSnapshot(): AuthSnapshot {
  const token = getAccessToken();
  const user = getStoredUser();

  const sameToken = cachedClientSnapshot.token === token;
  const sameUser =
    cachedClientSnapshot.user?.firstName === user?.firstName &&
    cachedClientSnapshot.user?.lastName === user?.lastName &&
    cachedClientSnapshot.user?.username === user?.username &&
    Boolean(cachedClientSnapshot.user) === Boolean(user);

  if (sameToken && sameUser) {
    return cachedClientSnapshot;
  }

  cachedClientSnapshot = { token, user };
  return cachedClientSnapshot;
}

export function getServerAuthSnapshot(): AuthSnapshot {
  return SERVER_AUTH_SNAPSHOT;
}

export function persistAuthSession(args: {
  accessToken: string;
  refreshToken: string;
  user: StoredAuthUser;
}) {
  localStorage.setItem(ACCESS_TOKEN_KEY, args.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, args.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(args.user));
  cachedClientSnapshot = { token: args.accessToken, user: args.user };
  emitAuthChange();
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  cachedClientSnapshot = SERVER_AUTH_SNAPSHOT;
  emitAuthChange();
}

export function isLoggedIn(): boolean {
  return Boolean(getAccessToken());
}
