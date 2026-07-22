"use client";

import { Refresh } from "iconsax-react";
import TextField from "@/components/ui/TextField";
import Spinner from "@/components/ui/Spinner";
import type { CaptchaData } from "@/services/auth/auth.types";

interface CaptchaFieldProps {
  captcha: CaptchaData | undefined;
  isLoading: boolean;
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
  error?: string;
}

export default function CaptchaField({
  captcha,
  isLoading,
  value,
  onChange,
  onRefresh,
  error,
}: CaptchaFieldProps) {
  const imageSrc = captcha?.captcha
    ? captcha.captcha.startsWith("data:")
      ? captcha.captcha
      : `data:image/jpeg;base64,${captcha.captcha}`
    : null;

  return (
    <div className="flex w-full flex-col gap-3" dir="rtl">
      <div className="flex h-14 items-center justify-between gap-3 rounded-2xl border border-border-input bg-transparent px-3">
        <div className="relative flex h-10 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-white/95">
          {isLoading || !imageSrc ? (
            <Spinner className="py-0 [&_svg]:h-5 [&_svg]:w-5" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt="کد امنیتی"
              className="h-10 w-auto max-w-full object-contain"
            />
          )}
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="دریافت مجدد کد امنیتی"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cta-pill-bg text-accent transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          <Refresh size={18} color="#c9ada7" variant="Linear" />
        </button>
      </div>

      <TextField
        label="کد امنیتی"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="کد تصویر را وارد کنید"
        autoComplete="off"
        inputMode="text"
        error={error}
      />
    </div>
  );
}
