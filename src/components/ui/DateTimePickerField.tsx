"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { DateObject } from "react-multi-date-picker";

interface DateTimePickerFieldProps {
  date: DateObject | null;
  time: DateObject | null;
  onDateChange: (date: DateObject) => void;
  onTimeChange: (time: DateObject) => void;
  icon: ReactNode;
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTES = Array.from({ length: 60 }, (_, minute) => minute);

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function TimePickerDropdown({
  time,
  onTimeChange,
}: {
  time: DateObject | null;
  onTimeChange: (time: DateObject) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hour = time?.hour ?? 12;
  const minute = time?.minute ?? 0;
  const label = time ? `${pad(hour)}:${pad(minute)}` : "زمان پرواز";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function commit(nextHour: number, nextMinute: number) {
    const next = time ? new DateObject(time) : new DateObject();
    next.setHour(nextHour).setMinute(nextMinute).setSecond(0);
    onTimeChange(next);
  }

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        dir="rtl"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`w-full truncate px-1 text-right text-sm sm:text-base ${
          time ? "text-white" : "text-text-secondary"
        }`}
      >
        {label}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="انتخاب زمان"
          className="absolute inset-x-0 top-full z-[110] mt-3 overflow-hidden rounded-2xl border border-border-input bg-dropdown-bg shadow-2xl sm:inset-x-auto sm:left-0 sm:min-w-[220px]"
        >
          <div className="flex items-stretch" dir="ltr">
            <div className="app-scroll flex max-h-56 flex-1 flex-col overflow-y-auto overscroll-contain py-2">
              <p className="px-3 pb-1 text-center text-[11px] text-text-secondary">ساعت</p>
              {HOURS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => commit(item, minute)}
                  className={`px-3 py-2 text-center text-sm transition-colors hover:bg-cta-pill-bg ${
                    hour === item ? "bg-cta-pill-bg font-semibold text-accent" : "text-text-secondary"
                  }`}
                >
                  {pad(item)}
                </button>
              ))}
            </div>

            <div className="w-px shrink-0 bg-border-input/30" aria-hidden="true" />

            <div className="app-scroll flex max-h-56 flex-1 flex-col overflow-y-auto overscroll-contain py-2">
              <p className="px-3 pb-1 text-center text-[11px] text-text-secondary">دقیقه</p>
              {MINUTES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => commit(hour, item)}
                  className={`px-3 py-2 text-center text-sm transition-colors hover:bg-cta-pill-bg ${
                    minute === item
                      ? "bg-cta-pill-bg font-semibold text-accent"
                      : "text-text-secondary"
                  }`}
                >
                  {pad(item)}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border-input/20 p-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-full items-center justify-center rounded-xl bg-accent text-sm font-extrabold text-black transition-opacity hover:opacity-90"
            >
              تایید
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function DateTimePickerField({
  date,
  time,
  onDateChange,
  onTimeChange,
  icon,
}: DateTimePickerFieldProps) {
  const dateLabel = useMemo(() => {
    if (!date) return "تاریخ پرواز";
    return date.format("YYYY/MM/DD");
  }, [date]);

  return (
    <div
      dir="ltr"
      className="relative z-40 flex h-14 w-full min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border-input bg-transparent px-4"
    >
      <TimePickerDropdown time={time} onTimeChange={onTimeChange} />

      <div className="h-14 w-px shrink-0 bg-border-input/40" />

      <DatePicker
        value={date}
        onChange={onDateChange}
        calendar={persian}
        locale={persian_fa}
        containerClassName="min-w-0 flex-1"
        render={(_, openCalendar) => (
          <button
            type="button"
            onClick={openCalendar}
            dir="rtl"
            className={`w-full truncate px-1 text-right text-sm sm:text-base ${
              date ? "text-white" : "text-text-secondary"
            }`}
          >
            {dateLabel}
          </button>
        )}
      />

      <span className="shrink-0">{icon}</span>
    </div>
  );
}
