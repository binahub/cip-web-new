/**
 * App config — single place to read env vars.
 *
 * IMPORTANT: Next.js only inlines `NEXT_PUBLIC_*` into the client bundle when
 * accessed with a static key (`process.env.NEXT_PUBLIC_FOO`). Dynamic access
 * like `process.env[name]` is undefined in the browser.
 *
 * Values come from `.env.local` (local) or the host/CI env (stage/prod).
 * See `.env.example`.
 */
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_API_BASE_URL. Copy .env.example to .env.local and restart the dev server.",
  );
}

export const config = {
  apiBaseUrl,
} as const;
