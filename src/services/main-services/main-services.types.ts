export interface AirportObject {
  value: string;
  description: string;
}

export interface AgeCategoryObject {
  value: string;
  description: string;
}

export interface NationalityObject {
  value: string;
  description: string;
}

export interface MainService {
  id: string;
  airportObject: AirportObject;
  name: string;
  capacity: string;
  description: string;
  status: string;
  symbol: string;
  timeDurationMinutes: string;
  showCountUsed: string;
  isMainService: boolean;
}

export interface MinPrice {
  id: string;
  ageCategoryObject: AgeCategoryObject;
  nationalityObject: NationalityObject;
  customerLevelDescription: string;
  price: string;
  taxRate: string;
}

export interface MainServiceImage {
  id: string;
  mainService: MainService;
  name: string;
  localImage: string;
  cdnImage: string;
  isMainImage: boolean;
}

export interface ActiveMainServiceSummaryItem {
  mainService: MainService;
  minPrice: MinPrice;
  mainImage: MainServiceImage | null;
}

export interface ActiveMainServicesSummaryData {
  list: ActiveMainServiceSummaryItem[];
}

export interface ServiceFacility {
  id: string;
  facilityName: string;
  localIcon: string | null;
  cdnIcon: string | null;
  description: string;
}

export interface ServiceExtraInfo {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface ServiceRule {
  id: string;
  description: string;
  order: number;
}

export interface RelatedServiceItem {
  id: string;
  description: string;
  relatedMainService: MainService;
}

export interface MainServiceDetailData {
  mainService: MainService;
  priceList: MinPrice[];
  imageList: MainServiceImage[];
  facilityList: ServiceFacility[];
  extraInfoList: ServiceExtraInfo[];
  ruleList: ServiceRule[];
  relatedServiceList: RelatedServiceItem[];
}

/** Mapped shape used by home ServiceCard. */
export interface ServiceCardViewModel {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  imagePosition?: string;
  isMainService: boolean;
}

export interface ServiceDetailExtraInfoView {
  id: string;
  title: string;
  content: string;
}

export interface ServiceDetailFeatureView {
  id: string;
  label: string;
  icon: string;
}

export interface ServiceDetailPriceCardView {
  id: string;
  title: string;
  subtitle: string;
  totalPrice: string;
  currency: string;
  note: string;
  mapImage: string;
  ctaLabel: string;
  breakdown: { label: string; value: string }[];
}

/** Mapped shape used by /services/[id]. */
export interface ServiceDetailViewModel {
  id: string;
  name: string;
  status: string;
  aboutTitle: string;
  images: string[];
  extraInfo: ServiceDetailExtraInfoView[];
  address: string;
  features: ServiceDetailFeatureView[];
  pricing: {
    iranian: ServiceDetailPriceCardView[];
    foreign: ServiceDetailPriceCardView[];
  };
  rulesTitle: string;
  rules: string[];
}
