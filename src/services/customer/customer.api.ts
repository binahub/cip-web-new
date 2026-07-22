import apiClient from "@/services/api-client";
import type { CipApiResponse } from "@/types";
import type {
  CancelReservationPayload,
  CipPage,
  CustomerInfo,
  CustomerPassenger,
  CustomerReservation,
  CustomerWallet,
  PassengerListParams,
  PassengerPayload,
  UpdateCustomerInfoPayload,
  WalletStatementItem,
} from "./customer.types";

export async function fetchCustomerInfo(): Promise<CustomerInfo> {
  const { data } = await apiClient.get<CipApiResponse<CustomerInfo>>("/customer/info");
  if (!data.data) throw { message: "دریافت اطلاعات کاربر ناموفق بود.", status: 404 };
  return data.data;
}

export async function updateCustomerInfo(payload: UpdateCustomerInfoPayload): Promise<void> {
  await apiClient.post<CipApiResponse<unknown>>("/customer/info/update", payload);
}

export async function fetchCustomerWallet(): Promise<CustomerWallet> {
  const { data } = await apiClient.get<CipApiResponse<CustomerWallet>>("/customer/wallet");
  if (!data.data) throw { message: "دریافت کیف پول ناموفق بود.", status: 404 };
  return data.data;
}

export async function fetchWalletStatement(
  walletAccountId: number | string,
  page = 0,
  size = 20,
): Promise<CipPage<WalletStatementItem>> {
  const { data } = await apiClient.get<CipApiResponse<CipPage<WalletStatementItem>>>(
    `/customer/wallet/accounts/${walletAccountId}/statement`,
    { params: { page, size } },
  );
  if (!data.data) throw { message: "دریافت گردش حساب ناموفق بود.", status: 404 };
  return data.data;
}

export async function fetchCustomerReservations(
  page = 1,
  size = 20,
): Promise<CipPage<CustomerReservation>> {
  const { data } = await apiClient.get<CipApiResponse<CipPage<CustomerReservation>>>(
    "/customer/reservations",
    { params: { page, size } },
  );
  if (!data.data) throw { message: "دریافت رزروها ناموفق بود.", status: 404 };
  return data.data;
}

export async function cancelCustomerReservation(payload: CancelReservationPayload): Promise<void> {
  await apiClient.post<CipApiResponse<unknown>>("/customer/reservations/cancel", payload);
}

export async function fetchCustomerPassengers(
  parameterMap: PassengerListParams = {},
): Promise<CipPage<CustomerPassenger>> {
  const { data } = await apiClient.post<CipApiResponse<CipPage<CustomerPassenger>>>(
    "/customer/passengers/list",
    {
      parameterMap: {
        firstName: "",
        lastName: "",
        nationalCode: "",
        page: "0",
        size: "10",
        orderBy: "id",
        sort: "asc",
        ...parameterMap,
      },
    },
  );
  if (!data.data) throw { message: "دریافت مسافران ناموفق بود.", status: 404 };
  return data.data;
}

export async function createCustomerPassenger(payload: PassengerPayload): Promise<void> {
  await apiClient.post<CipApiResponse<unknown>>("/customer/passengers", payload);
}

export async function updateCustomerPassenger(
  id: number,
  payload: PassengerPayload,
): Promise<void> {
  await apiClient.post<CipApiResponse<unknown>>(`/customer/passengers/${id}/update`, payload);
}

export async function deleteCustomerPassenger(id: number): Promise<void> {
  await apiClient.post<CipApiResponse<unknown>>(`/customer/passengers/${id}/delete`, null);
}
