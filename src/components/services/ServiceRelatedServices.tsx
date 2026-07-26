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
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-[0.1px] text-white">سرویس های مازاد</h2>
        <p className="mt-2 text-sm text-text-secondary">
          خدمات مکمل قابل رزرو همراه با این سرویس
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const price = priceById.get(String(item.id));

          return (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border-input/20 bg-service-chip-bg transition-colors hover:border-accent/30"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-photo-card-bg">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, 360px"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(13,16,18,0) 45%, rgba(13,16,18,0.75) 100%)",
                  }}
                />
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                <h3 className="text-right text-base font-bold leading-snug text-white sm:text-lg">
                  {item.title}
                </h3>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <Clock size={16} color="#969696" variant="Linear" aria-hidden />
                    <span>زمان استفاده: {item.durationLabel}</span>
                  </div>

                  {price ? (
                    <div className="flex items-end gap-1" dir="rtl">
                      <span className="pb-0.5 text-xs text-text-price">قیمت از</span>
                      <span className="text-base font-bold text-white">{price}</span>
                      <span className="pb-0.5 text-xs text-text-price">ریال</span>
                    </div>
                  ) : null}
                </div>

                <Link
                  href={`/services/${item.id}`}
                  className="mt-auto inline-flex h-10 items-center justify-center gap-1 self-stretch rounded-xl bg-cta-pill-bg px-3 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
                >
                  مشاهده جزئیات
                  <ArrowLeft size={18} color="#c9ada7" variant="Linear" aria-hidden />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
