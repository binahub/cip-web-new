import Button from "@/components/ui/Button";
import type { ServiceDetailPriceCardView } from "@/services/main-services/main-services.types";

interface ServicePricingCardProps {
  tier: ServiceDetailPriceCardView;
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-12 w-full items-center gap-3" dir="rtl">
      <span className="shrink-0 text-sm font-normal tracking-[0.1px] text-[#535353]">
        {label}
      </span>
      <div
        className="h-px min-w-0 flex-1 border-t border-dotted border-[#535353]/60"
        aria-hidden="true"
      />
      <span className="shrink-0 text-sm font-bold tracking-[0.1px] text-white">{value}</span>
    </div>
  );
}

export default function ServicePricingCard({ tier }: ServicePricingCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-service-chip-bg px-4 pb-8 pt-[160px] sm:px-8 sm:pt-[185px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[174px] overflow-hidden rounded-t-2xl">
        <div className="absolute inset-x-0 top-[13px] flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tier.mapImage}
            alt=""
            className="h-[155px] w-auto max-w-[90%] object-contain object-top opacity-90"
          />
        </div>
        <div className="absolute inset-x-px bottom-0 h-[102px] bg-gradient-to-b from-transparent to-service-chip-bg" />
      </div>

      <div className="relative z-10 flex flex-col items-end gap-4" dir="rtl">
        <h3 className="w-full text-right text-base font-bold tracking-[0.1px] text-white">
          {tier.title}
        </h3>
        <p className="w-full text-right text-sm tracking-[0.1px] text-[#535353]">
          {tier.subtitle}
        </p>

        <p className="w-full text-right tracking-[0.1px]" dir="rtl">
          <span className="text-[32px] font-extrabold leading-normal text-white">
            {tier.totalPrice}
          </span>
          <span className="mr-1 text-sm font-normal text-[#535353]">{tier.currency}</span>
        </p>

        <p className="w-full text-right text-sm tracking-[0.1px] text-[#535353]">{tier.note}</p>

        <Button
          variant="accent-outline"
          className="h-12 w-full rounded-lg border-[1.5px] text-base font-medium"
        >
          {tier.ctaLabel}
        </Button>

        <div className="mt-2 w-full">
          {tier.breakdown.map((row) => (
            <BreakdownRow key={row.label} label={row.label} value={row.value} />
          ))}
        </div>
      </div>
    </div>
  );
}
