import apiClient from "@/services/api-client";
import type { CipApiResponse } from "@/types";
import type {
  AuthSessionData,
  CaptchaData,
  ForgotPasswordSendOtpData,
  ForgotPasswordSendOtpPayload,
  ForgotPasswordVerifyOtpPayload,
  LoginPayload,
  SignupSendOtpData,
  SignupSendOtpPayload,
  SignupVerifyOtpPayload,
} from "./auth.types";

export async function fetchCaptcha(): Promise<CaptchaData> {
  const { data } = await apiClient.get<CipApiResponse<CaptchaData>>("/auth/captcha", {
    skipAuth: true,
  });

  if (!data.data) {
    throw { message: "دریافت کد امنیتی ناموفق بود.", status: 500 };
  }

  return data.data;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthSessionData> {
  const { data } = await apiClient.post<CipApiResponse<AuthSessionData>>(
    "/auth/login",
    payload,
    { skipAuth: true },
  );

  if (!data.data) {
    throw { message: "ورود ناموفق بود.", status: 400 };
  }

  return data.data;
}

export async function signupSendOtpRequest(
  payload: SignupSendOtpPayload,
): Promise<SignupSendOtpData> {
  const { data } = await apiClient.post<CipApiResponse<SignupSendOtpData>>(
    "/auth/signup/sendOtp",
    payload,
    { skipAuth: true },
  );

  if (!data.data) {
    throw { message: "ارسال کد تایید ناموفق بود.", status: 400 };
  }

  return data.data;
}

export async function signupVerifyOtpRequest(
  payload: SignupVerifyOtpPayload,
): Promise<AuthSessionData> {
  const { data } = await apiClient.post<CipApiResponse<AuthSessionData>>(
    "/auth/signup/verifyOtp",
    payload,
    { skipAuth: true },
  );

  if (!data.data) {
    throw { message: "تایید ثبت‌نام ناموفق بود.", status: 400 };
  }

  return data.data;
}

export async function forgotPasswordSendOtpRequest(
  payload: ForgotPasswordSendOtpPayload,
): Promise<ForgotPasswordSendOtpData> {
  const { data } = await apiClient.post<CipApiResponse<ForgotPasswordSendOtpData>>(
    "/auth/forgotPassword/sendOtp",
    payload,
    { skipAuth: true },
  );

  if (!data.data) {
    throw { message: "ارسال کد تایید ناموفق بود.", status: 400 };
  }

  return data.data;
}

export async function forgotPasswordVerifyOtpRequest(
  payload: ForgotPasswordVerifyOtpPayload,
): Promise<string> {
  const { data } = await apiClient.post<CipApiResponse<string>>(
    "/auth/forgotPassword/verifyOtp",
    payload,
    { skipAuth: true },
  );

  if (!data.success) {
    throw { message: "بازیابی رمز عبور ناموفق بود.", status: 400 };
  }

  return data.data ?? "رمز عبور با موفقیت تغییر کرد.";
}

/** Invalidates the current access token on the server. Requires Bearer auth. */
export async function logoutRequest(): Promise<void> {
  await apiClient.post<CipApiResponse<unknown>>("/auth/logout", null);
}
