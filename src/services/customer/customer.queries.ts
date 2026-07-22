import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelCustomerReservation,
  createCustomerPassenger,
  deleteCustomerPassenger,
  fetchCustomerInfo,
  fetchCustomerPassengers,
  fetchCustomerReservations,
  fetchCustomerWallet,
  fetchWalletStatement,
  updateCustomerInfo,
  updateCustomerPassenger,
} from "./customer.api";
import type {
  CancelReservationPayload,
  PassengerListParams,
  PassengerPayload,
  UpdateCustomerInfoPayload,
} from "./customer.types";

export const customerKeys = {
  all: ["customer"] as const,
  info: () => [...customerKeys.all, "info"] as const,
  wallet: () => [...customerKeys.all, "wallet"] as const,
  statement: (accountId: number | string, page: number, size: number) =>
    [...customerKeys.all, "statement", String(accountId), page, size] as const,
  reservations: (page: number, size: number) =>
    [...customerKeys.all, "reservations", page, size] as const,
  passengers: (params: PassengerListParams) =>
    [...customerKeys.all, "passengers", params] as const,
};

export function useCustomerInfo(enabled = true) {
  return useQuery({
    queryKey: customerKeys.info(),
    queryFn: fetchCustomerInfo,
    enabled,
  });
}

export function useUpdateCustomerInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCustomerInfoPayload) => updateCustomerInfo(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.info() });
    },
  });
}

export function useCustomerWallet(enabled = true) {
  return useQuery({
    queryKey: customerKeys.wallet(),
    queryFn: fetchCustomerWallet,
    enabled,
  });
}

export function useWalletStatement(
  walletAccountId: number | string | null,
  page = 0,
  size = 20,
) {
  return useQuery({
    queryKey: customerKeys.statement(walletAccountId ?? "none", page, size),
    queryFn: () => fetchWalletStatement(walletAccountId!, page, size),
    enabled: walletAccountId != null && walletAccountId !== "",
  });
}

export function useCustomerReservations(page = 1, size = 20, enabled = true) {
  return useQuery({
    queryKey: customerKeys.reservations(page, size),
    queryFn: () => fetchCustomerReservations(page, size),
    enabled,
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CancelReservationPayload) => cancelCustomerReservation(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...customerKeys.all, "reservations"] });
    },
  });
}

export function useCustomerPassengers(params: PassengerListParams, enabled = true) {
  return useQuery({
    queryKey: customerKeys.passengers(params),
    queryFn: () => fetchCustomerPassengers(params),
    enabled,
  });
}

export function useCreatePassenger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PassengerPayload) => createCustomerPassenger(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...customerKeys.all, "passengers"] });
    },
  });
}

export function useUpdatePassenger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PassengerPayload }) =>
      updateCustomerPassenger(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...customerKeys.all, "passengers"] });
    },
  });
}

export function useDeletePassenger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCustomerPassenger(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...customerKeys.all, "passengers"] });
    },
  });
}
