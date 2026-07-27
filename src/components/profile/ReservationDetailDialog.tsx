"use client";

import type { ReactNode } from "react";
import { CloseSquare } from "iconsax-react";
import AppDialog from "@/components/ui/AppDialog";
import Spinner from "@/components/ui/Spinner";
import { formatPrice } from "@/lib/format";
import { useCustomerReservationDetail } from "@/services/customer/customer.queries";
import type {
  CustomerReservationDetail,
  ReservationDetailPassenger,
  ReservationDetailPayment,
  ReservationDetailService,
} from "@/services/customer/customer.types";

interface ReservationDetailDialogProps {
  reservationNumber: string | null;
  onClose: () => void;
}

function hasDisplayValue(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

function genderLabel(gender: string | null | undefined) {
  if (!gender) return null;
  const normalized = gender.toUpperCase();
  if (normalized === "MALE" || normalized === "M") return "مرد";
  if (normalized === "FEMALE" || normalized === "F") return "زن";
  return gender;
}

function DetailRow({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string | number | null | undefined;
  ltr?: boolean;
}) {
  if (!hasDisplayValue(value)) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <dt className="shrink-0 text-text-secondary">{label}</dt>
      <dd
        className={`min-w-0 font-medium text-white ${ltr ? "text-left" : "text-right"}`}
        dir={ltr ? "ltr" : "rtl"}
      >
        {value}
      </dd>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border-input/25 bg-service-chip-bg/60 px-4 py-3">
      <h4 className="mb-1 text-sm font-bold text-accent">{title}</h4>
      <dl className="divide-y divide-border-input/15">{children}</dl>
    </section>
  );
}

function PassengerCard({ passenger }: { passenger: ReservationDetailPassenger }) {
  const name = `${passenger.firstName} ${passenger.lastName}`.trim();
  return (
    <div className="rounded-xl border border-border-input/20 bg-dropdown-bg/40 px-3 py-3">
      <p className="text-sm font-semibold text-white" dir="ltr">
        {name || "—"}
      </p>
      <dl className="mt-1 divide-y divide-border-input/10">
        <DetailRow label="کد ملی" value={passenger.nationalId} ltr />
        <DetailRow label="پاسپورت" value={passenger.passportNumber} ltr />
        <DetailRow label="تاریخ تولد" value={passenger.birthDate} ltr />
        <DetailRow label="جنسیت" value={genderLabel(passenger.gender)} />
        <DetailRow label="ملیت" value={passenger.nationalityName} />
        <DetailRow label="رده سنی" value={passenger.ageCategoryName} />
        {passenger.needsWheelchair ? (
          <DetailRow label="ویلچر" value="نیاز دارد" />
        ) : null}
        <DetailRow label="وعده غذایی خاص" value={passenger.specialMeal} />
        <DetailRow label="شرایط پزشکی" value={passenger.medicalConditions} />
        <DetailRow label="یادداشت" value={passenger.notes} />
      </dl>
    </div>
  );
}

function ServiceCard({ service }: { service: ReservationDetailService }) {
  return (
    <div className="rounded-xl border border-border-input/20 bg-dropdown-bg/40 px-3 py-3">
      <p className="text-sm font-semibold text-white">
        {service.mainServicePersianName || service.mainServiceName}
      </p>
      <dl className="mt-1 divide-y divide-border-input/10">
        <DetailRow label="تعداد" value={service.quantity} />
        <DetailRow label="قیمت واحد" value={`${formatPrice(service.unitPrice)} ریال`}  />
        <DetailRow label="مالیات" value={`${formatPrice(service.totalTax)} ریال`}  />
        <DetailRow
          label="مبلغ نهایی"
          value={`${formatPrice(service.finalAmount)} ریال`}
        />
      </dl>
    </div>
  );
}

function PaymentSection({ payment }: { payment: ReservationDetailPayment }) {
  return (
    <DetailSection title="پرداخت">
      <DetailRow
        label="نوع پرداخت"
        value={payment.paymentTypePersian || payment.paymentType}
      />
      <DetailRow label="وضعیت پرداخت" value={payment.paymentStatus} />
      <DetailRow
        label="مبلغ پرداخت"
        value={`${formatPrice(payment.paymentAmount)} ریال`}
      />
      <DetailRow label="زمان پرداخت" value={payment.paymentDatetime} ltr />
      {hasDisplayValue(payment.refundAmount) && Number(payment.refundAmount) > 0 ? (
        <DetailRow
          label="مبلغ استرداد"
          value={`${formatPrice(payment.refundAmount!)} ریال`}
        />
      ) : null}
      <DetailRow label="زمان استرداد" value={payment.refundDatetime} ltr />
      <DetailRow label="دلیل استرداد" value={payment.refundReason} />
    </DetailSection>
  );
}

function ReservationDetailContent({ detail }: { detail: CustomerReservationDetail }) {
  const statusLabel = detail.currentStatusPersian || detail.currentStatus;
  const paymentStatusLabel = detail.paymentStatusPersian || detail.paymentStatus;
  const airportLine = [detail.airportName, detail.airportIata]
    .filter(hasDisplayValue)
    .join(" · ");
  const destinationLine = [detail.destinationAirportName, detail.destinationAirportIata]
    .filter(hasDisplayValue)
    .join(" · ");
  const airlineLine = [detail.airlineName, detail.airlineIata]
    .filter(hasDisplayValue)
    .join(" · ");

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap items-center gap-2">
        {hasDisplayValue(statusLabel) ? (
          <span className="rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
            {statusLabel}
          </span>
        ) : null}
        {hasDisplayValue(paymentStatusLabel) ? (
          <span className="rounded-lg border border-border-input/40 bg-service-chip-bg px-2.5 py-1 text-xs font-semibold text-text-secondary">
            پرداخت: {paymentStatusLabel}
          </span>
        ) : null}
      </div>

      <DetailSection title="اطلاعات رزرو">
        <DetailRow label="شماره رزرو" value={detail.reservationNumber} ltr />
        <DetailRow label="منبع" value={detail.reservationSource} />
        <DetailRow label="خدمت اصلی" value={detail.primaryMainServiceName} />
        <DetailRow label="نوع سفر" value={detail.tripTypeName} />
        <DetailRow label="تاریخ ثبت" value={detail.createTime} ltr />
        <DetailRow label="آخرین به‌روزرسانی" value={detail.updateTime} ltr />
        <DetailRow label="نیازهای ویژه" value={detail.specialNeeds} />
        <DetailRow label="یادداشت مشتری" value={detail.customerNotes} />
        <DetailRow label="یادداشت داخلی" value={detail.internalNotes} />
        <DetailRow label="زمان ورود" value={detail.checkInTime} ltr />
        <DetailRow label="شروع خدمت" value={detail.serviceStartTime} ltr />
        <DetailRow label="پایان خدمت" value={detail.serviceEndTime} ltr />
        <DetailRow label="کد QR" value={detail.qrCode} ltr />
        <DetailRow label="بارکد" value={detail.barcode} ltr />
        <DetailRow label="اپراتور" value={detail.assignedOperatorName} />
      </DetailSection>

      <DetailSection title="پرواز">
        <DetailRow label="شماره پرواز" value={detail.flightNumber} ltr />
        <DetailRow label="تاریخ پرواز" value={detail.flightDate} ltr />
        <DetailRow label="فرودگاه" value={airportLine || null} />
        <DetailRow label="مقصد" value={destinationLine || null} />
        <DetailRow label="ایرلاین" value={airlineLine || null} />
        <DetailRow label="ترمینال" value={detail.terminal} />
        <DetailRow label="بزرگسال" value={detail.adultCount} />
        <DetailRow label="کودک" value={detail.childCount} />
        <DetailRow label="نوزاد" value={detail.infantCount} />
        <DetailRow label="چمدان" value={detail.luggageCount} />
      </DetailSection>

      <DetailSection title="مبالغ">
        <DetailRow label="مبلغ پایه" value={`${formatPrice(detail.totalPrice)} ریال`} />
        <DetailRow label="مالیات" value={`${formatPrice(detail.totalTax)} ریال`}  />
        {detail.discountAmount > 0 ? (
          <DetailRow
            label="تخفیف"
            value={`${formatPrice(detail.discountAmount)} ریال`}
            
          />
        ) : null}
        {detail.couponDiscountAmount > 0 ? (
          <DetailRow
            label="تخفیف کوپن"
            value={`${formatPrice(detail.couponDiscountAmount)} ریال`}
            
          />
        ) : null}
        {detail.manualDiscountAmount > 0 ? (
          <DetailRow
            label="تخفیف دستی"
            value={`${formatPrice(detail.manualDiscountAmount)} ریال`}
            
          />
        ) : null}
        <DetailRow label="کد تخفیف" value={detail.couponCode}  />
        <DetailRow
          label="مبلغ نهایی"
          value={`${formatPrice(detail.finalAmount)} ریال`}
          
        />
      </DetailSection>

      {detail.payment ? <PaymentSection payment={detail.payment} /> : null}

      {detail.passengers.length > 0 ? (
        <section className="space-y-2">
          <h4 className="text-sm font-bold text-accent">مسافران</h4>
          {detail.passengers.map((passenger) => (
            <PassengerCard key={passenger.id} passenger={passenger} />
          ))}
        </section>
      ) : null}

      {detail.services.length > 0 ? (
        <section className="space-y-2">
          <h4 className="text-sm font-bold text-accent">خدمات</h4>
          {detail.services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default function ReservationDetailDialog({
  reservationNumber,
  onClose,
}: ReservationDetailDialogProps) {
  const open = Boolean(reservationNumber);
  const { data, isPending, isFetching, error } = useCustomerReservationDetail(
    reservationNumber,
    open,
  );

  return (
    <AppDialog open={open} onClose={onClose} className="sm:max-w-2xl" aria-labelledby="reservation-detail-title">
      <div className="flex items-start justify-between gap-3 border-b border-border-input/20 px-5 py-4">
        <div className="min-w-0">
          <h3 id="reservation-detail-title" className="text-lg font-bold text-white">
            جزئیات رزرو
          </h3>
          {reservationNumber ? (
            <p className="mt-1 text-sm text-text-secondary" dir="ltr">
              {reservationNumber}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-border-input/40 p-2 text-text-secondary transition-colors hover:bg-cta-pill-bg hover:text-white"
          aria-label="بستن"
        >
          <CloseSquare size={20} color="currentColor" variant="Linear" />
        </button>
      </div>

      <div className="app-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {isPending || (isFetching && !data) ? (
          <Spinner className="py-16" />
        ) : error || !data ? (
          <p className="py-12 text-center text-sm text-white/70">
            امکان نمایش جزئیات رزرو وجود ندارد.
          </p>
        ) : (
          <ReservationDetailContent detail={data} />
        )}
      </div>
    </AppDialog>
  );
}
