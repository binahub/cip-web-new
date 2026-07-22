import ServicePricingCard from "./ServicePricingCard";
import type { ServiceDetailPriceCardView } from "@/services/main-services/main-services.types";

interface ServicePricingSectionProps {
  mainServiceId: string;
  iranian: ServiceDetailPriceCardView[];
  foreign: ServiceDetailPriceCardView[];
}

function NationalityColumn({
  heading,
  cards,
  mainServiceId,
}: {
  heading: string;
  cards: ServiceDetailPriceCardView[];
  mainServiceId: string;
}) {
  if (cards.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-center text-lg font-bold text-white">{heading}</h3>
      {cards.map((card) => (
        <ServicePricingCard key={card.id} tier={card} mainServiceId={mainServiceId} />
      ))}
    </div>
  );
}

export default function ServicePricingSection({
  mainServiceId,
  iranian,
  foreign,
}: ServicePricingSectionProps) {
  if (iranian.length === 0 && foreign.length === 0) return null;

  return (
    <section className="w-full">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-[0.1px] text-white">
        قیمت گذاری
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2" dir="ltr">
        <NationalityColumn
          heading="مسافران ایرانی"
          cards={iranian}
          mainServiceId={mainServiceId}
        />
        <NationalityColumn
          heading="مسافران غیر ایرانی"
          cards={foreign}
          mainServiceId={mainServiceId}
        />
      </div>
    </section>
  );
}
