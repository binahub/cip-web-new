import type { Metadata } from "next";
import ServiceDetailPageClient from "@/components/services/ServiceDetailPageClient";

export const metadata: Metadata = {
  title: "جزئیات خدمت | Mehrabad CIP Lounge",
  description: "جزئیات خدمات تشریفات فرودگاه مهرآباد",
};

/**
 * Static export only pre-renders `/services`.
 * Hard refresh on `/services/:id` is handled by nginx rewriting to this shell;
 * the client reads the id from the URL path.
 */
export function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export default function ServiceDetailPage() {
  return <ServiceDetailPageClient />;
}
