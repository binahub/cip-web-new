import ServicePricingCard from "./ServicePricingCard";
import type { ServicePricingTier } from "@/data/services";

interface ServicePricingSectionProps {
  iranian: ServicePricingTier;
  foreign: ServicePricingTier;
}

export default function ServicePricingSection({
  iranian,
  foreign,
}: ServicePricingSectionProps) {
  return (
    <section className="w-full">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-[0.1px] text-white">
        قیمت گذاری
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" dir="ltr">
        <ServicePricingCard tier={iranian} />
        <ServicePricingCard tier={foreign} />
      </div>
    </section>
  );
}
