"use client";

import { useState } from "react";
import { Profile2User, Calendar, Location } from "iconsax-react";
import { DateObject } from "react-multi-date-picker";
import SearchField from "@/components/ui/SearchField";
import DateTimePickerField from "@/components/ui/DateTimePickerField";
import Select from "@/components/ui/Select";

const airports = [
  { value: "mehrabad", label: "فرودگاه مهرآباد تهران" },
  { value: "alaaqia", label: "العراقیه" },
];

export default function SearchBar() {
  const [flightDate, setFlightDate] = useState<DateObject | null>(null);
  const [flightTime, setFlightTime] = useState<DateObject | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<{ value: string; label: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up search logic
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col items-center justify-center gap-3 rounded-3xl bg-search-card-bg p-3 sm:mt-6 sm:h-[104px] sm:flex-row sm:items-center sm:gap-6 sm:p-0 sm:px-4"
    >
      <Select
        options={airports}
        value={selectedAirport}
        onChange={setSelectedAirport}
        placeholder="فرودگاه"
        leadingIcon={<Location size={20} color="#969696" variant="Linear" />}
      />

      <DateTimePickerField
        date={flightDate}
        time={flightTime}
        onDateChange={setFlightDate}
        onTimeChange={setFlightTime}
        icon={<Calendar size={20} color="#969696" variant="Linear" />}
      />

      <SearchField
        label="مسافران"
        icon={<Profile2User size={20} color="#969696" variant="Linear" />}
      />

      {/* Submit button */}
      <button
        type="submit"
        className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl bg-accent sm:h-[88px] sm:w-[173px] sm:rounded-2xl"
      >
        <span dir="rtl" className="text-xs font-extrabold text-black sm:text-base">
          بررسی خدمات
        </span>
      </button>
    </form>
  );
}
