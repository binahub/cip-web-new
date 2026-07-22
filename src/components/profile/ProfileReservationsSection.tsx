"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileSectionCard from "@/components/profile/ProfileSectionCard";
import DataTable, { type DataTableColumn } from "@/components/ui/DataTable";
import TextField from "@/components/ui/TextField";
import { getFormErrorMessage } from "@/components/auth/auth-form-utils";
import { formatDateFa, formatPrice } from "@/lib/format";
import { toastSuccess } from "@/lib/toast";
import {
  cancelReservationSchema,
  type CancelReservationFormValues,
} from "@/schemas/customer";
import {
  useCancelReservation,
  useCustomerReservations,
} from "@/services/customer/customer.queries";
import type { CustomerReservation } from "@/services/customer/customer.types";

export default function ProfileReservationsSection() {
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState<CustomerReservation | null>(null);
  const { data, isPending, error } = useCustomerReservations(page, 20);
  const cancelMutation = useCancelReservation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelReservationFormValues>({
    resolver: zodResolver(cancelReservationSchema),
    defaultValues: { reservationNumber: "", cancelReason: "" },
  });

  function openCancel(row: CustomerReservation) {
    setCancelTarget(row);
    reset({
      reservationNumber: row.reservationNumber,
      cancelReason: "",
    });
  }

  const onCancel = handleSubmit(async (values) => {
    await cancelMutation.mutateAsync(values);
    toastSuccess("رزرو با موفقیت لغو شد.");
    setCancelTarget(null);
  });

  const columns: DataTableColumn<CustomerReservation>[] = [
    {
      key: "reservationNumber",
      header: "شماره رزرو",
      render: (row) => <span dir="ltr">{row.reservationNumber}</span>,
    },
    {
      key: "flightNumber",
      header: "شماره پرواز",
      render: (row) => <span dir="ltr">{row.flightNumber}</span>,
    },
    {
      key: "flightDate",
      header: "تاریخ پرواز",
      render: (row) => formatDateFa(row.flightDate),
    },
    {
      key: "currentStatus",
      header: "وضعیت",
      render: (row) => row.currentStatus,
    },
    {
      key: "paymentStatus",
      header: "پرداخت",
      render: (row) => row.paymentStatus,
    },
    {
      key: "finalAmount",
      header: "مبلغ",
      render: (row) => formatPrice(row.finalAmount),
    },
    {
      key: "actions",
      header: "عملیات",
      render: (row) => (
        <button
          type="button"
          onClick={() => openCancel(row)}
          className="rounded-lg border border-danger/50 px-3 py-1.5 text-xs text-danger transition-opacity hover:bg-danger/10"
        >
          لغو
        </button>
      ),
    },
  ];

  return (
    <ProfileSectionCard title="رزروها" description="لیست رزروهای شما">
      {error ? (
        <p className="py-8 text-center text-white/70">امکان نمایش رزروها وجود ندارد.</p>
      ) : (
        <DataTable
          columns={columns}
          rows={data?.list ?? []}
          rowKey={(row) => row.id}
          isLoading={isPending}
          page={data?.number ?? page}
          totalPages={data?.totalPages ?? 0}
          minPage={1}
          onPageChange={setPage}
        />
      )}

      {cancelTarget ? (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="بستن"
            onClick={() => setCancelTarget(null)}
          />
          <form
            onSubmit={onCancel}
            className="relative z-10 w-full max-w-md rounded-3xl border border-border-input/40 bg-dropdown-bg p-5"
            dir="rtl"
            noValidate
          >
            <h3 className="text-lg font-bold text-white">لغو رزرو</h3>
            <p className="mt-1 text-sm text-text-secondary">
              رزرو <span dir="ltr">{cancelTarget.reservationNumber}</span> را لغو می‌کنید.
            </p>
            <div className="mt-4 space-y-4">
              <input type="hidden" {...register("reservationNumber")} />
              <TextField
                label="دلیل لغو"
                error={errors.cancelReason?.message}
                {...register("cancelReason")}
              />
              {cancelMutation.isError ? (
                <p className="text-sm text-danger">
                  {getFormErrorMessage(cancelMutation.error, "لغو رزرو ناموفق بود.")}
                </p>
              ) : null}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={cancelMutation.isPending}
                  className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-accent font-extrabold text-black disabled:opacity-50"
                >
                  {cancelMutation.isPending ? "در حال لغو..." : "تایید لغو"}
                </button>
                <button
                  type="button"
                  onClick={() => setCancelTarget(null)}
                  className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-border-input text-text-secondary"
                >
                  انصراف
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </ProfileSectionCard>
  );
}
