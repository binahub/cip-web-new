import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDraftPassengers,
  addDraftServices,
  calculateCoupon,
  createReservationDraft,
  fetchAirlines,
  fetchAirports,
  fetchDraftMyPassengers,
  fetchReservationWalletInfo,
  fetchTripTypes,
  finalizePostpaid,
  finalizeWallet,
  removeCoupon,
  saveDraftMyPassenger,
  updatePassengerCounts,
} from "./reservation.api";
import type {
  AddPassengersPayload,
  AddServicesPayload,
  CouponPayload,
  CreateReservationDraftPayload,
  DraftNumberPayload,
  FinalizePostpaidPayload,
  FinalizeWalletPayload,
  SaveDraftMyPassengerPayload,
  UpdatePassengerCountsPayload,
} from "./reservation.types";

export const reservationKeys = {
  all: ["reservation"] as const,
  tripTypes: () => [...reservationKeys.all, "trip-types"] as const,
  airlines: () => [...reservationKeys.all, "airlines"] as const,
  airports: (status: "ACTIVE" | "ALL" = "ACTIVE") =>
    [...reservationKeys.all, "airports", status] as const,
  walletInfo: () => [...reservationKeys.all, "wallet-info"] as const,
  myPassengers: (page = 0, size = 20) =>
    [...reservationKeys.all, "my-passengers", page, size] as const,
};

export function useTripTypes(enabled = true) {
  return useQuery({
    queryKey: reservationKeys.tripTypes(),
    queryFn: fetchTripTypes,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAirlines(enabled = true) {
  return useQuery({
    queryKey: reservationKeys.airlines(),
    queryFn: fetchAirlines,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAirports(status: "ACTIVE" | "ALL" = "ACTIVE", enabled = true) {
  return useQuery({
    queryKey: reservationKeys.airports(status),
    queryFn: () => fetchAirports(status),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useReservationWalletInfo(enabled = true) {
  return useQuery({
    queryKey: reservationKeys.walletInfo(),
    queryFn: fetchReservationWalletInfo,
    enabled,
  });
}

export function useDraftMyPassengers(page = 0, size = 20, enabled = true) {
  return useQuery({
    queryKey: reservationKeys.myPassengers(page, size),
    queryFn: () => fetchDraftMyPassengers(page, size),
    enabled,
  });
}

export function useSaveDraftMyPassenger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      setAsDefault,
    }: {
      payload: SaveDraftMyPassengerPayload;
      setAsDefault?: boolean;
    }) => saveDraftMyPassenger(payload, setAsDefault ?? false),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [...reservationKeys.all, "my-passengers"],
      });
    },
  });
}

export function useCreateReservationDraft() {
  return useMutation({
    mutationFn: (payload: CreateReservationDraftPayload) => createReservationDraft(payload),
  });
}

export function useUpdatePassengerCounts() {
  return useMutation({
    mutationFn: (payload: UpdatePassengerCountsPayload) => updatePassengerCounts(payload),
  });
}

export function useAddDraftPassengers() {
  return useMutation({
    mutationFn: (payload: AddPassengersPayload) => addDraftPassengers(payload),
  });
}

export function useAddDraftServices() {
  return useMutation({
    mutationFn: (payload: AddServicesPayload) => addDraftServices(payload),
  });
}

export function useCalculateCoupon() {
  return useMutation({
    mutationFn: (payload: CouponPayload) => calculateCoupon(payload),
  });
}

export function useRemoveCoupon() {
  return useMutation({
    mutationFn: (payload: DraftNumberPayload) => removeCoupon(payload),
  });
}

export function useFinalizePostpaid() {
  return useMutation({
    mutationFn: (payload: FinalizePostpaidPayload) => finalizePostpaid(payload),
  });
}

export function useFinalizeWallet() {
  return useMutation({
    mutationFn: (payload: FinalizeWalletPayload) => finalizeWallet(payload),
  });
}
