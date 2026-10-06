import type { Metadata } from "next";
import { Suspense } from "react";
import ServiceDetailPageClient from "@/components/services/ServiceDetailPageClient";

export const metadata: Metadata = {
  title: "جزئیات خدمت | Mehrabad CIP Lounge",
  description: "جزئیات خدمات تشریفات فرودگاه مهرآباد",
};

/**
 * Static export cannot pre-render unknown `/services/:id` paths.
 * Use `/services/?id=:id` (and nginx 302 from `/services/:id/` for old/pretty URLs).
 */
export default function ServiceDetailPage() {
  return (
    <Suspense
      fallback={
        <p className="py-24 text-center text-white/70" dir="rtl">
          در حال بارگذاری…
        </p>
      }
    >
      <ServiceDetailPageClient />
    </Suspense>
  );
}
