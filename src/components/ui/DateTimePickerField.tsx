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
  /** When true, dates before today and times before now (on today) cannot be selected. */
  disablePast?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTES = Array.from({ length: 60 }, (_, minute) => minute);

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function isSameCalendarDay(a: DateObject, b: DateObject) {
  return (
    a.year === b.year && a.month.number === b.month.number && a.day === b.day
  );
}

function TimePickerDropdown({
  time,
  onTimeChange,
  minHour = 0,
  minMinute = 0,
}: {
  time: DateObject | null;
  onTimeChange: (time: DateObject) => void;
  minHour?: number;
  minMinute?: number;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hour = time?.hour ?? 12;
  const minute = time?.minute ?? 0;
  const label = time ? `${pad(hour)}:${pad(minute)}` : "زمان پرواز";

  const availableHours = useMemo(
    () => HOURS.filter((item) => item >= minHour),
    [minHour],
  );

  const availableMinutes = useMemo(() => {
    if (hour > minHour) return MINUTES;
    if (hour < minHour) return [];
    return MINUTES.filter((item) => item >= minMinute);
  }, [hour, minHour, minMinute]);

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
    let safeHour = nextHour;
    let safeMinute = nextMinute;

    if (safeHour < minHour) {
      safeHour = minHour;
      safeMinute = Math.max(safeMinute, minMinute);
    } else if (safeHour === minHour && safeMinute < minMinute) {
      safeMinute = minMinute;
    }

    const next = time ? new DateObject(time) : new DateObject();
    next.setHour(safeHour).setMinute(safeMinute).setSecond(0);
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
              {availableHours.map((item) => (
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
              {availableMinutes.map((item) => (
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
  disablePast = false,
}: DateTimePickerFieldProps) {
  const now = new DateObject({ calendar: persian, locale: persian_fa });
  // Day-only bound: if minDate keeps the current clock time, "today" is treated as past
  // and cannot be selected until tomorrow.
  const minDate = disablePast
    ? new DateObject(now).setHour(0).setMinute(0).setSecond(0).setMillisecond(0)
    : undefined;
  const isToday = Boolean(date && disablePast && isSameCalendarDay(date, now));

  const dateLabel = useMemo(() => {
    if (!date) return "تاریخ پرواز";
    return date.format("YYYY/MM/DD");
  }, [date]);

  function handleDateChange(value: DateObject | null) {
    if (!value) return;

    if (disablePast) {
      const today = new DateObject({ calendar: persian, locale: persian_fa });
      const pickedDay = new DateObject(value).setHour(0).setMinute(0).setSecond(0).setMillisecond(0);
      const todayStart = new DateObject(today).setHour(0).setMinute(0).setSecond(0).setMillisecond(0);
      if (pickedDay.toDate().getTime() < todayStart.toDate().getTime()) return;

      // Keep an already-chosen time valid when switching onto today.
      if (isSameCalendarDay(value, today) && time) {
        const combined = new DateObject(value)
          .setHour(time.hour)
          .setMinute(time.minute)
          .setSecond(0);
        if (combined.toDate().getTime() < today.toDate().getTime()) {
          onTimeChange(new DateObject(today).setSecond(0));
        }
      }
    }

    onDateChange(value);
  }

  function handleTimeChange(value: DateObject) {
    if (disablePast && date) {
      const today = new DateObject({ calendar: persian, locale: persian_fa });
      if (isSameCalendarDay(date, today)) {
        const combined = new DateObject(date)
          .setHour(value.hour)
          .setMinute(value.minute)
          .setSecond(0);
        if (combined.toDate().getTime() < today.toDate().getTime()) return;
      }
    }
    onTimeChange(value);
  }

  return (
    <div
      dir="ltr"
      className="relative z-40 flex h-14 w-full min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border-input bg-transparent px-4"
    >
      <TimePickerDropdown
        time={time}
        onTimeChange={handleTimeChange}
        minHour={isToday ? now.hour : 0}
        minMinute={isToday ? now.minute : 0}
      />

      <div className="h-14 w-px shrink-0 bg-border-input/40" />

      <DatePicker
        value={date}
        onChange={handleDateChange}
        calendar={persian}
        locale={persian_fa}
        minDate={minDate}
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
