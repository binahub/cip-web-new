import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/api-client";
import type { User, CreateUserPayload, UpdateUserPayload } from "./users.types";
import type { ApiResponse } from "@/types";
import { userKeys } from "./users.queries";

async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<User>>("/users", payload);
  return data.data;
}

async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const { data } = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload);
  return data.data;
}

async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateUserPayload & { id: number }) =>
      updateUser(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
