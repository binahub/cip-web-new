"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { ArrowDown2 } from "iconsax-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (option: SelectOption) => void;
  placeholder?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "انتخاب کنید",
  leadingIcon,
  trailingIcon,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-full items-center gap-2 rounded-2xl border border-border-input bg-transparent px-4"
      >
        {leadingIcon}
        <span className="min-w-0 flex-1 truncate text-right text-sm text-text-secondary sm:text-base">
          {value?.label || placeholder}
        </span>
        {trailingIcon || <ArrowDown2 size={16} color="#969696" variant="Linear" />}
      </button>

      {isOpen && (
        <div className="app-scroll absolute inset-x-0 top-full z-[100] mt-2 max-h-60 overflow-y-auto overflow-x-hidden overscroll-contain rounded-2xl border border-border-input bg-dropdown-bg py-2 shadow-2xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              dir="rtl"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-right text-sm transition-colors hover:bg-cta-pill-bg sm:text-base ${
                value?.value === option.value ? "text-accent" : "text-text-secondary"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
