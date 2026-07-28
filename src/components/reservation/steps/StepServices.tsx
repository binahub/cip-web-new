"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Trash } from "iconsax-react";
import CountField from "@/components/reservation/CountField";
import PriceSummaryCard from "@/components/reservation/PriceSummaryCard";
import { getFormErrorMessage } from "@/components/auth/auth-form-utils";
import Select from "@/components/ui/Select";
import TextField from "@/components/ui/TextField";
import {
  addServicesFormSchema,
  type AddServicesFormValues,
} from "@/schemas/reservation";
import { liveFormValidation } from "@/lib/validation";
import { useLookupSelectOptions } from "@/services/lookups/lookups.queries";
import { useActiveSubServiceItems } from "@/services/main-services/main-services.queries";
import type { ActiveMainServiceSummaryItem } from "@/services/main-services/main-services.types";
import { useAddDraftServices } from "@/services/reservation/reservation.queries";
import type { ReservationDraft } from "@/services/reservation/reservation.types";

interface StepServicesProps {
  draft: ReservationDraft;
  onBack: () => void;
  onSuccess: (draft: ReservationDraft) => void;
}

const emptyService = {
  mainServiceId: "",
  quantity: 1,
  ageCategoryId: "",
  nationalityId: "",
  description: "",
  escortName: "",
  escortNationalCode: "",
  escortMobile: "",
};

export default function StepServices({ draft, onBack, onSuccess }: StepServicesProps) {
  const { data: mainServices, isPending: servicesLoading } = useActiveSubServiceItems();
  const addMutation = useAddDraftServices();
  const {
    ageCategoryOptions,
    nationalityOptions,
    ageCategoriesLoading,
    nationalitiesLoading,
  } = useLookupSelectOptions();

  const serviceOptions = (mainServices ?? []).map((item: ActiveMainServiceSummaryItem) => ({
    value: item.mainService.id,
    label: item.mainService.name,
  }));

  const getSymbolByServiceId = (id: string) =>
    (mainServices ?? []).find(
      (item: ActiveMainServiceSummaryItem) => item.mainService.id === id,
    )?.mainService.symbol;

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setError,
    watch,
    formState: { errors },
  } = useForm<AddServicesFormValues>({
    resolver: zodResolver(addServicesFormSchema),
    ...liveFormValidation,
    defaultValues: { services: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "services" });

  const watchedServices = watch("services");

  const onSubmit = handleSubmit(async (values) => {
    if (values.services.length === 0) {
      onSuccess(draft);
      return;
    }

    // Validate escort fields for Escort services
    let hasEscortError = false;
    values.services.forEach((service, index) => {
      const symbol = getSymbolByServiceId(service.mainServiceId);
      if (symbol === "Escort") {
        if (!service.escortName?.trim()) {
          setError(`services.${index}.escortName`, { message: "نام مشایعت کننده الزامی است." });
          hasEscortError = true;
        }
        if (!service.escortNationalCode?.trim()) {
          setError(`services.${index}.escortNationalCode`, { message: "کد ملی مشایعت کننده الزامی است." });
          hasEscortError = true;
        }
        if (!service.escortMobile?.trim()) {
          setError(`services.${index}.escortMobile`, { message: "موبایل مشایعت کننده الزامی است." });
          hasEscortError = true;
        }
      }
    });
    if (hasEscortError) return;

    // Validate format of filled escort fields
    const escortFieldPaths: string[] = [];
    values.services.forEach((service, index) => {
      const symbol = getSymbolByServiceId(service.mainServiceId);
      if (symbol === "Escort") {
        escortFieldPaths.push(`services.${index}.escortName`);
        escortFieldPaths.push(`services.${index}.escortNationalCode`);
        escortFieldPaths.push(`services.${index}.escortMobile`);
      }
    });
    if (escortFieldPaths.length > 0) {
      const valid = await trigger(escortFieldPaths as Parameters<typeof trigger>[0]);
      if (!valid) return;
    }

    const next = await addMutation.mutateAsync({
      draftNumber: draft.draftNumber,
      services: values.services.map((service) => {
        const symbol = getSymbolByServiceId(service.mainServiceId);
        let description = service.description || undefined;

        if (symbol === "Escort") {
          const parts: string[] = [];
          if (service.escortName) parts.push(`نام مشایعت کننده: ${service.escortName}`);
          if (service.escortNationalCode) parts.push(`کد ملی مشایعت کننده: ${service.escortNationalCode}`);
          if (service.escortMobile) parts.push(`موبایل مشایعت کننده: ${service.escortMobile}`);
          if (service.description) parts.push(`توضیحات: ${service.description}`);
          description = parts.length > 0 ? parts.join(" | ") : undefined;
        }

        return {
          mainServiceId: Number(service.mainServiceId),
          quantity: service.quantity,
          ageCategoryId: Number(service.ageCategoryId),
          nationalityId: Number(service.nationalityId),
          description,
        };
      }),
    });
    onSuccess(next);
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]" dir="rtl">
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">خدمات تکمیلی</h2>
            <p className="mt-1 text-sm text-text-secondary">
              در صورت نیاز خدمات اضافی اضافه کنید یا این مرحله را رد کنید.
            </p>
          </div>
          <button
            type="button"
            onClick={() => append(emptyService)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-cta-pill-bg px-4 text-sm font-semibold text-accent"
          >
            <Add size={18} color="#C9A063" variant="Linear" />
            افزودن خدمت
          </button>
        </div>

        {fields.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-input/40 px-4 py-8 text-center text-sm text-text-secondary">
            خدمت تکمیلی انتخاب نشده است.
          </p>
        ) : (
          fields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 rounded-[24px] border border-border-input/30 bg-service-chip-bg p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-white">خدمت {index + 1}</h3>
                <button
                  type="button"
                  aria-label="حذف خدمت"
                  onClick={() => remove(index)}
                  className="rounded-xl border border-border-input p-2 text-accent hover:bg-cta-pill-bg"
                >
                  <Trash size={18} color="#C9A063" variant="Linear" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="خدمت"
                  options={serviceOptions}
                  placeholder="انتخاب کنید"
                  isLoading={servicesLoading}
                  error={errors.services?.[index]?.mainServiceId?.message}
                  {...register(`services.${index}.mainServiceId`)}
                />
               
                
                <Select
                  label="رده سنی"
                  options={ageCategoryOptions}
                  placeholder="انتخاب کنید"
                  isLoading={ageCategoriesLoading}
                  error={errors.services?.[index]?.ageCategoryId?.message}
                  {...register(`services.${index}.ageCategoryId`)}
                />
                <Select
                  label="ملیت"
                  options={nationalityOptions}
                  placeholder="انتخاب کنید"
                  isLoading={nationalitiesLoading}
                  searchable
                  error={errors.services?.[index]?.nationalityId?.message}
                  {...register(`services.${index}.nationalityId`)}
                />
                 <span className="col-span-2">
                <Controller
                  name={`services.${index}.quantity`}
                  control={control}
                  render={({ field: countField }) => (
                    <CountField
                      label="تعداد"
                      value={countField.value}
                      min={1}
                      onChange={countField.onChange}
                      error={errors.services?.[index]?.quantity?.message}
                    />
                  )}
                />
                </span>
                {getSymbolByServiceId(watchedServices?.[index]?.mainServiceId) === "Escort" && (
                  <>
                    <TextField
                      label="نام مشایعت کننده"
                      error={errors.services?.[index]?.escortName?.message}
                      {...register(`services.${index}.escortName`)}
                    />
                    <TextField
                      label="کد ملی مشایعت کننده"
                      error={errors.services?.[index]?.escortNationalCode?.message}
                      {...register(`services.${index}.escortNationalCode`)}
                    />
                    <TextField
                      label="موبایل مشایعت کننده"
                      error={errors.services?.[index]?.escortMobile?.message}
                      {...register(`services.${index}.escortMobile`)}
                    />
                  </>
                )}
                <div className="sm:col-span-2">
                  <TextField
                    label="توضیحات"
                    {...register(`services.${index}.description`)}
                  />
                </div>
                
              </div>
            </div>
          ))
        )}

        {addMutation.isError ? (
          <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
            {getFormErrorMessage(addMutation.error, "افزودن خدمات ناموفق بود.")}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
        <button
            type="button"
            onClick={onBack}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-border-input text-text-secondary"
          >
            بازگشت
          </button>
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-accent font-extrabold text-black disabled:opacity-50"
          >
            {addMutation.isPending ? "در حال ذخیره..." : "ادامه"}
          </button>
          
        </div>
      </form>

      <PriceSummaryCard draft={draft} />
    </div>
  );
}
