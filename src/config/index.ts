/**
 * App config — single place to read env vars.
 *
 * Production/stage (static export): values come from `/runtime-config.js`
 * which sets `window.__ENV__` before the app loads. DevOps can change that
 * file without rebuilding.
 *
 * Local optional fallback: `NEXT_PUBLIC_API_BASE_URL` in `.env.local`.
 */

export type RuntimeEnv = {
  API_BASE_URL?: string;
};

declare global {
  interface Window {
    __ENV__?: RuntimeEnv;
  }
}

function resolveApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const fromRuntime = window.__ENV__?.API_BASE_URL?.trim();
    if (fromRuntime) return fromRuntime;
  }

  const fromBuild = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (fromBuild) return fromBuild;

  return "";
}

export const config = {
  get apiBaseUrl(): string {
    const url = resolveApiBaseUrl();
    if (!url) {
      throw new Error(
        "Missing API base URL. For static hosting, set API_BASE_URL in runtime-config.js. For local dev, copy .env.example to .env.local or edit public/runtime-config.js.",
      );
    }
    return url;
  },
} as const;
