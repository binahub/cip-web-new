"use client";

import { useMemo } from "react";
import ServiceCard from "@/components/home/ServiceCard";
import { useActiveMainServices } from "@/services/main-services/main-services.queries";
import type { ServiceDetailRelatedServiceView } from "@/services/main-services/main-services.types";

interface ServiceRelatedServicesProps {
  items: ServiceDetailRelatedServiceView[];
}

export default function ServiceRelatedServices({ items }: ServiceRelatedServicesProps) {
  const { data: summaryCards = [] } = useActiveMainServices();

  const priceById = useMemo(() => {
    const map = new Map<string, string>();
    for (const card of summaryCards) {
      map.set(String(card.id), card.price);
    }
    return map;
  }, [summaryCards]);

  if (items.length === 0) return null;

  return (
    <section className="w-full" dir="rtl">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="text-xl font-bold tracking-[0.1px] text-white sm:text-2xl">
          سرویس های مازاد
        </h2>
        <p className="mt-1.5 text-xs text-text-secondary sm:text-sm">
          خدمات مکمل قابل رزرو همراه با این سرویس
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <ServiceCard
            key={item.id}
            id={item.id}
            title={item.title}
            price={priceById.get(String(item.id)) ?? "—"}
            imageUrl={item.imageUrl}
            durationLabel={item.durationLabel}
            isMainService={false}
          />
        ))}
      </div>
    </section>
  );
}
