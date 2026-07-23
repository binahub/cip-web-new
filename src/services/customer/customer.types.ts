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
  firstName: string;
  lastName: string;
  companyName: string | null;
  nationalId: string;
  mobileNumber: string;
  customerLevelDescription: string;
  customerTypeObject: ValueDescription;
}

export interface UpdateCustomerInfoPayload {
  address: string;
  city: string;
  mobileNumber: string;
  nationalityId: number;
  firstName: string;
  lastName: string;
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
