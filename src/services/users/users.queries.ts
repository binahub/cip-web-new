import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api-client";
import type { User } from "./users.types";
import type { ApiResponse } from "@/types";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

async function fetchUsers(): Promise<User[]> {
  const { data } = await apiClient.get<ApiResponse<User[]>>("/users");
  return data.data;
}

async function fetchUser(id: number): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
  return data.data;
}

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
}
