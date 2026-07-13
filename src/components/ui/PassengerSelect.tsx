"use client";

import { useState, useRef, useEffect } from "react";
import { Profile2User, Add, Minus } from "iconsax-react";

interface PassengerCounts {
  adult: number;
  child: number;
  infant: number;
}

interface PassengerSelectProps {
  value: PassengerCounts;
  onChange: (counts: PassengerCounts) => void;
}

const categories = [
  { key: "adult" as const, label: "بزرگسال", description: "بیش از ۱۲ سال" },
  { key: "child" as const, label: "کودک", description: "۲ تا ۱۲ سال" },
  { key: "infant" as const, label: "نوزاد", description: "زیر ۲ سال" },
];

export default function PassengerSelect({ value, onChange }: PassengerSelectProps) {
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

  const getDisplayText = () => {
    const parts: string[] = [];
    if (value.adult > 0) parts.push(`بزرگسال: ${value.adult}`);
    if (value.child > 0) parts.push(`کودک: ${value.child}`);
    if (value.infant > 0) parts.push(`نوزاد: ${value.infant}`);
    return parts.length > 0 ? parts.join("   |   ") : "مسافران";
  };

  const updateCount = (key: keyof PassengerCounts, delta: number) => {
    const newCount = value[key] + delta;
    if (newCount < 0) return;
    onChange({ ...value, [key]: newCount });
  };

  return (
    <div ref={dropdownRef} className="relative w-full min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-full items-center gap-2 rounded-2xl border border-border-input bg-transparent px-4"
      >
        <Profile2User size={20} color="#969696" variant="Linear" />
        <span dir="rtl" className="min-w-0 flex-1 truncate text-right text-sm text-text-secondary sm:text-base">
          {getDisplayText()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-full z-[100] mt-2 rounded-2xl border border-border-input bg-dropdown-bg p-4 shadow-2xl">
          {categories.map((cat) => (
            <div key={cat.key} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex flex-col text-right" dir="rtl">
                <span className="text-sm font-medium text-white sm:text-base">{cat.label}</span>
                <span className="text-xs text-text-secondary">{cat.description}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateCount(cat.key, -1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-input text-text-secondary transition-colors hover:bg-cta-pill-bg hover:text-white"
                >
                  <Minus size={16} color="currentColor" variant="Linear" />
                </button>
                <span className="w-6 text-center text-sm font-medium text-white">
                  {value[cat.key]}
                </span>
                <button
                  type="button"
                  onClick={() => updateCount(cat.key, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-input text-text-secondary transition-colors hover:bg-cta-pill-bg hover:text-white"
                >
                  <Add size={16} color="currentColor" variant="Linear" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
