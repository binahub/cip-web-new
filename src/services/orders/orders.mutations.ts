import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/api-client";
import type { Order, CreateOrderPayload } from "./orders.types";
import type { ApiResponse } from "@/types";
import { orderKeys } from "./orders.queries";

async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post<ApiResponse<Order>>("/orders", payload);
  return data.data;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
