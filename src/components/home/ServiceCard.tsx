import Image from "next/image";
import { Crown1, Diamonds, ArrowLeft } from "iconsax-react";
import Badge from "@/components/ui/Badge";

interface ServiceCardData {
  title: string;
  price: string;
  imageUrl: string;
}

export default function ServiceCard({ title, price, imageUrl }: ServiceCardData) {
  return (
    <div className="group relative flex h-[320px] sm:h-[405px] w-full flex-col overflow-hidden rounded-3xl bg-photo-card-bg">
      {/* Top section: title, badges, price, CTA — in that order */}
      <div className="relative z-10 flex flex-1 flex-col items-center p-4 sm:p-6 pt-6 sm:pt-8">
        {/* Title */}
        <h3 className="mb-3 text-lg sm:text-2xl font-bold text-white text-center">{title}</h3>

        {/* Badges */}
        <div className="mb-3 flex gap-2">
          <Badge
            icon={<Crown1 size={12} color="white" variant="Bold" />}
            label="VIP Services"
            className="font-['Inter']"
          />
          <Badge
            icon={<Diamonds size={12} color="white" variant="Bold" />}
            label="CIP Services"
            className="font-['Inter']"
          />
        </div>

        {/* Price row */}
        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-[10px] sm:text-xs text-text-price">تومان</span>
          <span className="text-lg sm:text-xl font-bold text-white">{price}</span>
          <span className="text-[10px] sm:text-xs text-text-price">قیمت از</span>
        </div>

        {/* CTA button */}
        <button className="flex h-[32px] w-[132px] items-center justify-center gap-2 rounded-lg bg-cta-pill-bg px-2 py-1 transition-colors hover:opacity-80">
          <ArrowLeft size={20} color="#c9ada7" variant="Linear" />
          <span className="px-1 text-xs font-normal leading-[22px] text-accent">مشاهده جزئیات</span>
        </button>
      </div>

      {/* Bottom photo band */}
      <div className="absolute bottom-0 left-0 right-0 h-[160px] sm:h-[225px]">
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, transparent 4.5%, rgba(13,16,18,0.59) 40%, #0d1012 88%)",
          }}
        />
        <Image src={imageUrl} alt={title} fill className="object-cover object-top" />
      </div>
    </div>
  );
}
