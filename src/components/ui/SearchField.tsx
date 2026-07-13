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
      className="flex h-14 flex-1 items-center gap-2 rounded-2xl border border-border-input bg-transparent px-4"
    >
      {leadingIcon}
      <span dir="rtl" className="flex-1 text-right text-sm text-text-secondary sm:text-base">
        {label}
      </span>
      {icon}
    </button>
  );
}
