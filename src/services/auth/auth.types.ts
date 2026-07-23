export interface CustomerLoginObject {
  firstName: string;
  lastName: string;
  username: string;
}

export interface TokenObject {
  token: string;
  expireTime: number;
}

export interface AuthSessionData {
  customerLoginObject: CustomerLoginObject;
  accessTokenObject: TokenObject;
  refreshTokenObject: TokenObject;
}

export interface CaptchaData {
  uuid: string;
  /** Base64-encoded image (JPEG), without data-URI prefix. */
  captcha: string;
}

export interface LoginPayload {
  username: string;
  password: string;
  captchaUuid: string;
  captchaAnswer: string;
}

export interface SignupSendOtpPayload {
  nationalCode: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  captchaUuid: string;
  captchaAnswer: string;
}

export interface SignupSendOtpData {
  hashedCode: string;
  expireTime: number;
  otpStatus: string;
  mobileNumber: string;
}

export interface SignupVerifyOtpPayload {
  hashedCode: string;
  otp: string;
  password: string;
  repeatPassword: string;
}

export type AuthModalView = "login" | "signup";
