"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "iconsax-react";
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
      <div className="mb-4 text-center sm:mb-5">
        <h2 className="text-xl font-bold tracking-[0.1px] text-white sm:text-2xl">
          سرویس های مازاد
        </h2>
        <p className="mt-1.5 text-xs text-text-secondary sm:text-sm">
          خدمات مکمل قابل رزرو همراه با این سرویس
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5">
        {items.map((item) => {
          const price = priceById.get(String(item.id));

          return (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border-input/20 bg-service-chip-bg transition-colors hover:border-accent/30"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-photo-card-bg">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 45vw, 220px"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(13,16,18,0) 40%, rgba(13,16,18,0.8) 100%)",
                  }}
                />
              </div>

              <div className="flex flex-1 flex-col gap-2 p-3">
                <h3 className="line-clamp-2 text-right text-sm font-bold leading-snug text-white">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                  <Clock size={14} color="#969696" variant="Linear" aria-hidden />
                  <span className="truncate">زمان استفاده: {item.durationLabel}</span>
                </div>

                {price ? (
                  <div className="flex items-end gap-1" dir="rtl">
                    <span className="pb-px text-[10px] text-text-price">قیمت از</span>
                    <span className="text-sm font-bold text-white">{price}</span>
                    <span className="pb-px text-[10px] text-text-price">ریال</span>
                  </div>
                ) : null}

                <Link
                  href={`/services/${item.id}`}
                  className="mt-auto inline-flex h-8 items-center justify-center gap-1 self-stretch rounded-lg bg-cta-pill-bg px-2 text-xs font-semibold text-accent transition-opacity hover:opacity-80"
                >
                  جزئیات
                  <ArrowLeft size={14} color="#c9ada7" variant="Linear" aria-hidden />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
