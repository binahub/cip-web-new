import { ReactNode } from "react";

interface SearchFieldProps {
  icon?: ReactNode;
  label: string;
  trailingIcon?: ReactNode;
  className?: string;
}

export default function SearchField({ icon, label, trailingIcon, className = "" }: SearchFieldProps) {
  return (
    <div
      className={`flex flex-1 items-center gap-2 rounded-2xl border border-border-input px-4 h-14 bg-transparent ${className}`}
    >
      {trailingIcon}
      <span className="text-base text-text-secondary">{label}</span>
      {icon && <span className="mr-auto text-text-secondary">{icon}</span>}
    </div>
  );
}
