"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "iconsax-react";
import { DateObject } from "react-multi-date-picker";
import CountField from "@/components/reservation/CountField";
import ServicePickCards from "@/components/reservation/ServicePickCards";
import DateTimePickerField from "@/components/ui/DateTimePickerField";
import Select from "@/components/ui/Select";
import TextField from "@/components/ui/TextField";
import { getFormErrorMessage } from "@/components/auth/auth-form-utils";
import { formatJalaliDateTime } from "@/lib/format";
import {
  createDraftFormSchema,
  type CreateDraftFormValues,
} from "@/schemas/reservation";
import { liveFormValidation } from "@/lib/validation";
import { useActiveMainServiceItems } from "@/services/main-services/main-services.queries";
import {
  useAirlines,
  useAirports,
  useCreateReservationDraft,
  useTripTypes,
} from "@/services/reservation/reservation.queries";
import type { ReservationDraft } from "@/services/reservation/reservation.types";
import type {
  AirlineItem,
  AirportItem,
  TripTypeItem,
} from "@/services/reservation/reservation.types";

/** Trip-type ids from /trip-type/list */
const TRIP_TYPE_ARRIVAL = "1"; // پرواز ورودی
const TRIP_TYPE_DEPARTURE = "2"; // پرواز خروجی

interface StepFlightInfoProps {
  initialServiceId?: string;
  onSuccess: (draft: ReservationDraft, primaryServiceId: string) => void;
}

function toAirportOptions(airports: AirportItem[] | undefined) {
  return (airports ?? []).map((item) => ({
    value: item.id,
    label: item.persianName,
  }));
}

export default function StepFlightInfo({ initialServiceId, onSuccess }: StepFlightInfoProps) {
  const { data: tripTypes, isPending: tripLoading } = useTripTypes();
  const { data: airlines, isPending: airlineLoading } = useAirlines();
  const { data: activeAirports, isPending: activeAirportLoading } = useAirports("ACTIVE");
  const { data: allAirports, isPending: allAirportLoading } = useAirports("ALL");
  const { data: mainServices, isPending: servicesLoading } = useActiveMainServiceItems();
  const createMutation = useCreateReservationDraft();

  const [flightDate, setFlightDate] = useState<DateObject | null>(null);
  const [flightTime, setFlightTime] = useState<DateObject | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateDraftFormValues>({
    resolver: zodResolver(createDraftFormSchema),
    ...liveFormValidation,
    defaultValues: {
      tripTypeId: "",
      airportId: "",
      airlineId: "",
      destinationAirportId: "",
      flightNumber: "",
      terminal: "",
      flightDate: "",
      primaryServiceId: initialServiceId ?? "",
      adultCount: 1,
      childCount: 0,
      infantCount: 0,
      luggageCount: 0,
    },
  });

  const tripTypeId = watch("tripTypeId");
  const airportId = watch("airportId");
  const destinationAirportId = watch("destinationAirportId");

  useEffect(() => {
    if (initialServiceId) {
      setValue("primaryServiceId", initialServiceId);
    }
  }, [initialServiceId, setValue]);

  useEffect(() => {
    const formatted = formatJalaliDateTime(flightDate, flightTime);
    setValue("flightDate", formatted ?? "", { shouldValidate: Boolean(formatted) });
  }, [flightDate, flightTime, setValue]);

  const tripTypeField = register("tripTypeId");

  const tripOptions = useMemo(
    () =>
      (tripTypes ?? []).map((item: TripTypeItem) => ({
        value: item.id,
        label: item.persianName,
      })),
    [tripTypes],
  );
  const airlineOptions = useMemo(
    () =>
      (airlines ?? []).map((item: AirlineItem) => ({
        value: item.id,
        label: item.persianName,
      })),
    [airlines],
  );

  /**
   * Departure (خروجی / id=2): origin = ACTIVE CIP airports, destination = all.
   * Arrival (ورودی / id=1): origin = all, destination = ACTIVE CIP airports.
   */
  const originAirportOptions = useMemo(() => {
    if (tripTypeId === TRIP_TYPE_DEPARTURE) return toAirportOptions(activeAirports);
    if (tripTypeId === TRIP_TYPE_ARRIVAL) return toAirportOptions(allAirports);
    return [];
  }, [tripTypeId, activeAirports, allAirports]);

  const destinationAirportOptions = useMemo(() => {
    if (tripTypeId === TRIP_TYPE_DEPARTURE) return toAirportOptions(allAirports);
    if (tripTypeId === TRIP_TYPE_ARRIVAL) return toAirportOptions(activeAirports);
    return [];
  }, [tripTypeId, activeAirports, allAirports]);

  const airportLoading = activeAirportLoading || allAirportLoading;
  const airportsDisabled = !tripTypeId;

  const onSubmit = handleSubmit(async (values) => {
    const draft = await createMutation.mutateAsync({
      tripTypeId: Number(values.tripTypeId),
      airportId: Number(values.airportId),
      airlineId: Number(values.airlineId),
      destinationAirportId: Number(values.destinationAirportId),
      flightNumber: values.flightNumber,
      flightDate: values.flightDate,
      terminal: values.terminal,
      primaryServiceId: Number(values.primaryServiceId),
      adultCount: values.adultCount,
      childCount: values.childCount,
      infantCount: values.infantCount,
      luggageCount: values.luggageCount,
    });
    onSuccess(draft, values.primaryServiceId);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6" dir="rtl" noValidate>
      <Controller
        name="primaryServiceId"
        control={control}
        render={({ field }) => (
          <ServicePickCards
            items={mainServices ?? []}
            value={field.value}
            onChange={field.onChange}
            isLoading={servicesLoading}
            error={errors.primaryServiceId?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="نوع سفر"
          options={tripOptions}
          placeholder="انتخاب کنید"
          isLoading={tripLoading}
          error={errors.tripTypeId?.message}
          name={tripTypeField.name}
          ref={tripTypeField.ref}
          onBlur={tripTypeField.onBlur}
          value={tripTypeId}
          onChange={(event) => {
            void tripTypeField.onChange(event);
            setValue("airportId", "");
            setValue("destinationAirportId", "");
          }}
        />
        <Select
          label="ایرلاین"
          options={airlineOptions}
          placeholder="انتخاب کنید"
          isLoading={airlineLoading}
          error={errors.airlineId?.message}
          {...register("airlineId")}
        />
        <Select
          label="فرودگاه مبدا / محل CIP"
          options={originAirportOptions}
          placeholder={airportsDisabled ? "ابتدا نوع سفر را انتخاب کنید" : "انتخاب کنید"}
          isLoading={Boolean(tripTypeId) && airportLoading}
          disabled={airportsDisabled}
          searchable
          error={errors.airportId?.message}
          {...register("airportId")}
          value={airportId}
        />
        <Select
          label="فرودگاه مقصد"
          options={destinationAirportOptions}
          placeholder={airportsDisabled ? "ابتدا نوع سفر را انتخاب کنید" : "انتخاب کنید"}
          isLoading={Boolean(tripTypeId) && airportLoading}
          disabled={airportsDisabled}
          searchable
          error={errors.destinationAirportId?.message}
          {...register("destinationAirportId")}
          value={destinationAirportId}
        />
        <TextField
          label="شماره پرواز"
          error={errors.flightNumber?.message}
          {...register("flightNumber")}
        />
        <TextField
          label="ترمینال"
          error={errors.terminal?.message}
          {...register("terminal")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">تاریخ و زمان پرواز</label>
        <DateTimePickerField
          date={flightDate}
          time={flightTime}
          onDateChange={(value) => setFlightDate(value as DateObject)}
          onTimeChange={(value) => setFlightTime(value as DateObject)}
          icon={<Calendar size={20} color="#969696" variant="Linear" />}
        />
        {errors.flightDate?.message ? (
          <p className="text-xs text-danger">{errors.flightDate.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Controller
          name="adultCount"
          control={control}
          render={({ field }) => (
            <CountField
              label="بزرگسال"
              description="بالای ۱۲ سال"
              value={field.value}
              min={0}
              onChange={field.onChange}
              error={errors.adultCount?.message}
            />
          )}
        />
        <Controller
          name="childCount"
          control={control}
          render={({ field }) => (
            <CountField
              label="کودک"
              description="۲ تا ۱۲ سال"
              value={field.value}
              onChange={field.onChange}
              error={errors.childCount?.message}
            />
          )}
        />
        <Controller
          name="infantCount"
          control={control}
          render={({ field }) => (
            <CountField
              label="نوزاد"
              description="زیر ۲ سال"
              value={field.value}
              onChange={field.onChange}
              error={errors.infantCount?.message}
            />
          )}
        />
        <Controller
          name="luggageCount"
          control={control}
          render={({ field }) => (
            <CountField
              label="چمدان"
              value={field.value}
              onChange={field.onChange}
              error={errors.luggageCount?.message}
            />
          )}
        />
      </div>

      {createMutation.isError ? (
        <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
          {getFormErrorMessage(createMutation.error, "ایجاد پیش‌نویس ناموفق بود.")}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent text-base font-extrabold text-black disabled:opacity-50"
      >
        {createMutation.isPending ? "در حال ایجاد..." : "ادامه"}
      </button>
    </form>
  );
}
