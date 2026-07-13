"use client";

import { ReactNode } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
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

export default function DateTimePickerField({
  date,
  time,
  onDateChange,
  onTimeChange,
  icon,
}: DateTimePickerFieldProps) {
  return (
    <div
      dir="ltr"
      className="relative z-40 flex h-14 w-full min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border-input bg-transparent px-4"
    >
      {/* زمان پرواز — time-only picker */}
      <DatePicker
        value={time}
        onChange={onTimeChange}
        disableDayPicker
        format="HH:mm"
        calendar={persian}
        locale={persian_fa}
        plugins={[<TimePicker key="time" hideSeconds />]}
        containerClassName="min-w-0 flex-1"
        render={(value, openCalendar) => (
          <button
            type="button"
            onClick={openCalendar}
            dir="rtl"
            className="w-full truncate px-1 text-right text-sm text-text-secondary sm:text-base"
          >
            {value || "زمان پرواز"}
          </button>
        )}
      />

      <div className="h-14 w-px shrink-0 bg-border-input/40" />

      {/* تاریخ پرواز — date-only picker, Jalali calendar */}
      <DatePicker
        value={date}
        onChange={onDateChange}
        calendar={persian}
        locale={persian_fa}
        containerClassName="min-w-0 flex-1"
        render={(value, openCalendar) => (
          <button
            type="button"
            onClick={openCalendar}
            dir="rtl"
            className="w-full truncate px-1 text-right text-sm text-text-secondary sm:text-base"
          >
            {value || "تاریخ پرواز"}
          </button>
        )}
      />

      <span className="shrink-0">{icon}</span>
    </div>
  );
}
