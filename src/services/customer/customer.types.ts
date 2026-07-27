export interface ValueDescription {
  value: string;
  description: string;
}

export interface CipPage<T> {
  size: number;
  totalPages: number;
  totalElements: number;
  number: number;
  list: T[];
}

export interface CustomerInfo {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  mobileNumber: string;
  customerLevelName: string;
  customerType: string;
  nationalityName: string;
  nationalityId: number;
  birthDate: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  status: string;
}

export interface UpdateCustomerInfoPayload {
  address: string;
  city: string;
  mobileNumber: string;
  nationalityId: number;
  firstName: string;
  lastName: string;
  /** Jalali or Gregorian calendar date as `YYYY/MM/DD`. */
  birthDate: string;
  gender: string;
}

export interface WalletAccount {
  id: number;
  accountNumber: string;
  status: string;
  walletAccountCurrencyObject: ValueDescription;
  balance: number;
}

export interface CustomerWallet {
  walletId: number;
  description: string;
  status: string;
  walletAccounts: WalletAccount[];
}

export interface WalletStatementItem {
  id: string;
  walletAccountId: string;
  accountNumber: string;
  amount: number;
  type: string;
  typeObject?: ValueDescription;
  realBalance: number;
  availableBalance: number;
  description: string;
  createTime: string;
}

export interface CustomerReservation {
  id: number;
  reservationNumber: string;
  flightNumber: string;
  flightDate: string;
  currentStatus: string;
  paymentStatus: string;
  finalAmount: number;
  createTime: string;
}

export interface ReservationDetailPassenger {
  id: number;
  firstName: string;
  lastName: string;
  nationalId: string | null;
  passportNumber: string | null;
  birthDate: string | null;
  gender: string | null;
  nationalityName: string | null;
  ageCategoryName: string | null;
  needsWheelchair: boolean;
  specialMeal: string | null;
  medicalConditions: string | null;
  notes: string | null;
}

export interface ReservationDetailService {
  id: number;
  mainServiceName: string;
  mainServicePersianName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  totalTax: number;
  finalAmount: number;
}

export interface ReservationDetailPayment {
  id: number;
  paymentType: string;
  paymentTypePersian: string | null;
  paymentAmount: number;
  paymentStatus: string;
  paymentDatetime: string | null;
  refundAmount: number | null;
  refundDatetime: string | null;
  refundReason: string | null;
  walletDetails: unknown | null;
  posDetails: unknown | null;
  vipCardDetails: unknown | null;
}

export interface CustomerReservationDetail {
  id: number;
  reservationNumber: string;
  reservationSource: string | null;
  currentStatus: string;
  currentStatusPersian: string | null;
  paymentStatus: string;
  paymentStatusPersian: string | null;
  airportId: number | null;
  airportName: string | null;
  airportIata: string | null;
  airlineId: number | null;
  airlineName: string | null;
  airlineIata: string | null;
  flightNumber: string | null;
  flightDate: string | null;
  destinationAirportId: number | null;
  destinationAirportName: string | null;
  destinationAirportIata: string | null;
  terminal: string | null;
  tripTypeName: string | null;
  adultCount: number;
  childCount: number;
  infantCount: number;
  luggageCount: number;
  primaryMainServiceId: number | null;
  primaryMainServiceName: string | null;
  totalPrice: number;
  totalTax: number;
  couponDiscountAmount: number;
  manualDiscountAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode: string | null;
  specialNeeds: string | null;
  customerNotes: string | null;
  internalNotes: string | null;
  checkInTime: string | null;
  serviceStartTime: string | null;
  serviceEndTime: string | null;
  qrCode: string | null;
  barcode: string | null;
  assignedOperatorName: string | null;
  passengers: ReservationDetailPassenger[];
  services: ReservationDetailService[];
  payment: ReservationDetailPayment | null;
  createTime: string | null;
  updateTime: string | null;
}

export interface CancelReservationPayload {
  reservationNumber: string;
  cancelReason: string;
}

export interface PassengerListParams {
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  page?: string;
  size?: string;
  orderBy?: string;
  sort?: "asc" | "desc";
}

export interface CustomerPassenger {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  mobileNumber?: string | null;
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

export interface PassengerPayload {
  firstName: string;
  lastName: string;
  nationalCode: string | null;
  mobileNumber: string;
  passportNumber: string | null;
  gender: string;
  birthDate: string;
  ageCategoryId: number;
  nationalityId: number;
  needsWheelchair: boolean;
  specialMeal: string | null;
  medicalConditions: string | null;
  notes: string | null;
  setAsDefault: boolean;
}
