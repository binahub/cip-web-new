import { ReactNode } from "react";

interface BadgeProps {
  icon?: ReactNode;
  label: string;
  className?: string;
}

export default function Badge({ icon, label, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[10px] bg-badge-bg px-2 py-0.5 text-xs font-normal text-white ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}
