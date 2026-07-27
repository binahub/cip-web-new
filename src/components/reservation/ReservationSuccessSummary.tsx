import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { FinalizedReservation } from "@/services/reservation/reservation.types";

interface ReservationSuccessSummaryProps {
  reservation: FinalizedReservation;
}

export default function ReservationSuccessSummary({
  reservation,
}: ReservationSuccessSummaryProps) {
  const rows: { label: string; value: string; ltr?: boolean }[] = [
    {
      label: "شماره رزرو",
      value: reservation.reservationNumber,
      ltr: true,
    },
    {
      label: "تاریخ پرواز",
      value: reservation.flightDate,
      ltr: true,
    },
    {
      label: "شماره پرواز",
      value: reservation.flightNumber,
      ltr: true,
    },
    {
      label: "وضعیت رزرو",
      value:
        reservation.currentStatusObject?.description || reservation.currentStatus,
    },
    {
      label: "وضعیت پرداخت",
      value:
        reservation.paymentStatusObject?.description || reservation.paymentStatus,
    },
    {
      label: "تاریخ ثبت",
      value: reservation.createTime,
      ltr: true,
    },
  ];

  return (
    <div
      className="mx-auto max-w-md overflow-hidden rounded-[24px] border border-accent/35 bg-service-detail-card"
      dir="rtl"
    >
      <div className="border-b border-border-input/20 px-6 py-6 text-center sm:px-8">
        <p className="text-sm font-medium text-accent">رزرو با موفقیت ثبت شد</p>
        <p className="mt-2 text-sm text-text-secondary">
          خلاصه سفارش شما آماده است. جزئیات را ذخیره یا از پروفایل پیگیری کنید.
        </p>
      </div>

      <dl className="divide-y divide-border-input/15 px-6 sm:px-8">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 py-3.5 text-sm"
          >
            <dt className="shrink-0 text-text-secondary">{row.label}</dt>
            <dd
              className={`min-w-0 text-left font-medium text-white ${row.ltr ? "" : "text-right"}`}
              dir={row.ltr ? "ltr" : "rtl"}
            >
              {row.value || "—"}
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-border-input/20 bg-white/[0.03] px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-text-secondary">مبلغ نهایی</span>
          <span className="font-extrabold text-accent" dir="ltr">
            {formatPrice(reservation.finalAmount)}{" "}
            <span className="text-xs font-medium text-text-secondary">ریال</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:justify-center sm:px-8">
        <Link
          href="/profile?tab=reservations"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-accent px-6 font-extrabold text-black sm:flex-none"
        >
          مشاهده رزروها
        </Link>
        <Link
          href="/"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-border-input px-6 text-text-secondary transition-colors hover:border-white/30 hover:text-white sm:flex-none"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
