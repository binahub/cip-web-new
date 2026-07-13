interface SearchDateRangeFieldProps {
  timeLabel: string;
  dateLabel: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function SearchDateRangeField({
  timeLabel,
  dateLabel,
  icon,
  onClick,
}: SearchDateRangeFieldProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      dir="ltr"
      className="flex h-12 flex-1 items-center gap-2 self-stretch rounded-2xl border border-border-input bg-transparent px-4 sm:h-14"
    >
      <span dir="rtl" className="flex-1 px-1 text-right text-sm text-text-secondary sm:text-base">
        {timeLabel}
      </span>
      <div className="h-8 w-px bg-border-input/40" />
      <span dir="rtl" className="flex-1 px-1 text-right text-sm text-text-secondary sm:text-base">
        {dateLabel}
      </span>
      {icon}
    </button>
  );
}