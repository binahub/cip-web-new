import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchCaptcha,
  loginRequest,
  logoutRequest,
  signupSendOtpRequest,
  signupVerifyOtpRequest,
} from "./auth.api";
import type {
  LoginPayload,
  SignupSendOtpPayload,
  SignupVerifyOtpPayload,
} from "./auth.types";

export const authKeys = {
  all: ["auth"] as const,
  captcha: () => [...authKeys.all, "captcha"] as const,
};

export function useCaptcha(enabled = true) {
  return useQuery({
    queryKey: authKeys.captcha(),
    queryFn: fetchCaptcha,
    enabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 1,
    meta: { suppressErrorToast: true },
  });
}

export function useRefreshCaptcha() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: authKeys.captcha() });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    meta: { suppressErrorToast: true },
  });
}

export function useSignupSendOtpMutation() {
  return useMutation({
    mutationFn: (payload: SignupSendOtpPayload) => signupSendOtpRequest(payload),
    meta: { suppressErrorToast: true },
  });
}

export function useSignupVerifyOtpMutation() {
  return useMutation({
    mutationFn: (payload: SignupVerifyOtpPayload) => signupVerifyOtpRequest(payload),
    meta: { suppressErrorToast: true },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => logoutRequest(),
    meta: { suppressErrorToast: true },
  });
}
