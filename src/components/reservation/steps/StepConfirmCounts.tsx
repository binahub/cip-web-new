"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CountField from "@/components/reservation/CountField";
import PriceSummaryCard from "@/components/reservation/PriceSummaryCard";
import ServicePickCards from "@/components/reservation/ServicePickCards";
import { getFormErrorMessage } from "@/components/auth/auth-form-utils";
import {
  updateCountsFormSchema,
  type UpdateCountsFormValues,
} from "@/schemas/reservation";
import { liveFormValidation } from "@/lib/validation";
import { useActiveMainServiceItems } from "@/services/main-services/main-services.queries";
import { updatePassengerCounts } from "@/services/reservation/reservation.api";
import { useUpdatePassengerCounts } from "@/services/reservation/reservation.queries";
import type { ReservationDraft } from "@/services/reservation/reservation.types";

interface StepConfirmCountsProps {
  draft: ReservationDraft;
  primaryServiceId: string;
  onBack: () => void;
  onDraftUpdate: (draft: ReservationDraft) => void;
  onSuccess: (draft: ReservationDraft, primaryServiceId: string) => void;
}

function buildSyncKey(values: UpdateCountsFormValues, draftNumber: string) {
  return [
    draftNumber,
    values.adultCount,
    values.childCount,
    values.infantCount,
    values.luggageCount,
    values.primaryServiceId,
  ].join(":");
}

function resolvePrimaryServiceId(draft: ReservationDraft, primaryServiceId: string) {
  if (primaryServiceId) return String(primaryServiceId);
  const fromDraft = draft.services[0]?.mainServiceId;
  return fromDraft != null ? String(fromDraft) : "";
}

function initialFormValues(
  draft: ReservationDraft,
  primaryServiceId: string,
): UpdateCountsFormValues {
  return {
    adultCount: Number(draft.passengerCounts.adultCount) || 0,
    childCount: Number(draft.passengerCounts.childCount) || 0,
    infantCount: Number(draft.passengerCounts.infantCount) || 0,
    luggageCount: Number(draft.passengerCounts.luggageCount) || 0,
    primaryServiceId: resolvePrimaryServiceId(draft, primaryServiceId),
  };
}

export default function StepConfirmCounts({
  draft,
  primaryServiceId,
  onBack,
  onDraftUpdate,
  onSuccess,
}: StepConfirmCountsProps) {
  const { data: mainServices = [], isPending: servicesLoading } = useActiveMainServiceItems();
  const updateMutation = useUpdatePassengerCounts();
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const previewRequestId = useRef(0);
  const lastSyncedKey = useRef(
    buildSyncKey(initialFormValues(draft, primaryServiceId), draft.draftNumber),
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCountsFormValues>({
    resolver: zodResolver(updateCountsFormSchema),
    ...liveFormValidation,
    defaultValues: initialFormValues(draft, primaryServiceId),
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    const values = initialFormValues(draft, primaryServiceId);
    reset(values);
    lastSyncedKey.current = buildSyncKey(values, draft.draftNumber);
    // Re-seed when entering this step with a draft / service from step 1.
    // Do not depend on live draft price-preview updates.
  }, [draft.draftNumber, primaryServiceId, reset]);

  useEffect(() => {
    const values: UpdateCountsFormValues = {
      adultCount: watchedValues.adultCount ?? 0,
      childCount: watchedValues.childCount ?? 0,
      infantCount: watchedValues.infantCount ?? 0,
      luggageCount: watchedValues.luggageCount ?? 0,
      primaryServiceId: watchedValues.primaryServiceId ?? "",
    };

    const totalPassengers = values.adultCount + values.childCount + values.infantCount;
    if (!values.primaryServiceId || totalPassengers < 1) return;

    const syncKey = buildSyncKey(values, draft.draftNumber);
    if (syncKey === lastSyncedKey.current) return;

    const requestId = ++previewRequestId.current;
    const timer = window.setTimeout(() => {
      void (async () => {
        setIsPreviewing(true);
        setPreviewError(null);
        try {
          const next = await updatePassengerCounts({
            draftNumber: draft.draftNumber,
            adultCount: values.adultCount,
            childCount: values.childCount,
            infantCount: values.infantCount,
            luggageCount: values.luggageCount,
            primaryServiceId: Number(values.primaryServiceId),
          });
          if (requestId !== previewRequestId.current) return;
          lastSyncedKey.current = syncKey;
          onDraftUpdate(next);
        } catch (error) {
          if (requestId !== previewRequestId.current) return;
          setPreviewError(getFormErrorMessage(error, "به‌روزرسانی پیش‌فاکتور ناموفق بود."));
        } finally {
          if (requestId === previewRequestId.current) {
            setIsPreviewing(false);
          }
        }
      })();
    }, 450);

    return () => window.clearTimeout(timer);
  }, [
    watchedValues.adultCount,
    watchedValues.childCount,
    watchedValues.infantCount,
    watchedValues.luggageCount,
    watchedValues.primaryServiceId,
    draft.draftNumber,
    onDraftUpdate,
  ]);

  const onSubmit = handleSubmit(async (values) => {
    previewRequestId.current += 1;
    setIsPreviewing(false);

    const syncKey = buildSyncKey(values, draft.draftNumber);
    if (syncKey === lastSyncedKey.current) {
      onSuccess(draft, values.primaryServiceId);
      return;
    }

    const next = await updateMutation.mutateAsync({
      draftNumber: draft.draftNumber,
      adultCount: values.adultCount,
      childCount: values.childCount,
      infantCount: values.infantCount,
      luggageCount: values.luggageCount,
      primaryServiceId: Number(values.primaryServiceId),
    });
    lastSyncedKey.current = syncKey;
    onSuccess(next, values.primaryServiceId);
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]" dir="rtl">
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div>
          <h2 className="text-xl font-bold text-white">تایید تعداد مسافران</h2>
          <p className="mt-1 text-sm text-text-secondary">
            با تغییر تعداد یا خدمت، پیش‌فاکتور به‌صورت خودکار به‌روز می‌شود.
          </p>
        </div>

        <div className="rounded-2xl border border-border-input/30 bg-service-chip-bg p-4 text-sm text-text-secondary">
          <p>
            پرواز {draft.flightInfo.flightNumber} — {draft.flightInfo.flightDate}
          </p>
          <p className="mt-1">
            {draft.flightInfo.airlineObject.persianName} · ترمینال {draft.flightInfo.terminal}
          </p>
        </div>

        <Controller
          name="primaryServiceId"
          control={control}
          render={({ field }) => (
            <ServicePickCards
              items={mainServices}
              value={field.value}
              onChange={field.onChange}
              isLoading={servicesLoading}
              error={errors.primaryServiceId?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Controller
            name="adultCount"
            control={control}
            render={({ field }) => (
              <CountField
                label="بزرگسال"
                value={field.value}
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

        {previewError || updateMutation.isError ? (
          <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
            {previewError ||
              getFormErrorMessage(updateMutation.error, "به‌روزرسانی ناموفق بود.")}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={updateMutation.isPending || isPreviewing}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-accent font-extrabold text-black disabled:opacity-50"
          >
            {updateMutation.isPending ? "در حال ذخیره..." : "ادامه"}
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

      <PriceSummaryCard draft={draft} isLoading={isPreviewing} />
    </div>
  );
}
