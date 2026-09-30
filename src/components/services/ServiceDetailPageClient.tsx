"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import ServiceDetailContainer from "@/components/services/ServiceDetailContainer";

function serviceIdFromPath(pathname: string | null): string | null {
  if (!pathname) return null;
  const segments = pathname.split("/").filter(Boolean);
  // /services/:id → ["services", ":id"]
  if (segments[0] !== "services" || !segments[1]) return null;
  return decodeURIComponent(segments[1]);
}

export default function ServiceDetailPageClient() {
  const pathname = usePathname();
  const id = serviceIdFromPath(pathname);

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-[72px]">
        <Header />
        {id ? (
          <ServiceDetailContainer id={id} />
        ) : (
          <p className="py-24 text-center text-white/70" dir="rtl">
            شناسه خدمت مشخص نیست.
          </p>
        )}
      </div>
    </div>
  );
}
