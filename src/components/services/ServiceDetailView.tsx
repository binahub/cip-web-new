import ServiceImageSlider from "./ServiceImageSlider";
import ServiceDescription from "./ServiceDescription";
import ServiceFeatures from "./ServiceFeatures";
import ServicePricingSection from "./ServicePricingSection";
import ServiceRules from "./ServiceRules";
import type { ServiceDetailViewModel } from "@/services/main-services/main-services.types";

interface ServiceDetailViewProps {
  service: ServiceDetailViewModel;
}

export default function ServiceDetailView({ service }: ServiceDetailViewProps) {
  return (
    <div className="relative overflow-x-hidden pb-8 pt-8 sm:pt-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[min(100vw,1200px)] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(80,70,65,0.35) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[856px] overflow-hidden rounded-[24px] bg-service-detail-card px-3 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10 lg:px-10">
        <div className="mx-auto flex w-full max-w-[776px] flex-col gap-8 sm:gap-12">
          <ServiceImageSlider images={service.images} alt={service.name} />

          <ServiceDescription aboutTitle={service.aboutTitle} extraInfo={service.extraInfo} />

          <ServiceFeatures address={service.address} features={service.features} />

          <ServicePricingSection
            iranian={service.pricing.iranian}
            foreign={service.pricing.foreign}
          />

          <ServiceRules title={service.rulesTitle} rules={service.rules} />
        </div>
      </div>
    </div>
  );
}
