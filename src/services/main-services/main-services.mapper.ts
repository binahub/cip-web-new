import { formatPrice } from "@/lib/format";
import type {
  MainServiceDetailData,
  MinPrice,
  ServiceDetailPriceCardView,
  ServiceDetailViewModel,
} from "./main-services.types";

const FALLBACK_FACILITY_ICON = "/icons/features/hospitality.svg";
const IRAN_MAP = "/images/services/iran-map.svg";
const WORLD_MAP = "/images/services/world-map.svg";

const AGE_ORDER = ["Adult", "Child", "Infant"] as const;

function ageSortIndex(value: string): number {
  const index = AGE_ORDER.indexOf(value as (typeof AGE_ORDER)[number]);
  return index === -1 ? AGE_ORDER.length : index;
}

function formatTaxRate(taxRate: string): string {
  const amount = Number(taxRate);
  if (Number.isNaN(amount)) return taxRate;
  return `${formatPrice(amount)} درصد`;
}

function mapPriceCard(
  item: MinPrice,
  nationalityTitle: string,
  mapImage: string,
): ServiceDetailPriceCardView {
  const ageLabel = item.ageCategoryObject.description;
  const priceNumber = Number(item.price);
  const isFree = !Number.isNaN(priceNumber) && priceNumber === 0;

  return {
    id: item.id,
    title: ageLabel,
    subtitle: `قیمت خدمات برای ${nationalityTitle} — ${ageLabel}`,
    totalPrice: formatPrice(item.price),
    currency: "ریال",
    note: isFree ? "هزینه این رده سنی رایگان می‌باشد" : item.customerLevelDescription,
    mapImage,
    ctaLabel: "شروع سفارش",
    breakdown: [
      { label: "رده سنی", value: ageLabel },
      { label: "ملیت", value: item.nationalityObject.description },
      { label: "نرخ پایه", value: `${formatPrice(item.price)} ریال` },
      { label: "مالیات", value: formatTaxRate(item.taxRate) },
    ],
  };
}

function mapNationalityPrices(
  priceList: MinPrice[],
  nationalityValue: "PERSIAN" | "NON_PERSIAN",
  nationalityTitle: string,
  mapImage: string,
): ServiceDetailPriceCardView[] {
  return priceList
    .filter((item) => item.nationalityObject.value === nationalityValue)
    .sort(
      (a, b) =>
        ageSortIndex(a.ageCategoryObject.value) - ageSortIndex(b.ageCategoryObject.value),
    )
    .map((item) => mapPriceCard(item, nationalityTitle, mapImage));
}

export function mapMainServiceDetail(data: MainServiceDetailData): ServiceDetailViewModel {
  const { mainService } = data;

  const sliderImages = data.imageList
    .filter((image) => !image.isMainImage)
    .map((image) => image.cdnImage || image.localImage)
    .filter(Boolean);

  const extraInfo = [...data.extraInfoList]
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      id: item.id,
      title: item.name,
      content: item.description,
    }));

  const features = data.facilityList.map((facility) => ({
    id: facility.id,
    label: facility.facilityName,
    icon: facility.cdnIcon || facility.localIcon || FALLBACK_FACILITY_ICON,
  }));

  const rules = [...data.ruleList]
    .sort((a, b) => a.order - b.order)
    .map((rule) => rule.description);

  return {
    id: mainService.id,
    name: mainService.name,
    status: mainService.status,
    aboutTitle: `درباره ${mainService.name}`,
    images: sliderImages,
    extraInfo,
    address: mainService.airportObject.description,
    features,
    pricing: {
      iranian: mapNationalityPrices(data.priceList, "PERSIAN", "مسافران ایرانی", IRAN_MAP),
      foreign: mapNationalityPrices(data.priceList, "NON_PERSIAN", "مسافران غیر ایرانی", WORLD_MAP),
    },
    rulesTitle: "قوانین و مقررات",
    rules,
  };
}
