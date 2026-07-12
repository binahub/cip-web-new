import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api-client";
import type { Order } from "./orders.types";
import type { ApiResponse } from "@/types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};

async function fetchOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<ApiResponse<Order[]>>("/orders");
  return data.data;
}

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: fetchOrders,
  });
}
