import { ReactNode } from "react";

interface BadgeProps {
  icon?: ReactNode;
  label: string;
  className?: string;
}

export default function Badge({ icon, label, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex h-5 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-[10px] bg-badge-bg px-1 py-px text-xs font-normal text-white ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}
