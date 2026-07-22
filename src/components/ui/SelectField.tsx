"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectFieldOption[];
  placeholder?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, placeholder, className = "", id, ...props }, ref) => {
    const selectId = id ?? (label ? label.replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex w-full flex-col gap-1.5" dir="rtl">
        {label ? (
          <label htmlFor={selectId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        ) : null}
        <div
          className={`flex h-14 w-full items-center rounded-2xl border bg-transparent px-4 transition-colors ${
            error ? "border-danger" : "border-border-input focus-within:border-accent/60"
          } ${className}`}
        >
          <select
            ref={ref}
            id={selectId}
            className="min-w-0 w-full bg-transparent text-right text-sm text-white outline-none sm:text-base"
            {...props}
          >
            {placeholder ? (
              <option value="" className="bg-dropdown-bg text-text-secondary">
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-dropdown-bg text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </div>
    );
  },
);

SelectField.displayName = "SelectField";

export default SelectField;
