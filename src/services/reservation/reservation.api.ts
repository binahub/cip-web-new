import apiClient from "@/services/api-client";
import type { CipApiResponse } from "@/types";
import type { CipPage } from "@/services/customer/customer.types";
import type {
  AddPassengersPayload,
  AddServicesPayload,
  AirlineItem,
  AirportItem,
  CouponPayload,
  CreateReservationDraftPayload,
  DraftNumberPayload,
  DraftMyPassenger,
  FinalizedReservation,
  FinalizePostpaidPayload,
  FinalizeWalletPayload,
  LookupListParams,
  ReservationDraft,
  ReservationWalletInfo,
  SaveDraftMyPassengerPayload,
  TripTypeItem,
  UpdatePassengerCountsPayload,
} from "./reservation.types";

function unwrapData<T>(data: CipApiResponse<T>, fallbackMessage: string): T {
  if (!data.data) {
    throw { message: fallbackMessage, status: 404, errorDetail: data.errorDetail };
  }
  return data.data;
}

const defaultLookupParams = (extra: Record<string, string> = {}): LookupListParams => ({
  parameterMap: {
    id: "",
    persianName: "",
    englishName: "",
    page: "0",
    size: "50",
    orderBy: "id",
    sort: "asc",
    ...extra,
  },
});

export async function fetchTripTypes(): Promise<TripTypeItem[]> {
  const { data } = await apiClient.post<CipApiResponse<CipPage<TripTypeItem>>>(
    "/trip-type/list",
    defaultLookupParams(),
  );
  return unwrapData(data, "دریافت نوع سفر ناموفق بود.").list ?? [];
}

export async function fetchAirlines(): Promise<AirlineItem[]> {
  const { data } = await apiClient.post<CipApiResponse<CipPage<AirlineItem>>>(
    "/airline/list",
    defaultLookupParams({ iata: "", icao: "", status: "ACTIVE" }),
  );
  return unwrapData(data, "دریافت ایرلاین‌ها ناموفق بود.").list ?? [];
}

export async function fetchAirports(): Promise<AirportItem[]> {
  const { data } = await apiClient.post<CipApiResponse<CipPage<AirportItem>>>(
    "/airport/list",
    defaultLookupParams({ iata: "", icao: "", status: "ACTIVE" }),
  );
  return unwrapData(data, "دریافت فرودگاه‌ها ناموفق بود.").list ?? [];
}

export async function createReservationDraft(
  payload: CreateReservationDraftPayload,
): Promise<ReservationDraft> {
  const { data } = await apiClient.post<CipApiResponse<ReservationDraft>>(
    "/reservation-draft/create",
    payload,
  );
  return unwrapData(data, "ایجاد پیش‌نویس رزرو ناموفق بود.");
}

export async function updatePassengerCounts(
  payload: UpdatePassengerCountsPayload,
): Promise<ReservationDraft> {
  const { data } = await apiClient.post<CipApiResponse<ReservationDraft>>(
    "/reservation-draft/update-passenger-counts",
    payload,
  );
  return unwrapData(data, "به‌روزرسانی تعداد مسافران ناموفق بود.");
}

export async function addDraftPassengers(
  payload: AddPassengersPayload,
): Promise<ReservationDraft> {
  const { data } = await apiClient.post<CipApiResponse<ReservationDraft>>(
    "/reservation-draft/add-passengers",
    payload,
  );
  return unwrapData(data, "ثبت مسافران ناموفق بود.");
}

export async function fetchDraftMyPassengers(
  page = 0,
  size = 20,
): Promise<CipPage<DraftMyPassenger>> {
  const { data } = await apiClient.get<CipApiResponse<CipPage<DraftMyPassenger>>>(
    "/reservation-draft/my-passengers",
    { params: { page, size } },
  );
  return unwrapData(data, "دریافت مسافران ذخیره‌شده ناموفق بود.");
}

export async function saveDraftMyPassenger(
  payload: SaveDraftMyPassengerPayload,
  setAsDefault = false,
): Promise<DraftMyPassenger> {
  const { data } = await apiClient.post<CipApiResponse<DraftMyPassenger>>(
    "/reservation-draft/my-passengers",
    payload,
    { params: { setAsDefault } },
  );
  return unwrapData(data, "ذخیره مسافر ناموفق بود.");
}

export async function addDraftServices(
  payload: AddServicesPayload,
): Promise<ReservationDraft> {
  const { data } = await apiClient.post<CipApiResponse<ReservationDraft>>(
    "/reservation-draft/add-services",
    payload,
  );
  return unwrapData(data, "افزودن خدمات ناموفق بود.");
}

/** API path uses the backend spelling `copoun`. */
export async function calculateCoupon(payload: CouponPayload): Promise<ReservationDraft> {
  const { data } = await apiClient.post<CipApiResponse<ReservationDraft>>(
    "/reservation-draft/calculate-copoun",
    payload,
  );
  return unwrapData(data, "اعمال کد تخفیف ناموفق بود.");
}

export async function removeCoupon(payload: DraftNumberPayload): Promise<ReservationDraft> {
  const { data } = await apiClient.post<CipApiResponse<ReservationDraft>>(
    "/reservation-draft/remove-coupon",
    payload,
  );
  return unwrapData(data, "حذف کد تخفیف ناموفق بود.");
}

export async function fetchReservationWalletInfo(): Promise<ReservationWalletInfo> {
  const { data } = await apiClient.get<CipApiResponse<ReservationWalletInfo>>(
    "/reservation-draft/wallet-info",
  );
  return unwrapData(data, "دریافت اطلاعات کیف پول ناموفق بود.");
}

export async function finalizePostpaid(
  payload: FinalizePostpaidPayload,
): Promise<FinalizedReservation> {
  const { data } = await apiClient.post<CipApiResponse<FinalizedReservation>>(
    "/reservation-payment/finalize-postpaid",
    payload,
  );
  return unwrapData(data, "نهایی‌سازی رزرو ناموفق بود.");
}

export async function finalizeWallet(
  payload: FinalizeWalletPayload,
): Promise<FinalizedReservation> {
  const { data } = await apiClient.post<CipApiResponse<FinalizedReservation>>(
    "/reservation-payment/finalize-wallet",
    payload,
  );
  return unwrapData(data, "پرداخت از کیف پول ناموفق بود.");
}
