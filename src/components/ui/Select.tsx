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
    <div ref={dropdownRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-full items-center gap-2 rounded-2xl border border-border-input bg-transparent px-4 sm:h-14"
      >
        {leadingIcon}
        <span className="flex-1 text-right text-sm text-text-secondary sm:text-base">
          {value?.label || placeholder}
        </span>
        {trailingIcon || <ArrowDown2 size={16} color="#969696" variant="Linear" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-2xl border border-border-input bg-[#17181b] py-2 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              dir="rtl"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-right text-sm hover:bg-cta-pill-bg transition-colors sm:text-base ${
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
