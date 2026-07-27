import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "iconsax-react";
import Badge from "@/components/ui/Badge";

interface ServiceCardData {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  imagePosition?: string;
  isMainService?: boolean;
  durationLabel?: string;
  /** Compact layout for related/extra services only. */
  size?: "default" | "compact";
}

export default function ServiceCard({
  id,
  title,
  price,
  imageUrl,
  imagePosition = "0% 110%",
  isMainService = false,
  durationLabel,
  size = "default",
}: ServiceCardData) {
  const compact = size === "compact";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[24px] bg-photo-card-bg ${
        compact ? "h-[320px] rounded-[20px]" : "h-[405px]"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden ${
          compact ? "h-[130px] sm:h-[150px]" : "h-[160px] sm:h-[205px]"
        }`}
      >
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
          sizes={compact ? "280px" : "416px"}
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

      {/* Content stack — flows with title height so badges never collide on wrap */}
      <div
        className={`relative z-5 flex flex-col items-center px-3 sm:px-4 ${
          compact ? "gap-2 pt-5" : "gap-3 pt-8"
        }`}
      >
        <h3
          className={`w-full text-center font-bold leading-snug text-white ${
            compact
              ? "text-base sm:text-lg sm:leading-snug"
              : "text-xl sm:text-2xl sm:leading-normal"
          }`}
        >
          {title}
        </h3>

        {isMainService && (
          <div className="flex max-w-full flex-row-reverse flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
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
        )}

        {durationLabel ? (
          <p
            className={`text-center text-text-secondary ${
              compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"
            }`}
          >
            زمان استفاده: {durationLabel}
          </p>
        ) : null}

        <div className={`flex items-end ${compact ? "gap-1.5" : "gap-2"}`} dir="rtl">
          <span
            className={`leading-[1.808] text-text-price ${
              compact ? "pb-1.5 text-[10px]" : "pb-[9px] text-xs"
            }`}
          >
            قیمت از
          </span>
          <span
            className={`font-bold leading-[1.808] text-white ${
              compact ? "text-base sm:text-lg" : "text-xl"
            }`}
          >
            {price}
          </span>
          <span
            className={`leading-[1.808] text-text-price ${
              compact ? "pb-1.5 text-[10px]" : "pb-[9px] text-xs"
            }`}
          >
            ریال
          </span>
        </div>

        <Link
          href={`/services/${id}`}
          className={`flex items-center justify-center rounded-lg bg-cta-pill-bg px-2 py-1 transition-colors hover:opacity-80 ${
            compact ? "h-7" : "h-8"
          }`}
        >
          <span
            className={`px-2 font-normal text-accent ${
              compact ? "text-[11px] leading-5" : "text-xs leading-[22px]"
            }`}
          >
            مشاهده جزئیات
          </span>
          <ArrowLeft size={compact ? 16 : 20} color="#C9A063" variant="Linear" />
        </Link>
      </div>
    </div>
  );
}
