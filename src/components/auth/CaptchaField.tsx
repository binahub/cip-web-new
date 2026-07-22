"use client";

import { Refresh } from "iconsax-react";
import Spinner from "@/components/ui/Spinner";
import type { CaptchaData } from "@/services/auth/auth.types";

interface CaptchaFieldProps {
  captcha: CaptchaData | undefined;
  isLoading: boolean;
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
  error?: string;
  id?: string;
}

export default function CaptchaField({
  captcha,
  isLoading,
  value,
  onChange,
  onRefresh,
  error,
  id = "captcha-answer",
}: CaptchaFieldProps) {
  const imageSrc = captcha?.captcha
    ? captcha.captcha.startsWith("data:")
      ? captcha.captcha
      : `data:image/jpeg;base64,${captcha.captcha}`
    : null;

  return (
    <div className="flex w-full flex-col gap-1.5" dir="rtl">
      <label htmlFor={id} className="text-sm font-medium text-text-secondary">
        کد امنیتی
      </label>

      <div className="flex h-14 w-full items-stretch gap-2">
        <div
          className={`flex min-w-0 flex-1 items-center rounded-2xl border bg-transparent px-4 transition-colors ${
            error ? "border-danger" : "border-border-input focus-within:border-accent/60"
          }`}
        >
          <input
            id={id}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="کد تصویر"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="text"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className="min-w-0 flex-1 bg-transparent text-right text-sm tracking-widest text-white outline-none placeholder:tracking-normal placeholder:text-text-secondary sm:text-base"
          />
        </div>

        <div className="flex shrink-0 items-stretch gap-1.5">
          <div
            className="flex w-28 items-center justify-center overflow-hidden rounded-2xl border border-border-input bg-white sm:w-32"
            aria-busy={isLoading}
          >
            {isLoading || !imageSrc ? (
              <Spinner className="py-0 [&_svg]:h-5 [&_svg]:w-5" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt="کد امنیتی"
                className="h-full w-full object-contain p-1.5"
              />
            )}
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="دریافت مجدد کد امنیتی"
            title="دریافت مجدد"
            className="flex w-12 items-center justify-center rounded-2xl border border-border-input bg-cta-pill-bg text-accent transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className={isLoading ? "inline-flex animate-spin" : "inline-flex"}>
              <Refresh size={18} color="#c9ada7" variant="Linear" />
            </span>
          </button>
        </div>
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
