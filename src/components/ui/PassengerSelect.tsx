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
    if (key === "adult" && newCount < 1) return;
    onChange({ ...value, [key]: newCount });
  };

  return (
    <div ref={dropdownRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-full items-center gap-2 rounded-2xl border border-border-input bg-transparent px-4 sm:h-14"
      >
        <Profile2User size={20} color="#969696" variant="Linear" />
        <span dir="rtl" className="flex-1 text-right text-sm text-text-secondary sm:text-base">
          {getDisplayText()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full min-w-[280px] rounded-2xl border border-border-input bg-[#17181b] p-4 shadow-lg">
          {categories.map((cat) => (
            <div key={cat.key} className="flex items-center justify-between py-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white sm:text-base">{cat.label}</span>
                <span className="text-xs text-text-secondary">{cat.description}</span>
              </div>
              <div className="flex items-center gap-3">
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
