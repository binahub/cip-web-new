"use client";

import AppDialog from "@/components/ui/AppDialog";

/** Placeholder terms until final legal copy is provided. */
const SAMPLE_TERMS = [
  "رزرو خدمات CIP صرفاً برای مسافرانی معتبر است که اطلاعات پرواز و مدارک هویتی آنان صحیح و کامل باشد.",
  "پس از ثبت نهایی رزرو، هرگونه تغییر در تعداد مسافر، زمان پرواز یا نوع خدمت ممکن است مشمول هزینه یا محدودیت زمانی شود.",
  "کنسلی رزرو مطابق قوانین اعلام‌شده در جزئیات هر خدمت انجام می‌شود؛ در بازه‌های نزدیک به پرواز ممکن است جریمه کنسلی اعمال گردد.",
  "حضور به‌موقع در سالن CIP و ارائه مدارک شناسایی و کارت پرواز الزامی است. تأخیر مسافر می‌تواند منجر به عدم امکان ارائه خدمت شود.",
  "قیمت‌های نمایش‌داده‌شده بر اساس نرخ جاری محاسبه شده و در صورت اعمال مالیات، عوارض یا کد تخفیف، مبلغ نهایی در پیش‌فاکتور مشخص می‌شود.",
  "پرداخت از کیف پول یا به‌صورت اعتباری تابع موجودی/سقف اعتبار حساب کاربری شماست. در صورت ناموفق بودن پرداخت، رزرو نهایی نخواهد شد.",
  "اطلاعات شخصی مسافران صرفاً برای ارائه خدمات رزرو و الزامات فرودگاهی استفاده می‌شود و مطابق سیاست حریم خصوصی مجموعه نگهداری می‌گردد.",
  "با تأیید این قوانین، شما اعلام می‌کنید که متن را مطالعه کرده و شرایط رزرو خدمات CIP مهرآباد را می‌پذیرید.",
] as const;

interface TermsAgreementDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function TermsAgreementDialog({
  open,
  onClose,
  onConfirm,
}: TermsAgreementDialogProps) {
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      aria-labelledby="terms-dialog-title"
      className="sm:max-w-xl"
    >
      <div className="flex min-h-0 flex-1 flex-col" dir="rtl">
        <div className="shrink-0 border-b border-border-input/30 px-5 py-4">
          <h3 id="terms-dialog-title" className="text-lg font-bold text-white">
            قوانین و شرایط رزرو
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            لطفاً متن زیر را مطالعه کنید و در صورت پذیرش، تأیید نمایید.
          </p>
        </div>

        <div className="app-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          <ol className="list-decimal space-y-3 pr-5 text-sm leading-7 text-text-secondary">
            {SAMPLE_TERMS.map((item) => (
              <li key={item} className="text-right">
                {item}
              </li>
            ))}
          </ol>
        </div>

        <div className="shrink-0 border-t border-border-input/30 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onConfirm}
              className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-accent font-extrabold text-black transition-opacity hover:opacity-90"
            >
              مطالعه کردم و می‌پذیرم
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-border-input text-text-secondary transition-colors hover:bg-cta-pill-bg"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </AppDialog>
  );
}
