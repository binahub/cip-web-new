const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";

export interface StoredAuthUser {
  firstName: string;
  lastName: string;
  username: string;
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

export function persistAuthSession(args: {
  accessToken: string;
  refreshToken: string;
  user: StoredAuthUser;
}) {
  localStorage.setItem(ACCESS_TOKEN_KEY, args.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, args.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(args.user));
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getAccessToken());
}
