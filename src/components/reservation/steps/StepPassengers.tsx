"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, TickCircle, Trash } from "iconsax-react";
import PriceSummaryCard from "@/components/reservation/PriceSummaryCard";
import { getFormErrorMessage } from "@/components/auth/auth-form-utils";
import Select from "@/components/ui/Select";
import TextField from "@/components/ui/TextField";
import { toastSuccess } from "@/lib/toast";
import { maskBirthDateInput, nullIfEmpty, toEnglishDigits } from "@/lib/format";
import {
  draftPassengerSchema,
  type DraftPassengerFormValues,
} from "@/schemas/reservation";
import { liveFormValidation } from "@/lib/validation";
import {
  useAddDraftPassengers,
  useDraftMyPassengers,
  useSaveDraftMyPassenger,
} from "@/services/reservation/reservation.queries";
import type {
  DraftMyPassenger,
  ReservationDraft,
} from "@/services/reservation/reservation.types";
import { useLookupSelectOptions } from "@/services/lookups/lookups.queries";

interface StepPassengersProps {
  draft: ReservationDraft;
  onBack: () => void;
  onSuccess: (draft: ReservationDraft) => void;
}

function emptyPassenger(): DraftPassengerFormValues {
  return {
    customerPassengerId: "",
    firstName: "",
    lastName: "",
    nationalCode: "",
    mobileNumber: "",
    passportNumber: "",
    gender: "",
    birthDate: "",
    ageCategoryId: "",
    nationalityId: "",
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
    gender: passenger.gender || "",
    birthDate: normalizeBirthDate(passenger.birthDate),
    ageCategoryId: passenger.ageCategoryId ? String(passenger.ageCategoryId) : "",
    nationalityId: passenger.nationalityId ? String(passenger.nationalityId) : "",
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
  const {
    ageCategoryOptions,
    nationalityOptions,
    genderOptions,
    ageCategoriesLoading,
    nationalitiesLoading,
    gendersLoading,
  } = useLookupSelectOptions();

  const [selectedPassengers, setSelectedPassengers] = useState<DraftPassengerFormValues[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSavingNew, setIsSavingNew] = useState(false);
  const [savedPickValue, setSavedPickValue] = useState("");

  const savedPassengers = useMemo<DraftMyPassenger[]>(
    () => savedPage?.list ?? [],
    [savedPage?.list],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm<DraftPassengerFormValues>({
    resolver: zodResolver(draftPassengerSchema),
    ...liveFormValidation,
    defaultValues: emptyPassenger(),
  });

  const birthDateField = register("birthDate");

  const selectedIds = useMemo(
    () =>
      new Set(
        selectedPassengers
          .map((passenger) => passenger.customerPassengerId)
          .filter((id): id is string => Boolean(id)),
      ),
    [selectedPassengers],
  );

  const availableSaved = useMemo(
    () => savedPassengers.filter((passenger) => !selectedIds.has(String(passenger.id))),
    [savedPassengers, selectedIds],
  );

  const savedOptions = availableSaved.map((passenger) => ({
    value: String(passenger.id),
    label: `${passenger.firstName} ${passenger.lastName}${passenger.isDefault ? " (پیش‌فرض)" : ""}`,
  }));

  const useSavedDropdown = savedPassengers.length > 5;
  const isComplete = selectedPassengers.length >= requiredCount;
  const canAddMore = selectedPassengers.length < requiredCount;
  const remaining = Math.max(requiredCount - selectedPassengers.length, 0);
  const isSubmitting = addMutation.isPending || savePassengerMutation.isPending;

  function addSavedPassenger(passenger: DraftMyPassenger) {
    if (selectedIds.has(String(passenger.id))) return;
    if (!canAddMore) {
      setFormError(`تعداد مسافران این رزرو کامل است (${requiredCount} نفر).`);
      return;
    }
    setSelectedPassengers((prev) => [...prev, passengerFromSaved(passenger)]);
    setFormError(null);
  }

  function handleSavedPick(passengerId: string) {
    setSavedPickValue("");
    if (!passengerId) return;
    const passenger = savedPassengers.find((item) => String(item.id) === passengerId);
    if (passenger) addSavedPassenger(passenger);
  }

  function removeSelected(index: number) {
    setSelectedPassengers((prev) => prev.filter((_, i) => i !== index));
    setFormError(null);
  }

  function openNewPassengerForm() {
    if (!canAddMore) {
      setFormError(`تعداد مسافران این رزرو کامل است (${requiredCount} نفر).`);
      return;
    }
    reset(emptyPassenger());
    setIsAddingNew(true);
    setFormError(null);
  }

  function cancelNewPassengerForm() {
    setIsAddingNew(false);
    reset(emptyPassenger());
  }

  const addNewPassengerToList = handleSubmit(async (values) => {
    setIsSavingNew(true);
    setFormError(null);
    try {
      let nextPassenger = values;

      if (values.saveToMyPassengers) {
        const saved = await savePassengerMutation.mutateAsync({
          payload: {
            firstName: values.firstName,
            lastName: values.lastName,
            nationalCode: nullIfEmpty(values.nationalCode),
            mobileNumber: values.mobileNumber,
            passportNumber: nullIfEmpty(values.passportNumber),
            gender: values.gender,
            birthDate: toEnglishDigits(values.birthDate),
            ageCategoryId: Number(values.ageCategoryId),
            nationalityId: Number(values.nationalityId),
            needsWheelchair: values.needsWheelchair,
            specialMeal: nullIfEmpty(values.specialMeal),
            medicalConditions: nullIfEmpty(values.medicalConditions),
            notes: nullIfEmpty(values.notes),
          },
          setAsDefault: values.setAsDefault,
        });
        nextPassenger = {
          ...values,
          customerPassengerId: String(saved.id),
          saveToMyPassengers: false,
        };
        toastSuccess("مسافر در فهرست شما ذخیره شد.");
      }

      setSelectedPassengers((prev) => [...prev, nextPassenger]);
      setIsAddingNew(false);
      reset(emptyPassenger());
    } catch (error) {
      setFormError(getFormErrorMessage(error, "افزودن مسافر ناموفق بود."));
    } finally {
      setIsSavingNew(false);
    }
  });

  async function continueReservation() {
    if (isAddingNew) {
      setFormError("ابتدا افزودن مسافر جدید را تکمیل یا لغو کنید.");
      return;
    }
    if (selectedPassengers.length < requiredCount) {
      setFormError(`حداقل ${requiredCount} مسافر برای این رزرو لازم است.`);
      return;
    }

    setFormError(null);
    try {
      const next = await addMutation.mutateAsync({
        draftNumber: draft.draftNumber,
        passengers: selectedPassengers.map((passenger) => ({
          customerPassengerId: passenger.customerPassengerId
            ? Number(passenger.customerPassengerId)
            : null,
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          nationalCode: nullIfEmpty(passenger.nationalCode),
          mobileNumber: passenger.mobileNumber,
          passportNumber: nullIfEmpty(passenger.passportNumber),
          gender: passenger.gender,
          birthDate: toEnglishDigits(passenger.birthDate),
          ageCategoryId: Number(passenger.ageCategoryId),
          nationalityId: Number(passenger.nationalityId),
          needsWheelchair: passenger.needsWheelchair,
          specialMeal: nullIfEmpty(passenger.specialMeal),
          medicalConditions: nullIfEmpty(passenger.medicalConditions),
          notes: nullIfEmpty(passenger.notes),
        })),
      });
      onSuccess(next);
    } catch (error) {
      setFormError(getFormErrorMessage(error, "ثبت مسافران ناموفق بود."));
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]" dir="rtl">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">اطلاعات مسافران</h2>
            <p className="mt-1 text-sm text-text-secondary">
              از مسافران ذخیره‌شده انتخاب کنید یا مسافر جدید اضافه کنید. تعداد مورد نیاز:{" "}
              {requiredCount} نفر.
            </p>
          </div>
          <button
            type="button"
            disabled={!canAddMore || isAddingNew}
            onClick={openNewPassengerForm}
            title={
              isComplete
                ? "تعداد مسافران این رزرو کامل است"
                : undefined
            }
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-cta-pill-bg px-4 text-sm font-semibold text-accent disabled:opacity-40"
          >
            <Add size={18} color="#c9ada7" variant="Linear" />
            افزودن مسافر جدید
          </button>
        </div>

        <section className="space-y-3 rounded-3xl border border-border-input/30 bg-service-chip-bg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">مسافران این رزرو</h3>
            <p className="text-xs text-text-secondary">
              {selectedPassengers.length} از {requiredCount}
              {remaining > 0 ? ` · ${remaining} مسافر دیگر لازم است` : " · کامل شد"}
            </p>
          </div>

          {selectedPassengers.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border-input/40 px-4 py-6 text-center text-sm text-text-secondary">
              هنوز مسافری انتخاب نشده است. از فهرست ذخیره‌شده انتخاب کنید یا مسافر جدید بسازید.
            </p>
          ) : (
            <ul className="space-y-2">
              {selectedPassengers.map((passenger, index) => (
                <li
                  key={`${passenger.customerPassengerId || passenger.nationalCode}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-cta-pill-bg px-4 py-3"
                >
                  <div className="min-w-0 text-right">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white">
                        {passenger.firstName} {passenger.lastName}
                      </p>
                      {passenger.customerPassengerId ? (
                        <span className="rounded-lg bg-dropdown-bg px-2 py-0.5 text-[10px] text-accent">
                          ذخیره‌شده
                        </span>
                      ) : (
                        <span className="rounded-lg bg-dropdown-bg px-2 py-0.5 text-[10px] text-text-secondary">
                          جدید
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-text-secondary" dir="ltr">
                      {passenger.nationalCode}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`حذف ${passenger.firstName} ${passenger.lastName}`}
                    onClick={() => removeSelected(index)}
                    className="rounded-xl border border-danger/40 p-2 text-danger transition-colors hover:bg-danger/10"
                  >
                    <Trash size={16} color="#e35d5d" variant="Linear" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3 rounded-3xl border border-border-input/30 bg-service-chip-bg p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">مسافران ذخیره‌شده</h3>
            {savedLoading ? (
              <span className="text-xs text-text-secondary">در حال بارگذاری...</span>
            ) : null}
          </div>

          {savedPassengers.length === 0 && !savedLoading ? (
            <p className="text-sm text-text-secondary">
              هنوز مسافر ذخیره‌شده‌ای ندارید. می‌توانید با «افزودن مسافر جدید» یکی بسازید.
            </p>
          ) : useSavedDropdown ? (
            availableSaved.length === 0 ? (
              <p className="text-sm text-text-secondary">همه مسافران ذخیره‌شده انتخاب شده‌اند.</p>
            ) : (
              <Select
                options={savedOptions}
                value={savedPickValue}
                onChange={(event) => handleSavedPick(event.target.value)}
                placeholder="انتخاب مسافر ذخیره‌شده"
                searchPlaceholder="جستجوی نام مسافر..."
                searchable
                isLoading={savedLoading}
                disabled={!canAddMore}
              />
            )
          ) : (
            <div className="app-scroll flex gap-2 overflow-x-auto pb-1">
              {savedPassengers.map((passenger) => {
                const selected = selectedIds.has(String(passenger.id));
                return (
                  <button
                    key={passenger.id}
                    type="button"
                    disabled={selected || !canAddMore}
                    onClick={() => addSavedPassenger(passenger)}
                    className={`shrink-0 rounded-2xl border px-4 py-3 text-right transition-colors ${
                      selected
                        ? "border-accent bg-cta-pill-bg"
                        : "border-border-input/40 bg-dropdown-bg hover:border-accent/50 hover:bg-cta-pill-bg disabled:opacity-40"
                    }`}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      {selected ? <TickCircle size={16} color="#c9ada7" variant="Bold" /> : null}
                      <p className="text-sm font-semibold text-white">
                        {passenger.firstName} {passenger.lastName}
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-text-secondary" dir="ltr">
                      {passenger.nationalCode}
                    </p>
                    {passenger.isDefault ? (
                      <p className="mt-1 text-[11px] text-accent">پیش‌فرض</p>
                    ) : null}
                    {selected ? (
                      <p className="mt-1 text-[11px] text-accent">انتخاب شده</p>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {isAddingNew ? (
          <form
            onSubmit={addNewPassengerToList}
            className="space-y-4 rounded-3xl border border-border-input/30 bg-service-chip-bg p-4 sm:p-5"
            noValidate
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-white">مسافر جدید</h3>
              <button
                type="button"
                onClick={cancelNewPassengerForm}
                className="text-sm text-text-secondary transition-colors hover:text-white"
              >
                انصراف
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                label="نام (انگلیسی)"
                dir="ltr"
                className="[&_input]:text-left [&_input]:placeholder:text-left"
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <TextField
                label="نام خانوادگی (انگلیسی)"
                dir="ltr"
                className="[&_input]:text-left [&_input]:placeholder:text-left"
                error={errors.lastName?.message}
                {...register("lastName")}
              />
              <TextField
                label="کد ملی"
                error={errors.nationalCode?.message}
                {...register("nationalCode")}
              />
              <TextField
                label="موبایل"
                error={errors.mobileNumber?.message}
                {...register("mobileNumber")}
              />
              <TextField
                label="شماره پاسپورت"
                error={errors.passportNumber?.message}
                {...register("passportNumber")}
              />
              <Select
                label="جنسیت"
                options={genderOptions}
                placeholder="انتخاب کنید"
                isLoading={gendersLoading}
                error={errors.gender?.message}
                {...register("gender")}
              />
              <TextField
                label="تاریخ تولد "
                placeholder="..../../.."
                inputMode="numeric"
                autoComplete="bday"
                maxLength={10}
                dir="ltr"
                className="[&_input]:text-left [&_input]:placeholder:text-left [&_input]:tracking-widest [&_input]:placeholder:tracking-widest"
                error={errors.birthDate?.message}
                name={birthDateField.name}
                ref={birthDateField.ref}
                onBlur={birthDateField.onBlur}
                onChange={(event) => {
                  event.target.value = maskBirthDateInput(
                    event.target.value,
                    getValues("birthDate") ?? "",
                  );
                  void birthDateField.onChange(event);
                }}
              />
              <Select
                label="رده سنی"
                options={ageCategoryOptions}
                placeholder="انتخاب کنید"
                isLoading={ageCategoriesLoading}
                error={errors.ageCategoryId?.message}
                {...register("ageCategoryId")}
              />
              <Select
                label="ملیت"
                options={nationalityOptions}
                placeholder="انتخاب کنید"
                isLoading={nationalitiesLoading}
                searchable
                error={errors.nationalityId?.message}
                {...register("nationalityId")}
              />
              <TextField label="وعده غذایی ویژه" {...register("specialMeal")} />
              <TextField label="شرایط پزشکی" {...register("medicalConditions")} />
              <TextField label="یادداشت" {...register("notes")} />
            </div>

            <Controller
              name="needsWheelchair"
              control={control}
              render={({ field }) => (
                <label className="flex items-center justify-between gap-3 rounded-2xl border border-border-input px-4 py-3 text-sm text-white">
                  <span>نیاز به ویلچر</span>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    className="size-4 accent-accent"
                  />
                </label>
              )}
            />

            <div className="space-y-3 rounded-2xl border border-dashed border-border-input/40 p-3">
              <Controller
                name="saveToMyPassengers"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center justify-between gap-3 text-sm text-white">
                    <span>ذخیره در مسافران من برای رزروهای بعدی</span>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className="size-4 accent-accent"
                    />
                  </label>
                )}
              />
              {watch("saveToMyPassengers") ? (
                <Controller
                  name="setAsDefault"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center justify-between gap-3 text-sm text-white">
                      <span>تنظیم به‌عنوان مسافر پیش‌فرض</span>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(event) => field.onChange(event.target.checked)}
                        className="size-4 accent-accent"
                      />
                    </label>
                  )}
                />
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSavingNew || isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-accent font-extrabold text-black disabled:opacity-50"
            >
              {isSavingNew ? "در حال افزودن..." : "افزودن به مسافران رزرو"}
            </button>
          </form>
        ) : null}

        {formError || addMutation.isError ? (
          <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
            {formError || getFormErrorMessage(addMutation.error, "ثبت مسافران ناموفق بود.")}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void continueReservation()}
            disabled={isSubmitting || isAddingNew}
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
      </div>

      <PriceSummaryCard draft={draft} />
    </div>
  );
}
