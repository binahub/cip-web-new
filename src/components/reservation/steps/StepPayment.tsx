"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PriceSummaryCard from "@/components/reservation/PriceSummaryCard";
import { getFormErrorMessage } from "@/components/auth/auth-form-utils";
import SelectField from "@/components/ui/SelectField";
import TextField from "@/components/ui/TextField";
import { formatPrice } from "@/lib/format";
import { paymentFormSchema, type PaymentFormValues } from "@/schemas/reservation";
import {
  useCalculateCoupon,
  useFinalizePostpaid,
  useFinalizeWallet,
  useRemoveCoupon,
  useReservationWalletInfo,
} from "@/services/reservation/reservation.queries";
import type {
  FinalizedReservation,
  ReservationDraft,
} from "@/services/reservation/reservation.types";

interface StepPaymentProps {
  draft: ReservationDraft;
  onBack: () => void;
  onDraftUpdate: (draft: ReservationDraft) => void;
  onSuccess: (reservation: FinalizedReservation) => void;
}

export default function StepPayment({
  draft,
  onBack,
  onDraftUpdate,
  onSuccess,
}: StepPaymentProps) {
  const [couponCode, setCouponCode] = useState(draft.priceBreakdown.couponCode ?? "");
  const { data: walletInfo, isPending: walletLoading } = useReservationWalletInfo(true);
  const calculateCoupon = useCalculateCoupon();
  const removeCouponMutation = useRemoveCoupon();
  const finalizePostpaidMutation = useFinalizePostpaid();
  const finalizeWalletMutation = useFinalizeWallet();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "postpaid",
      walletAccountId: "",
      specialNeeds: "",
      customerNotes: "",
      agreeToTerms: false,
      saveMainPassengerAsDefault: false,
    },
  });

  const paymentMethod = watch("paymentMethod");
  const amount = draft.priceBreakdown.finalAmount;
  const isPaying =
    finalizePostpaidMutation.isPending || finalizeWalletMutation.isPending;

  const walletOptions =
    walletInfo?.walletAccounts.map((account) => ({
      value: String(account.id),
      label: `${account.accountNumber} — موجودی ${formatPrice(account.balance)} (${account.walletAccountCurrencyObject.description})`,
    })) ?? [];

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    const next = await calculateCoupon.mutateAsync({
      draftNumber: draft.draftNumber,
      couponCode: couponCode.trim(),
    });
    onDraftUpdate(next);
  }

  async function handleRemoveCoupon() {
    const next = await removeCouponMutation.mutateAsync({
      draftNumber: draft.draftNumber,
    });
    setCouponCode("");
    onDraftUpdate(next);
  }

  const onSubmit = handleSubmit(async (values) => {
    if (values.paymentMethod === "wallet") {
      const reservation = await finalizeWalletMutation.mutateAsync({
        draftNumber: draft.draftNumber,
        specialNeeds: values.specialNeeds || undefined,
        customerNotes: values.customerNotes || undefined,
        agreeToTerms: values.agreeToTerms,
        saveMainPassengerAsDefault: values.saveMainPassengerAsDefault,
        walletAccountId: Number(values.walletAccountId),
        amount,
      });
      onSuccess(reservation);
      return;
    }

    const reservation = await finalizePostpaidMutation.mutateAsync({
      draftNumber: draft.draftNumber,
      specialNeeds: values.specialNeeds || undefined,
      customerNotes: values.customerNotes || undefined,
      agreeToTerms: values.agreeToTerms,
      saveMainPassengerAsDefault: values.saveMainPassengerAsDefault,
      amount,
    });
    onSuccess(reservation);
  });

  const payError =
    finalizePostpaidMutation.error ||
    finalizeWalletMutation.error ||
    calculateCoupon.error ||
    removeCouponMutation.error;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]" dir="rtl">
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div>
          <h2 className="text-xl font-bold text-white">پرداخت و نهایی‌سازی</h2>
          <p className="mt-1 text-sm text-text-secondary">
            پیش‌فاکتور را بررسی کنید، در صورت نیاز کد تخفیف بزنید و روش پرداخت را انتخاب کنید.
          </p>
        </div>

        <div className="space-y-3 rounded-[24px] border border-border-input/30 bg-service-chip-bg p-4 sm:p-5">
          <p className="text-sm font-semibold text-white">کد تخفیف</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TextField
              placeholder="کد تخفیف"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              disabled={Boolean(draft.priceBreakdown.couponCode)}
            />
            {draft.priceBreakdown.couponCode ? (
              <button
                type="button"
                onClick={() => void handleRemoveCoupon()}
                disabled={removeCouponMutation.isPending}
                className="flex h-14 shrink-0 items-center justify-center rounded-2xl border border-border-input px-5 text-text-secondary disabled:opacity-50"
              >
                {removeCouponMutation.isPending ? "..." : "حذف کد"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleApplyCoupon()}
                disabled={calculateCoupon.isPending || !couponCode.trim()}
                className="flex h-14 shrink-0 items-center justify-center rounded-2xl bg-cta-pill-bg px-5 font-semibold text-accent disabled:opacity-50"
              >
                {calculateCoupon.isPending ? "..." : "اعمال"}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-text-secondary">روش پرداخت</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4 ${
                paymentMethod === "postpaid"
                  ? "border-accent bg-cta-pill-bg"
                  : "border-border-input/40"
              }`}
            >
              <input type="radio" value="postpaid" {...register("paymentMethod")} />
              <span className="text-sm text-white">پرداخت اعتباری (پس‌پرداخت)</span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4 ${
                paymentMethod === "wallet"
                  ? "border-accent bg-cta-pill-bg"
                  : "border-border-input/40"
              }`}
            >
              <input type="radio" value="wallet" {...register("paymentMethod")} />
              <span className="text-sm text-white">پرداخت از کیف پول</span>
            </label>
          </div>
        </div>

        {paymentMethod === "wallet" ? (
          <SelectField
            label="حساب کیف پول"
            options={walletOptions}
            placeholder={walletLoading ? "در حال بارگذاری..." : "انتخاب حساب"}
            error={errors.walletAccountId?.message}
            {...register("walletAccountId")}
          />
        ) : null}

        <TextField label="نیازهای ویژه" {...register("specialNeeds")} />
        <TextField label="یادداشت مشتری" {...register("customerNotes")} />

        <Controller
          name="saveMainPassengerAsDefault"
          control={control}
          render={({ field }) => (
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-border-input px-4 py-3 text-sm text-white">
              <span>ذخیره مسافر اصلی به‌عنوان پیش‌فرض</span>
              <input
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                className="size-4 accent-accent"
              />
            </label>
          )}
        />

        <Controller
          name="agreeToTerms"
          control={control}
          render={({ field }) => (
            <label className="flex items-start justify-between gap-3 rounded-2xl border border-border-input px-4 py-3 text-sm text-white">
              <span>قوانین و شرایط رزرو را می‌پذیرم.</span>
              <input
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                className="mt-0.5 size-4 accent-accent"
              />
            </label>
          )}
        />
        {errors.agreeToTerms?.message ? (
          <p className="text-xs text-danger">{errors.agreeToTerms.message}</p>
        ) : null}

        {payError ? (
          <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
            {getFormErrorMessage(payError, "عملیات پرداخت ناموفق بود.")}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isPaying}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-accent font-extrabold text-black disabled:opacity-50"
          >
            {isPaying ? "در حال نهایی‌سازی..." : `پرداخت ${formatPrice(amount)} تومان`}
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

      <PriceSummaryCard
        draft={draft}
        isLoading={calculateCoupon.isPending || removeCouponMutation.isPending}
      />
    </div>
  );
}
