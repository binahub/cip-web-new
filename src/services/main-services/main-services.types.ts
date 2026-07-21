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

/** Mapped shape used by home ServiceCard. */
export interface ServiceCardViewModel {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  imagePosition?: string;
  isMainService: boolean;
}
