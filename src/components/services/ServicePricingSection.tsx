import ServicePricingCard from "./ServicePricingCard";
import type { ServiceDetailPriceCardView } from "@/services/main-services/main-services.types";

interface ServicePricingSectionProps {
  mainServiceId: string;
  isMainService: boolean;
  iranian: ServiceDetailPriceCardView[];
  foreign: ServiceDetailPriceCardView[];
}

function adultCardsOnly(cards: ServiceDetailPriceCardView[]) {
  return cards.filter((card) => card.ageCategoryValue === "Adult");
}

function NationalityColumn({
  heading,
  cards,
  mainServiceId,
  isMainService,
}: {
  heading: string;
  cards: ServiceDetailPriceCardView[];
  mainServiceId: string;
  isMainService: boolean;
}) {
  if (cards.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-center text-lg font-bold text-white">{heading}</h3>
      {cards.map((card) => (
        <ServicePricingCard
          key={card.id}
          tier={card}
          mainServiceId={mainServiceId}
          showStartOrder={isMainService}
        />
      ))}
    </div>
  );
}

export default function ServicePricingSection({
  mainServiceId,
  isMainService,
  iranian,
  foreign,
}: ServicePricingSectionProps) {
  const adultIranian = adultCardsOnly(iranian);
  const adultForeign = adultCardsOnly(foreign);

  if (adultIranian.length === 0 && adultForeign.length === 0) return null;

  return (
    <section className="w-full">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-[0.1px] text-white">
        قیمت گذاری
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2" dir="ltr">
        <NationalityColumn
          heading="مسافران ایرانی"
          cards={adultIranian}
          mainServiceId={mainServiceId}
          isMainService={isMainService}
        />
        <NationalityColumn
          heading="مسافران غیر ایرانی"
          cards={adultForeign}
          mainServiceId={mainServiceId}
          isMainService={isMainService}
        />
      </div>
    </section>
  );
}
