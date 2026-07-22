"use client";

import { Add, Minus } from "iconsax-react";

interface CountFieldProps {
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  error?: string;
}

export default function CountField({
  label,
  description,
  value,
  min = 0,
  max = 20,
  onChange,
  error,
}: CountFieldProps) {
  return (
    <div className="flex flex-col gap-1.5" dir="rtl">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border-input px-4 py-3">
        <div className="min-w-0 text-right">
          <p className="text-sm font-medium text-white sm:text-base">{label}</p>
          {description ? (
            <p className="text-xs text-text-secondary">{description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label={`کاهش ${label}`}
            disabled={value <= min}
            onClick={() => onChange(Math.max(min, value - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-input text-text-secondary transition-colors hover:bg-cta-pill-bg hover:text-white disabled:opacity-40"
          >
            <Minus size={16} color="currentColor" variant="Linear" />
          </button>
          <span className="w-8 text-center text-base font-bold text-white">{value}</span>
          <button
            type="button"
            aria-label={`افزایش ${label}`}
            disabled={value >= max}
            onClick={() => onChange(Math.min(max, value + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-input text-text-secondary transition-colors hover:bg-cta-pill-bg hover:text-white disabled:opacity-40"
          >
            <Add size={16} color="currentColor" variant="Linear" />
          </button>
        </div>
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
