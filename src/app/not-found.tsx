import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Home2, SearchStatus } from "iconsax-react";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "صفحه یافت نشد | مهرآباد CIP lounge",
  description: "صفحه‌ای که به‌دنبال آن هستید وجود ندارد یا جابه‌جا شده است.",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/images/home/hero-glow-primary.png"
          alt=""
          fill
          className="object-cover opacity-25"
          priority
        />
        <Image
          src="/images/home/hero-glow-secondary.png"
          alt=""
          fill
          className="object-cover opacity-20"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-[72px]">
        <Header />

        <section
          className="mx-auto flex min-h-[calc(100vh-120px)] max-w-[720px] flex-col items-center justify-center py-16 text-center"
          dir="rtl"
          aria-labelledby="not-found-title"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cta-pill-bg sm:mb-8 sm:h-20 sm:w-20">
            <SearchStatus size={36} color="#c9ada7" variant="Bulk" aria-hidden />
          </div>

          <p
            className="font-extrabold tracking-[0.08em] text-accent"
            style={{ fontSize: "clamp(4.5rem, 18vw, 8rem)", lineHeight: 0.9 }}
            aria-hidden
          >
            ۴۰۴
          </p>

          <h1
            id="not-found-title"
            className="mt-4 text-2xl font-black text-white sm:mt-6 sm:text-3xl"
          >
            صفحه مورد نظر پیدا نشد
          </h1>

          <p className="mt-3 max-w-md text-sm leading-[1.808] text-text-secondary sm:text-base">
            آدرس واردشده وجود ندارد، حذف شده یا جابه‌جا شده است. می‌توانید به صفحه اصلی
            برگردید یا از منوی بالا مسیر درست را پیدا کنید.
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-accent px-6 font-extrabold text-black transition-opacity hover:opacity-90 sm:flex-none sm:min-w-[200px]"
            >
              <Home2 size={18} color="#000000" variant="Bold" aria-hidden />
              بازگشت به خانه
            </Link>
            <Link
              href="/profile"
              className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-border-input px-6 text-text-secondary transition-colors hover:bg-cta-pill-bg hover:text-accent sm:flex-none sm:min-w-[200px]"
            >
              پنل کاربری
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3 opacity-70">
            <Image
              src="/logo/logo-mark.svg"
              alt=""
              width={28}
              height={28}
              className="object-contain"
            />
            <Image
              src="/cip-lounge-text-header.svg"
              alt="Mehrabad CIP Lounge"
              width={104}
              height={24}
              className="h-4 w-auto"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
