"use client";

import { formatPrice } from "@/lib/format";
import type { ActiveMainServiceSummaryItem } from "@/services/main-services/main-services.types";

interface ServicePickCardsProps {
  items: ActiveMainServiceSummaryItem[];
  value: string;
  onChange: (serviceId: string) => void;
  isLoading?: boolean;
  error?: string;
}

function resolveCardImage(item: ActiveMainServiceSummaryItem): string {
  const image = item.mainImage;
  if (image?.isMainImage && image.cdnImage) return image.cdnImage;
  return "/images/home/service-vip-services.svg";
}

export default function ServicePickCards({
  items,
  value,
  onChange,
  isLoading,
  error,
}: ServicePickCardsProps) {
  if (isLoading) {
    return <p className="text-sm text-text-secondary">در حال بارگذاری خدمات...</p>;
  }

  if (items.length === 0) {
    return <p className="text-sm text-text-secondary">خدمت اصلی فعالی یافت نشد.</p>;
  }

  return (
    <div className="flex flex-col gap-2" dir="rtl">
      <p className="text-sm font-medium text-text-secondary">انتخاب خدمت اصلی</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const id = String(item.mainService.id);
          const selected = String(value) === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`overflow-hidden rounded-2xl border text-right transition-colors ${
                selected
                  ? "border-accent bg-cta-pill-bg"
                  : "border-border-input/40 bg-service-chip-bg hover:border-accent/40"
              }`}
            >
              <div className="relative h-28 w-full bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveCardImage(item)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1 px-3 py-3">
                <p className="text-sm font-bold text-white">{item.mainService.name}</p>
                <p className="text-xs text-text-secondary">
                  از {formatPrice(item.minPrice.price)} ريال
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
