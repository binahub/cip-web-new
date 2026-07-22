"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Trash } from "iconsax-react";
import PriceSummaryCard from "@/components/reservation/PriceSummaryCard";
import { getFormErrorMessage } from "@/components/auth/auth-form-utils";
import SelectField from "@/components/ui/SelectField";
import TextField from "@/components/ui/TextField";
import { toastSuccess } from "@/lib/toast";
import { toEnglishDigits } from "@/lib/format";
import {
  addPassengersFormSchema,
  type AddPassengersFormValues,
  type DraftPassengerFormValues,
} from "@/schemas/reservation";
import {
  useAddDraftPassengers,
  useDraftMyPassengers,
  useSaveDraftMyPassenger,
} from "@/services/reservation/reservation.queries";
import type {
  DraftMyPassenger,
  ReservationDraft,
} from "@/services/reservation/reservation.types";

interface StepPassengersProps {
  draft: ReservationDraft;
  onBack: () => void;
  onSuccess: (draft: ReservationDraft) => void;
}

const genderOptions = [
  { value: "MALE", label: "مرد" },
  { value: "FEMALE", label: "زن" },
];

const MAX_PASSENGERS = 12;

function emptyPassenger(): DraftPassengerFormValues {
  return {
    customerPassengerId: "",
    firstName: "",
    lastName: "",
    nationalCode: "",
    mobileNumber: "",
    passportNumber: "",
    gender: "MALE",
    birthDate: "",
    ageCategoryId: "1",
    nationalityId: "1",
    needsWheelchair: false,
    specialMeal: "",
    medicalConditions: "",
    notes: "",
    saveToMyPassengers: false,
    setAsDefault: false,
  };
}

function normalizeBirthDate(value: string): string {
  const english = toEnglishDigits(value).trim();
  if (/^\d{4}\/\d{2}\/\d{2}/.test(english)) return english.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}/.test(english)) return english.slice(0, 10).replace(/-/g, "/");
  return english;
}

function passengerFromSaved(passenger: DraftMyPassenger): DraftPassengerFormValues {
  return {
    customerPassengerId: String(passenger.id),
    firstName: passenger.firstName,
    lastName: passenger.lastName,
    nationalCode: passenger.nationalCode,
    mobileNumber: "",
    passportNumber: passenger.passportNumber ?? "",
    gender: passenger.gender === "FEMALE" ? "FEMALE" : "MALE",
    birthDate: normalizeBirthDate(passenger.birthDate),
    ageCategoryId: String(passenger.ageCategoryId),
    nationalityId: String(passenger.nationalityId),
    needsWheelchair: passenger.needsWheelchair,
    specialMeal: passenger.specialMeal ?? "",
    medicalConditions: "",
    notes: "",
    saveToMyPassengers: false,
    setAsDefault: false,
  };
}

export default function StepPassengers({ draft, onBack, onSuccess }: StepPassengersProps) {
  const requiredCount = Math.max(
    draft.passengerCounts.adultCount +
      draft.passengerCounts.childCount +
      draft.passengerCounts.infantCount,
    1,
  );

  const { data: savedPage, isPending: savedLoading } = useDraftMyPassengers(0, 20);
  const savePassengerMutation = useSaveDraftMyPassenger();
  const addMutation = useAddDraftPassengers();
  const [formError, setFormError] = useState<string | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const defaultPassengers = useMemo(
    () => Array.from({ length: requiredCount }, () => emptyPassenger()),
    [requiredCount],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddPassengersFormValues>({
    resolver: zodResolver(addPassengersFormSchema),
    defaultValues: { passengers: defaultPassengers },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "passengers",
  });

  useEffect(() => {
    reset({ passengers: defaultPassengers });
  }, [defaultPassengers, reset]);

  const savedPassengers = savedPage?.list ?? [];

  function applySavedPassenger(index: number, passengerId: string) {
    if (!passengerId) {
      setValue(`passengers.${index}.customerPassengerId`, "");
      return;
    }
    const passenger = savedPassengers.find((item) => String(item.id) === passengerId);
    if (!passenger) return;
    update(index, passengerFromSaved(passenger));
  }

  function addSavedToList(passenger: DraftMyPassenger) {
    const values = getValues("passengers");
    const emptyIndex = values.findIndex(
      (item) => !item.firstName.trim() && !item.nationalCode.trim(),
    );

    if (emptyIndex >= 0) {
      update(emptyIndex, passengerFromSaved(passenger));
      return;
    }

    if (values.length >= MAX_PASSENGERS) {
      setFormError(`حداکثر ${MAX_PASSENGERS} مسافر می‌توانید اضافه کنید.`);
      return;
    }

    append(passengerFromSaved(passenger));
    setFormError(null);
  }

  async function savePassengerNow(index: number) {
    const passenger = getValues(`passengers.${index}`);
    setSavingIndex(index);
    setFormError(null);
    try {
      const saved = await savePassengerMutation.mutateAsync({
        payload: {
          customerPassengerId: passenger.customerPassengerId
            ? Number(passenger.customerPassengerId)
            : undefined,
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          nationalCode: passenger.nationalCode,
          mobileNumber: passenger.mobileNumber || undefined,
          passportNumber: passenger.passportNumber || undefined,
          gender: passenger.gender,
          birthDate: toEnglishDigits(passenger.birthDate),
          ageCategoryId: Number(passenger.ageCategoryId),
          nationalityId: Number(passenger.nationalityId),
          needsWheelchair: passenger.needsWheelchair,
          specialMeal: passenger.specialMeal || undefined,
          medicalConditions: passenger.medicalConditions || undefined,
          notes: passenger.notes || undefined,
        },
        setAsDefault: passenger.setAsDefault,
      });
      setValue(`passengers.${index}.customerPassengerId`, String(saved.id));
      setValue(`passengers.${index}.saveToMyPassengers`, false);
      toastSuccess("مسافر در فهرست شما ذخیره شد.");
    } catch (error) {
      setFormError(getFormErrorMessage(error, "ذخیره مسافر ناموفق بود."));
    } finally {
      setSavingIndex(null);
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    if (values.passengers.length < requiredCount) {
      setFormError(`حداقل ${requiredCount} مسافر برای این رزرو لازم است.`);
      return;
    }

    setFormError(null);

    try {
      const passengersForDraft = [];

      for (const passenger of values.passengers) {
        let customerPassengerId = passenger.customerPassengerId
          ? Number(passenger.customerPassengerId)
          : undefined;

        if (passenger.saveToMyPassengers) {
          const saved = await savePassengerMutation.mutateAsync({
            payload: {
              customerPassengerId,
              firstName: passenger.firstName,
              lastName: passenger.lastName,
              nationalCode: passenger.nationalCode,
              mobileNumber: passenger.mobileNumber || undefined,
              passportNumber: passenger.passportNumber || undefined,
              gender: passenger.gender,
              birthDate: toEnglishDigits(passenger.birthDate),
              ageCategoryId: Number(passenger.ageCategoryId),
              nationalityId: Number(passenger.nationalityId),
              needsWheelchair: passenger.needsWheelchair,
              specialMeal: passenger.specialMeal || undefined,
              medicalConditions: passenger.medicalConditions || undefined,
              notes: passenger.notes || undefined,
            },
            setAsDefault: passenger.setAsDefault,
          });
          customerPassengerId = saved.id;
        }

        passengersForDraft.push({
          customerPassengerId,
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          nationalCode: passenger.nationalCode,
          mobileNumber: passenger.mobileNumber || undefined,
          passportNumber: passenger.passportNumber || undefined,
          gender: passenger.gender,
          birthDate: toEnglishDigits(passenger.birthDate),
          ageCategoryId: Number(passenger.ageCategoryId),
          nationalityId: Number(passenger.nationalityId),
          needsWheelchair: passenger.needsWheelchair,
          specialMeal: passenger.specialMeal || undefined,
          medicalConditions: passenger.medicalConditions || undefined,
          notes: passenger.notes || undefined,
        });
      }

      const next = await addMutation.mutateAsync({
        draftNumber: draft.draftNumber,
        passengers: passengersForDraft,
      });
      onSuccess(next);
    } catch (error) {
      setFormError(getFormErrorMessage(error, "ثبت مسافران ناموفق بود."));
    }
  });

  const isSubmitting = addMutation.isPending || savePassengerMutation.isPending;
  const savedOptions = savedPassengers.map((passenger) => ({
    value: String(passenger.id),
    label: `${passenger.firstName} ${passenger.lastName}${passenger.isDefault ? " (پیش‌فرض)" : ""}`,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]" dir="rtl">
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">اطلاعات مسافران</h2>
            <p className="mt-1 text-sm text-text-secondary">
              حداقل {requiredCount} مسافر لازم است. می‌توانید مسافر جدید اضافه کنید یا از
              مسافران ذخیره‌شده انتخاب کنید.
            </p>
          </div>
          <button
            type="button"
            disabled={fields.length >= MAX_PASSENGERS}
            onClick={() => {
              append(emptyPassenger());
              setFormError(null);
            }}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-cta-pill-bg px-4 text-sm font-semibold text-accent disabled:opacity-40"
          >
            <Add size={18} color="#c9ada7" variant="Linear" />
            افزودن مسافر
          </button>
        </div>

        <section className="space-y-3 rounded-[24px] border border-border-input/30 bg-service-chip-bg p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">مسافران ذخیره‌شده</h3>
            {savedLoading ? (
              <span className="text-xs text-text-secondary">در حال بارگذاری...</span>
            ) : null}
          </div>
          {savedPassengers.length === 0 && !savedLoading ? (
            <p className="text-sm text-text-secondary">
              هنوز مسافر ذخیره‌شده‌ای ندارید. پس از تکمیل فرم می‌توانید هر مسافر را ذخیره کنید.
            </p>
          ) : (
            <div className="app-scroll flex gap-2 overflow-x-auto pb-1">
              {savedPassengers.map((passenger) => (
                <button
                  key={passenger.id}
                  type="button"
                  onClick={() => addSavedToList(passenger)}
                  className="shrink-0 rounded-2xl border border-border-input/40 bg-dropdown-bg px-4 py-3 text-right transition-colors hover:border-accent/50 hover:bg-cta-pill-bg"
                >
                  <p className="text-sm font-semibold text-white">
                    {passenger.firstName} {passenger.lastName}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary" dir="ltr">
                    {passenger.nationalCode}
                  </p>
                  {passenger.isDefault ? (
                    <p className="mt-1 text-[11px] text-accent">پیش‌فرض</p>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </section>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 rounded-[24px] border border-border-input/30 bg-service-chip-bg p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-white">مسافر {index + 1}</h3>
              <div className="flex flex-wrap items-center gap-2">
                {savedOptions.length > 0 ? (
                  <div className="w-full min-w-55 sm:w-64">
                    <SelectField
                      label="انتخاب سریع"
                      options={savedOptions}
                      placeholder="از مسافران من"
                      value={watch(`passengers.${index}.customerPassengerId`) ?? ""}
                      onChange={(event) => applySavedPassenger(index, event.target.value)}
                    />
                  </div>
                ) : null}
                {fields.length > requiredCount ? (
                  <button
                    type="button"
                    aria-label="حذف مسافر"
                    onClick={() => remove(index)}
                    className="mt-5 rounded-xl border border-border-input p-2 text-accent hover:bg-cta-pill-bg"
                  >
                    <Trash size={18} color="#c9ada7" variant="Linear" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                label="نام"
                error={errors.passengers?.[index]?.firstName?.message}
                {...register(`passengers.${index}.firstName`)}
              />
              <TextField
                label="نام خانوادگی"
                error={errors.passengers?.[index]?.lastName?.message}
                {...register(`passengers.${index}.lastName`)}
              />
              <TextField
                label="کد ملی"
                error={errors.passengers?.[index]?.nationalCode?.message}
                {...register(`passengers.${index}.nationalCode`)}
              />
              <TextField
                label="موبایل"
                error={errors.passengers?.[index]?.mobileNumber?.message}
                {...register(`passengers.${index}.mobileNumber`)}
              />
              <TextField
                label="شماره پاسپورت"
                error={errors.passengers?.[index]?.passportNumber?.message}
                {...register(`passengers.${index}.passportNumber`)}
              />
              <SelectField
                label="جنسیت"
                options={genderOptions}
                error={errors.passengers?.[index]?.gender?.message}
                {...register(`passengers.${index}.gender`)}
              />
              <TextField
                label="تاریخ تولد (جلالی)"
                placeholder="1365/01/01"
                error={errors.passengers?.[index]?.birthDate?.message}
                {...register(`passengers.${index}.birthDate`)}
              />
              <TextField
                label="شناسه رده سنی"
                error={errors.passengers?.[index]?.ageCategoryId?.message}
                {...register(`passengers.${index}.ageCategoryId`)}
              />
              <TextField
                label="شناسه ملیت"
                error={errors.passengers?.[index]?.nationalityId?.message}
                {...register(`passengers.${index}.nationalityId`)}
              />
              <TextField
                label="وعده غذایی ویژه"
                {...register(`passengers.${index}.specialMeal`)}
              />
              <TextField
                label="شرایط پزشکی"
                {...register(`passengers.${index}.medicalConditions`)}
              />
              <TextField label="یادداشت" {...register(`passengers.${index}.notes`)} />
            </div>

            <Controller
              name={`passengers.${index}.needsWheelchair`}
              control={control}
              render={({ field: checkboxField }) => (
                <label className="flex items-center justify-between gap-3 rounded-2xl border border-border-input px-4 py-3 text-sm text-white">
                  <span>نیاز به ویلچر</span>
                  <input
                    type="checkbox"
                    checked={checkboxField.value}
                    onChange={(event) => checkboxField.onChange(event.target.checked)}
                    className="size-4 accent-accent"
                  />
                </label>
              )}
            />

            <div className="space-y-3 rounded-2xl border border-dashed border-border-input/40 p-3">
              <Controller
                name={`passengers.${index}.saveToMyPassengers`}
                control={control}
                render={({ field: checkboxField }) => (
                  <label className="flex items-center justify-between gap-3 text-sm text-white">
                    <span>ذخیره در مسافران من برای رزروهای بعدی</span>
                    <input
                      type="checkbox"
                      checked={checkboxField.value}
                      onChange={(event) => checkboxField.onChange(event.target.checked)}
                      className="size-4 accent-accent"
                    />
                  </label>
                )}
              />
              <Controller
                name={`passengers.${index}.setAsDefault`}
                control={control}
                render={({ field: checkboxField }) => (
                  <label className="flex items-center justify-between gap-3 text-sm text-white">
                    <span>تنظیم به‌عنوان مسافر پیش‌فرض</span>
                    <input
                      type="checkbox"
                      checked={checkboxField.value}
                      onChange={(event) => checkboxField.onChange(event.target.checked)}
                      className="size-4 accent-accent"
                    />
                  </label>
                )}
              />
              <button
                type="button"
                onClick={() => void savePassengerNow(index)}
                disabled={savingIndex === index || isSubmitting}
                className="flex h-11 w-full items-center justify-center rounded-xl border border-accent/40 text-sm font-semibold text-accent hover:bg-cta-pill-bg disabled:opacity-50"
              >
                {savingIndex === index ? "در حال ذخیره..." : "ذخیره همین مسافر الان"}
              </button>
            </div>
          </div>
        ))}

        {formError || addMutation.isError ? (
          <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
            {formError || getFormErrorMessage(addMutation.error, "ثبت مسافران ناموفق بود.")}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-accent font-extrabold text-black disabled:opacity-50"
          >
            {isSubmitting ? "در حال ذخیره..." : "ادامه"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-border-input text-text-secondary"
          >
            بازگشت
          </button>
        </div>
      </form>

      <PriceSummaryCard draft={draft} />
    </div>
  );
}
