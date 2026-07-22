"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingSlot?: ReactNode;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, leadingIcon, trailingSlot, className = "", id, ...props }, ref) => {
    const inputId = id ?? (label ? label.replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex w-full flex-col gap-1.5" dir="rtl">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        ) : null}

        <div
          className={`flex h-14 w-full items-center gap-2 rounded-2xl border bg-transparent px-4 transition-colors ${
            error ? "border-danger" : "border-border-input focus-within:border-accent/60"
          } ${className}`}
        >
          {leadingIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
          <input
            ref={ref}
            id={inputId}
            className="min-w-0 flex-1 bg-transparent text-right text-sm text-white outline-none placeholder:text-text-secondary sm:text-base"
            {...props}
          />
          {trailingSlot ? <span className="shrink-0">{trailingSlot}</span> : null}
        </div>

        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </div>
    );
  },
);

TextField.displayName = "TextField";

export default TextField;
