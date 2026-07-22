import type { ValueDescription } from "@/services/customer/customer.types";
import type { CipPage } from "@/services/customer/customer.types";

export type { CipPage, ValueDescription };

/** Shared list POST body used by trip-type / airline / airport. */
export interface LookupListParams {
  parameterMap: Record<string, string>;
}

export interface TripTypeItem {
  id: string;
  persianName: string;
  englishName: string;
  description: string;
}

export interface AirlineItem {
  id: string;
  persianName: string;
  englishName: string;
  iata: string;
  icao: string;
  status: string;
  localIcon: string | null;
  cdnIcon: string | null;
}

export interface AirportItem {
  id: string;
  persianName: string;
  englishName: string;
  iata: string;
  icao: string;
  status: string;
  cipLocation: string | null;
}

export interface CreateReservationDraftPayload {
  tripTypeId: number;
  airportId: number;
  airlineId: number;
  flightNumber: string;
  flightDate: string;
  destinationAirportId: number;
  terminal: string;
  primaryServiceId: number;
  adultCount: number;
  childCount: number;
  infantCount: number;
  luggageCount: number;
}

export interface UpdatePassengerCountsPayload {
  draftNumber: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  luggageCount: number;
  primaryServiceId: number;
}

export interface DraftPassengerInput {
  customerPassengerId?: number | null;
  firstName: string;
  lastName: string;
  nationalCode: string;
  mobileNumber?: string;
  passportNumber?: string;
  gender: string;
  birthDate: string;
  ageCategoryId: number;
  nationalityId: number;
  needsWheelchair: boolean;
  specialMeal?: string;
  medicalConditions?: string;
  notes?: string;
}

/** Saved passenger from GET /reservation-draft/my-passengers */
export interface DraftMyPassenger {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  passportNumber: string | null;
  gender: string;
  birthDate: string;
  ageCategoryId: number;
  ageCategoryName: string;
  nationalityId: number;
  nationalityName: string;
  needsWheelchair: boolean;
  specialMeal: string | null;
  isDefault: boolean;
}

export interface SaveDraftMyPassengerPayload {
  customerPassengerId?: number | null;
  firstName: string;
  lastName: string;
  nationalCode: string;
  mobileNumber?: string;
  passportNumber?: string;
  gender: string;
  birthDate: string;
  ageCategoryId: number;
  nationalityId: number;
  needsWheelchair: boolean;
  specialMeal?: string;
  medicalConditions?: string;
  notes?: string;
}

export interface AddPassengersPayload {
  draftNumber: string;
  passengers: DraftPassengerInput[];
}

export interface DraftServiceInput {
  mainServiceId: number;
  quantity: number;
  ageCategoryId: number;
  nationalityId: number;
  description?: string;
}

export interface AddServicesPayload {
  draftNumber: string;
  services: DraftServiceInput[];
}

export interface CouponPayload {
  draftNumber: string;
  couponCode: string;
}

export interface DraftNumberPayload {
  draftNumber: string;
}

export interface FinalizePaymentBase {
  draftNumber: string;
  specialNeeds?: string;
  customerNotes?: string;
  agreeToTerms: boolean;
  saveMainPassengerAsDefault: boolean;
  amount: number;
}

export interface FinalizePostpaidPayload extends FinalizePaymentBase {}

export interface FinalizeWalletPayload extends FinalizePaymentBase {
  walletAccountId: number;
}

export interface ReservationAirportRef {
  id: string;
  persianName: string;
  englishName: string;
  iata: string;
  icao: string;
  status: string;
  cipLocation: string | null;
}

export interface ReservationAirlineRef {
  id: string;
  persianName: string;
  englishName: string;
  iata: string;
  icao: string;
  status: string;
  localIcon: string | null;
  cdnIcon: string | null;
}

export interface DraftFlightInfo {
  flightNumber: string;
  flightDate: string;
  terminal: string;
  tripTypeObject: ValueDescription;
  airportObject: ReservationAirportRef;
  airlineObject: ReservationAirlineRef;
  airportDestinationObject: ReservationAirportRef;
}

export interface DraftPassengerCounts {
  adultCount: number;
  childCount: number;
  infantCount: number;
  luggageCount: number;
}

export interface DraftPriceBreakdown {
  basePrice: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode: string | null;
}

export interface DraftPassenger {
  customerPassengerId: number | null;
  firstName: string;
  lastName: string;
  ageCategoryName: string;
  mobileNumber: string | null;
  needsWheelchair: boolean;
  gender: string;
  nationalityName: string;
  birthDate: string;
  ageCategoryObject: ValueDescription;
  genderObject: ValueDescription;
}

export interface DraftServiceLine {
  mainServiceId: number;
  serviceName: string;
  quantity: number;
  ageCategoryName: string;
  nationalityName: string;
  unitPrice: number;
  totalWithTax: number;
  mainServiceObject: ValueDescription;
  ageCategoryObject: ValueDescription;
}

export interface DraftCustomerInfo {
  firstName: string;
  lastName: string;
  companyName: string | null;
  nationalId: string;
  mobileNumber: string;
  customerLevelDescription: string;
  customerTypeObject: ValueDescription;
}

export interface ReservationDraft {
  draftNumber: string;
  expiresAt: string;
  stepCompleted: string;
  flightInfo: DraftFlightInfo;
  passengerCounts: DraftPassengerCounts;
  priceBreakdown: DraftPriceBreakdown;
  passengers: DraftPassenger[];
  services: DraftServiceLine[];
  customerInfo: DraftCustomerInfo;
}

export interface WalletAccountOption {
  id: number;
  accountNumber: string;
  status: string;
  walletAccountCurrencyObject: ValueDescription;
  balance: number;
}

export interface ReservationWalletInfo {
  walletId: number;
  description: string;
  status: string;
  walletAccounts: WalletAccountOption[];
}

export interface FinalizedReservationService {
  mainServiceId: number;
  mainServiceName: string;
  quantity: number;
  unitPrice: number;
  totalWithTax: number;
}

export interface FinalizedReservationPassenger {
  firstName: string;
  lastName: string;
  ageCategoryName: string;
  nationalityName: string;
  needsWheelchair: boolean;
}

export interface FinalizedReservation {
  id: number;
  reservationNumber: string;
  reservationSource: string;
  customerId: number;
  flightNumber: string;
  flightDate: string;
  currentStatus: string;
  paymentStatus: string;
  finalAmount: number;
  services: FinalizedReservationService[];
  passengers: FinalizedReservationPassenger[];
  createTime: string;
}

export interface MainServicePickOption {
  id: string;
  title: string;
  priceLabel: string;
  imageUrl: string;
}
