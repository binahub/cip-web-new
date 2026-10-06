"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import ServiceDetailContainer from "@/components/services/ServiceDetailContainer";

function resolveServiceId(searchParams: ReturnType<typeof useSearchParams>): string | null {
  const fromQuery = searchParams.get("id")?.trim();
  if (fromQuery) return fromQuery;

  // Fallback when nginx rewrites /services/:id/ → /services/index.html
  // without changing the browser URL (legacy deploy). Prefer ?id= going forward.
  if (typeof window !== "undefined") {
    const segments = window.location.pathname.split("/").filter(Boolean);
    if (segments[0] === "services" && segments[1]) {
      return decodeURIComponent(segments[1]);
    }
  }

  return null;
}

export default function ServiceDetailPageClient() {
  const searchParams = useSearchParams();
  const id = resolveServiceId(searchParams);

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
