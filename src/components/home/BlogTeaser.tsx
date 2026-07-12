import { AddSquare } from "iconsax-react";

export default function BlogTeaser() {
  return (
    <div className="flex-1">
      {/* Heading with mixed font weights */}
      <h2 className="mb-4 sm:mb-6 text-2xl sm:text-[41px] leading-[1.453] text-white">
        <span>نکاتی که قبل از </span>
        <span className="font-extrabold">سفر های خارج</span>
        <span> از کشور بهتر است بدانید.</span>
      </h2>

      {/* Body copy */}
      <div className="mb-4 sm:mb-6 max-w-[526px] text-sm leading-[1.808] text-text-secondary">
        <p className="mb-3">
          علل سفر شامل تفریح، گردشگری، سفر تحقیقاتی، بازدید از نحوه زندگی مردم یک ناحیه، سفر
          داوطلبانه برای خیریه، مهاجرت برای زندگی در جایی دیگر، سفر برای مراقبت بهداشتی و سفرهای
          مأموریتی (سفر تجاری) است.
        </p>
        <p className="mb-2">انگیزه‌های سفر عبارتند از:</p>
        <ul className="list-disc pr-5">
          <li>لذت</li>
          <li>آرامش</li>
          <li>کشف و اکتشاف</li>
          <li>شناخت سایر فرهنگ‌ها و ملل</li>
          <li>و …</li>
        </ul>
      </div>

      {/* CTA button */}
      <button className="flex items-center gap-2 rounded-xl border border-accent px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-cta-pill-bg">
        <AddSquare size={16} color="#c9ada7" variant="Linear" />
        <span>ادامه مطلب</span>
      </button>
    </div>
  );
}
