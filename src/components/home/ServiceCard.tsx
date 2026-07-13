import Image from "next/image";
import { ArrowLeft } from "iconsax-react";
import Badge from "@/components/ui/Badge";

interface ServiceCardData {
  title: string;
  price: string;
  imageUrl: string;
  imagePosition?: string;
}

export default function ServiceCard({
  title,
  price,
  imageUrl,
  imagePosition = "50% 30%",
}: ServiceCardData) {
  return (
    <div className="relative h-[405px] w-full overflow-hidden rounded-[24px] bg-photo-card-bg">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[160px] sm:h-[205px] overflow-hidden">
        {/* Photo — dynamic, will come from the booking API later. object-position
            approximates Figma's crop bias (source photo is cropped higher than
            center); tune per-image via the `imagePosition` prop once real photos
            are in and you can eyeball each one. */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          style={{ objectPosition: imagePosition }}
          sizes="416px"
        />

        {/* Gradient fade — always a CSS layer on top of the photo, independent of
            image source. Matches Figma's actual fade curve: no darkening for the
            top ~29% of the band, then ramping to near-black by the bottom. */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,16,18,0) 0%, rgba(13,16,18,0) 15%, rgba(13,16,18,0.59) 55%, rgba(13,16,18,0.93) 100%)",
          }}
        />
      </div>

      {/* Content — Figma absolute Y positions */}
      <h3 className="absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap text-center text-2xl font-bold leading-normal text-white">
        {title}
      </h3>

      <div className="absolute left-1/2 top-[81px] flex -translate-x-1/2 flex-row-reverse gap-2.5">
        <Badge
          icon={<Image src="/icons/crown.svg" alt="" width={18} height={18} />}
          label="VIP Services"
          className="font-inter"
        />
        <Badge
          icon={<Image src="/icons/diamond.svg" alt="" width={18} height={18} />}
          label="CIP Services"
          className="font-inter"
        />
      </div>

      <div
        className="absolute left-1/2 top-[113px] z-10 flex -translate-x-1/2 items-end gap-2"
        dir="rtl"
      >
        <span className="pb-[9px] text-xs leading-[1.808] text-text-price">قیمت از</span>
        <span className="text-xl font-bold leading-[1.808] text-white">{price}</span>
        <span className="pb-[9px] text-xs leading-[1.808] text-text-price">تومان</span>
      </div>

      <button className="absolute left-1/2 top-[161px] z-10 flex h-8 -translate-x-1/2 items-center justify-center rounded-lg bg-cta-pill-bg px-2 py-1 transition-colors hover:opacity-80">
        <span className="px-2 text-xs font-normal leading-[22px] text-accent">مشاهده جزئیات</span>
        <ArrowLeft size={20} color="#c9ada7" variant="Linear" />
      </button>
    </div>
  );
}
