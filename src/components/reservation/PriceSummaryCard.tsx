"use client";

import { formatPrice } from "@/lib/format";
import type { ReservationDraft } from "@/services/reservation/reservation.types";

interface PriceSummaryCardProps {
  draft: ReservationDraft;
  /** When true, price rows show skeleton placeholders (live recalculation). */
  isLoading?: boolean;
}

export default function PriceSummaryCard({ draft, isLoading = false }: PriceSummaryCardProps) {
  const price = draft.priceBreakdown;

  return (
    <aside
      className="rounded-[24px] border border-border-input/30 bg-service-detail-card p-4 sm:p-5"
      dir="rtl"
      aria-busy={isLoading}
    >
      <h3 className="text-lg font-bold text-white">پیش‌فاکتور</h3>
      <p className="mt-1 text-xs text-text-secondary">
        شماره پیش‌نویس: <span dir="ltr">{draft.draftNumber}</span>
      </p>

      {isLoading ? (
        <PriceSummarySkeleton serviceRows={Math.max(draft.services.length, 1)} />
      ) : (
        <>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="مبلغ پایه" value={formatPrice(price.basePrice)} />
            <Row label="مالیات" value={formatPrice(price.taxAmount)} />
            <Row label="تخفیف" value={formatPrice(price.discountAmount)} />
            {price.couponCode ? <Row label="کد تخفیف" value={price.couponCode} /> : null}
            <div className="border-t border-border-input/20 pt-3">
              <Row label="مبلغ نهایی" value={formatPrice(price.finalAmount)} strong />
            </div>
          </div>

          {draft.services.length > 0 ? (
            <div className="mt-5 space-y-2 border-t border-border-input/20 pt-4">
              <p className="text-sm font-semibold text-white">خدمات</p>
              {draft.services.map((service, index) => (
                <div
                  key={`${service.mainServiceId}-${index}`}
                  className="flex items-start justify-between gap-3 text-xs text-text-secondary"
                >
                  <span>
                    {service.serviceName} × {service.quantity}
                  </span>
                  <span className="shrink-0 text-white">
                    {formatPrice(service.totalWithTax)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </aside>
  );
}

function PriceSummarySkeleton({ serviceRows }: { serviceRows: number }) {
  return (
    <div className="mt-4 space-y-3" aria-hidden="true">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <div className="border-t border-border-input/20 pt-3">
        <SkeletonRow wide />
      </div>
      <div className="mt-5 space-y-3 border-t border-border-input/20 pt-4">
        <div className="h-4 w-16 animate-pulse rounded-lg bg-white/10" />
        {Array.from({ length: serviceRows }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </div>
      <span className="sr-only">در حال به‌روزرسانی پیش‌فاکتور</span>
    </div>
  );
}

function SkeletonRow({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="h-3.5 w-20 animate-pulse rounded-md bg-white/10" />
      <div
        className={`h-3.5 animate-pulse rounded-md bg-white/10 ${wide ? "w-28" : "w-16"}`}
      />
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-text-secondary">{label}</span>
      <span className={strong ? "text-base font-extrabold text-accent" : "text-white"}>
        {value}
        {!strong ? null : (
          <span className="mr-1 text-xs font-normal text-text-secondary">تومان</span>
        )}
      </span>
    </div>
  );
}
