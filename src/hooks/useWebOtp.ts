"use client";

import { useEffect, useRef } from "react";
import { toEnglishDigits } from "@/lib/format";

interface UseWebOtpOptions {
  /** When false, the listener is idle (e.g. not on the OTP step). */
  enabled: boolean;
  /** Called with digits-only OTP when SMS autofill succeeds. */
  onOtp: (code: string) => void;
}

interface OtpCredential extends Credential {
  readonly code: string;
}

/**
 * Listens for SMS one-time codes via the Web OTP API (Chrome Android)
 * and pairs with `autocomplete="one-time-code"` for Safari / iOS.
 *
 * For Android autofill, the SMS body should include a domain-bound line:
 * `@your-domain.com #123456`
 */
export function useWebOtp({ enabled, onOtp }: UseWebOtpOptions) {
  const onOtpRef = useRef(onOtp);
  onOtpRef.current = onOtp;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const credentials = navigator.credentials;
    if (!credentials?.get) return;
    if (!("OTPCredential" in window)) return;

    const abortController = new AbortController();

    void credentials
      .get({
        // Web OTP API — Chromium Android
        otp: { transport: ["sms"] },
        signal: abortController.signal,
      } as CredentialRequestOptions)
      .then((credential) => {
        const code = (credential as OtpCredential | null)?.code;
        if (!code) return;
        const digits = toEnglishDigits(code).replace(/\D/g, "");
        if (digits) onOtpRef.current(digits);
      })
      .catch(() => {
        // AbortError / unsupported / user dismiss — ignore silently.
      });

    return () => abortController.abort();
  }, [enabled]);
}
