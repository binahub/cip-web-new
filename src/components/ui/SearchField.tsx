import { ReactNode } from "react";

interface SearchFieldProps {
  label: string;
  icon: ReactNode;
  leadingIcon?: ReactNode;
  onClick?: () => void;
}

export default function SearchField({ label, icon, leadingIcon, onClick }: SearchFieldProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      dir="ltr"
      className="flex h-12 flex-1 items-center gap-2 self-stretch rounded-2xl border border-border-input bg-transparent px-4 sm:h-14"
    >
      {leadingIcon}
      <span dir="rtl" className="flex-1 text-right text-sm text-text-secondary sm:text-base">
        {label}
      </span>
      {icon}
    </button>
  );
}
