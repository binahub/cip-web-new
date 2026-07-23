"use client";

import { useMemo, useState } from "react";
import { Calendar, Location } from "iconsax-react";
import { DateObject } from "react-multi-date-picker";
import DateTimePickerField from "@/components/ui/DateTimePickerField";
import Select from "@/components/ui/Select";
import PassengerSelect from "@/components/ui/PassengerSelect";
import { useAirports } from "@/services/reservation/reservation.queries";
import type { AirportItem } from "@/services/reservation/reservation.types";

export default function SearchBar() {
  const { data: airports, isPending: airportLoading } = useAirports();
  const [flightDate, setFlightDate] = useState<DateObject | null>(null);
  const [flightTime, setFlightTime] = useState<DateObject | null>(null);
  const [selectedAirport, setSelectedAirport] = useState("");
  const [passengers, setPassengers] = useState({ adult: 0, child: 0, infant: 0 });

  const airportOptions = useMemo(
    () =>
      (airports ?? []).map((item: AirportItem) => ({
        value: item.id,
        label: item.persianName,
      })),
    [airports],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up search logic
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 w-full rounded-3xl bg-search-card-bg p-3 sm:mt-6 sm:flex sm:h-[104px] sm:items-center sm:gap-4 sm:p-0 sm:px-4 lg:gap-6"
    >
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-1 sm:flex-row sm:items-center sm:gap-3 lg:gap-4">
        <Select
          options={airportOptions}
          value={selectedAirport}
          onChange={(event) => setSelectedAirport(event.target.value)}
          placeholder="فرودگاه"
          isLoading={airportLoading}
          className="min-w-0 flex-1"
          leadingIcon={<Location size={20} color="#969696" variant="Linear" />}
        />

        <DateTimePickerField
          date={flightDate}
          time={flightTime}
          onDateChange={setFlightDate}
          onTimeChange={setFlightTime}
          icon={<Calendar size={20} color="#969696" variant="Linear" />}
        />

        <PassengerSelect value={passengers} onChange={setPassengers} />
      </div>

      <button
        type="submit"
        className="mt-3 flex h-14 w-full shrink-0 items-center justify-center rounded-xl bg-accent sm:mt-0 sm:h-[88px] sm:w-[173px] sm:rounded-2xl"
      >
        <span dir="rtl" className="text-sm font-extrabold text-black sm:text-base">
          بررسی خدمات
        </span>
      </button>
    </form>
  );
}
