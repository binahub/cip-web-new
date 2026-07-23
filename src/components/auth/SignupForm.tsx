"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Call, Eye, EyeSlash, Lock, Profile, Sms } from "iconsax-react";
import CaptchaField from "@/components/auth/CaptchaField";
import { getFieldErrors, getFormErrorMessage } from "@/components/auth/auth-form-utils";
import TextField from "@/components/ui/TextField";
import {
  signupInfoSchema,
  signupVerifySchema,
  type SignupInfoFormValues,
  type SignupVerifyFormValues,
} from "@/schemas/auth";
import { liveFormValidation } from "@/lib/validation";
import {
  useCaptcha,
  useRefreshCaptcha,
  useSignupSendOtpMutation,
  useSignupVerifyOtpMutation,
} from "@/services/auth/auth.queries";
import type { AuthSessionData, SignupSendOtpData } from "@/services/auth/auth.types";

interface SignupFormProps {
  onSuccess: (session: AuthSessionData) => void;
  onGoLogin: () => void;
}

type SignupStep = "info" | "verify";

function resolveOtpDeadline(expireTime: number): number {
  if (!expireTime) return Date.now() + 120_000;
  if (expireTime > 1e12) return expireTime;
  if (expireTime > 1e9) return expireTime * 1000;
  return Date.now() + expireTime * 1000;
}

export default function SignupForm({ onSuccess, onGoLogin }: SignupFormProps) {
  const [step, setStep] = useState<SignupStep>("info");
  const [otpSession, setOtpSession] = useState<SignupSendOtpData | null>(null);
  const [now, setNow] = useState(Date.now());
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [apiFieldErrors, setApiFieldErrors] = useState<Record<string, string>>({});

  const { data: captcha, isPending: captchaLoading, isFetching } = useCaptcha(true);
  const refreshCaptcha = useRefreshCaptcha();
  const sendOtpMutation = useSignupSendOtpMutation();
  const verifyOtpMutation = useSignupVerifyOtpMutation();

  const infoForm = useForm<SignupInfoFormValues>({
    resolver: zodResolver(signupInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nationalCode: "",
      mobileNumber: "",
      captchaAnswer: "",
    },
    ...liveFormValidation,
  });

  const verifyForm = useForm<SignupVerifyFormValues>({
    resolver: zodResolver(signupVerifySchema),
    defaultValues: {
      otp: "",
      password: "",
      repeatPassword: "",
    },
    ...liveFormValidation,
  });

  const captchaAnswer = infoForm.watch("captchaAnswer");
  const { setValue: setInfoValue } = infoForm;

  useEffect(() => {
    setInfoValue("captchaAnswer", "");
  }, [captcha?.uuid, setInfoValue]);

  useEffect(() => {
    if (step !== "verify" || !otpSession) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [step, otpSession]);

  const remainingSeconds = useMemo(() => {
    if (!otpSession) return 0;
    return Math.max(0, Math.ceil((resolveOtpDeadline(otpSession.expireTime) - now) / 1000));
  }, [otpSession, now]);

  const handleSendOtp = infoForm.handleSubmit(async (values) => {
    setFormError(null);
    setApiFieldErrors({});

    if (!captcha?.uuid) {
      setFormError("کد امنیتی آماده نیست. لطفا دوباره تلاش کنید.");
      refreshCaptcha();
      return;
    }

    try {
      const result = await sendOtpMutation.mutateAsync({
        ...values,
        captchaUuid: captcha.uuid,
      });
      setOtpSession(result);
      setStep("verify");
      verifyForm.reset({ otp: "", password: "", repeatPassword: "" });
    } catch (error) {
      setApiFieldErrors(getFieldErrors(error));
      setFormError(getFormErrorMessage(error, "ارسال کد تایید ناموفق بود."));
      infoForm.setValue("captchaAnswer", "");
      refreshCaptcha();
    }
  });

  const handleVerifyOtp = verifyForm.handleSubmit(async (values) => {
    setFormError(null);
    setApiFieldErrors({});

    if (!otpSession?.hashedCode) {
      setFormError("جلسه ثبت‌نام منقضی شده است. دوباره شروع کنید.");
      setStep("info");
      return;
    }

    try {
      const session = await verifyOtpMutation.mutateAsync({
        hashedCode: otpSession.hashedCode,
        otp: values.otp,
        password: values.password,
        repeatPassword: values.repeatPassword,
      });
      onSuccess(session);
    } catch (error) {
      setApiFieldErrors(getFieldErrors(error));
      setFormError(getFormErrorMessage(error, "تایید ثبت‌نام ناموفق بود."));
    }
  });

  async function handleResendOtp() {
    if (remainingSeconds > 0 || !captcha?.uuid) return;

    const parsed = signupInfoSchema.safeParse(infoForm.getValues());
    if (!parsed.success) {
      setStep("info");
      setFormError("برای ارسال مجدد، اطلاعات و کد امنیتی را دوباره بررسی کنید.");
      return;
    }

    setFormError(null);
    setApiFieldErrors({});

    try {
      const result = await sendOtpMutation.mutateAsync({
        ...parsed.data,
        captchaUuid: captcha.uuid,
      });
      setOtpSession(result);
      verifyForm.setValue("otp", "");
      infoForm.setValue("captchaAnswer", "");
      refreshCaptcha();
    } catch (error) {
      setApiFieldErrors(getFieldErrors(error));
      setFormError(getFormErrorMessage(error, "ارسال مجدد کد ناموفق بود."));
      refreshCaptcha();
      setStep("info");
    }
  }

  if (step === "verify" && otpSession) {
    return (
      <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4" dir="rtl" noValidate>
        <div className="space-y-1 text-right">
          <h2 className="text-xl font-bold text-white sm:text-2xl">تایید ثبت‌نام</h2>
          <p className="text-sm text-text-secondary">
            کد تایید به شماره{" "}
            <span className="font-semibold text-accent" dir="ltr">
              {otpSession.mobileNumber}
            </span>{" "}
            ارسال شد.
          </p>
        </div>

        <TextField
          label="کد تایید"
          placeholder="کد پیامک‌شده را وارد کنید"
          inputMode="numeric"
          autoComplete="one-time-code"
          leadingIcon={<Sms size={20} color="#969696" variant="Linear" />}
          error={verifyForm.formState.errors.otp?.message || apiFieldErrors.otp}
          {...verifyForm.register("otp")}
        />

        <TextField
          label="رمز عبور"
          type={showPassword ? "text" : "password"}
          placeholder="رمز عبور جدید"
          autoComplete="new-password"
          leadingIcon={<Lock size={20} color="#969696" variant="Linear" />}
          trailingSlot={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
            >
              {showPassword ? (
                <EyeSlash size={20} color="#969696" variant="Linear" />
              ) : (
                <Eye size={20} color="#969696" variant="Linear" />
              )}
            </button>
          }
          error={verifyForm.formState.errors.password?.message || apiFieldErrors.password}
          {...verifyForm.register("password")}
        />

        <TextField
          label="تکرار رمز عبور"
          type={showPassword ? "text" : "password"}
          placeholder="تکرار رمز عبور"
          autoComplete="new-password"
          leadingIcon={<Lock size={20} color="#969696" variant="Linear" />}
          error={
            verifyForm.formState.errors.repeatPassword?.message || apiFieldErrors.repeatPassword
          }
          {...verifyForm.register("repeatPassword")}
        />

        {formError ? (
          <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</p>
        ) : null}

        <button
          type="submit"
          disabled={verifyOtpMutation.isPending}
          className="mt-1 flex h-14 w-full shrink-0 items-center justify-center rounded-2xl bg-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <span className="text-base font-extrabold text-black">
            {verifyOtpMutation.isPending ? "در حال ثبت‌نام..." : "تکمیل ثبت‌نام"}
          </span>
        </button>

        <div className="flex flex-col items-center gap-3 text-sm text-text-secondary">
          {remainingSeconds > 0 ? (
            <p>
              ارسال مجدد تا{" "}
              <span className="font-semibold text-accent" dir="ltr">
                {remainingSeconds}
              </span>{" "}
              ثانیه دیگر
            </p>
          ) : (
            <div className="flex w-full flex-col gap-3">
              <CaptchaField
                captcha={captcha}
                isLoading={captchaLoading || isFetching}
                value={captchaAnswer}
                onChange={(value) =>
                  infoForm.setValue("captchaAnswer", value, {
                    shouldValidate: !!infoForm.formState.errors.captchaAnswer,
                  })
                }
                onRefresh={refreshCaptcha}
                error={infoForm.formState.errors.captchaAnswer?.message}
              />
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={sendOtpMutation.isPending || !captchaAnswer.trim()}
                className="font-semibold text-accent transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                ارسال مجدد کد
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setStep("info");
              setFormError(null);
              setApiFieldErrors({});
              refreshCaptcha();
            }}
            className="text-text-secondary transition-colors hover:text-white"
          >
            ویرایش اطلاعات
          </button>

          <button
            type="button"
            onClick={onGoLogin}
            className="font-semibold text-accent transition-opacity hover:opacity-80"
          >
            بازگشت به ورود
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="flex flex-col gap-4" dir="rtl" noValidate>
      <div className="space-y-1 text-right">
        <h2 className="text-xl font-bold text-white sm:text-2xl">ثبت‌نام</h2>
        <p className="text-sm text-text-secondary">
          اطلاعات خود را وارد کنید تا کد تایید برای شما ارسال شود.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="نام"
          placeholder="نام"
          leadingIcon={<Profile size={20} color="#969696" variant="Linear" />}
          error={infoForm.formState.errors.firstName?.message || apiFieldErrors.firstName}
          {...infoForm.register("firstName")}
        />
        <TextField
          label="نام خانوادگی"
          placeholder="نام خانوادگی"
          leadingIcon={<Profile size={20} color="#969696" variant="Linear" />}
          error={infoForm.formState.errors.lastName?.message || apiFieldErrors.lastName}
          {...infoForm.register("lastName")}
        />
      </div>

      <TextField
        label="کد ملی"
        placeholder="کد ملی ۱۰ رقمی"
        inputMode="numeric"
        leadingIcon={<Profile size={20} color="#969696" variant="Linear" />}
        error={infoForm.formState.errors.nationalCode?.message || apiFieldErrors.nationalCode}
        {...infoForm.register("nationalCode")}
      />

      <TextField
        label="شماره موبایل"
        placeholder="09xxxxxxxxx"
        inputMode="tel"
        leadingIcon={<Call size={20} color="#969696" variant="Linear" />}
        error={infoForm.formState.errors.mobileNumber?.message || apiFieldErrors.mobileNumber}
        {...infoForm.register("mobileNumber")}
      />

      <CaptchaField
        captcha={captcha}
        isLoading={captchaLoading || isFetching}
        value={captchaAnswer}
        onChange={(value) =>
          infoForm.setValue("captchaAnswer", value, {
            shouldValidate: !!infoForm.formState.errors.captchaAnswer,
          })
        }
        onRefresh={refreshCaptcha}
        error={
          infoForm.formState.errors.captchaAnswer?.message ||
          apiFieldErrors.captchaAnswer ||
          apiFieldErrors.captchaUuid
        }
      />

      {formError ? (
        <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</p>
      ) : null}

      <button
        type="submit"
        disabled={sendOtpMutation.isPending}
        className="mt-1 flex h-14 w-full shrink-0 items-center justify-center rounded-2xl bg-accent transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <span className="text-base font-extrabold text-black">
          {sendOtpMutation.isPending ? "در حال ارسال..." : "دریافت کد تایید"}
        </span>
      </button>

      <p className="text-center text-sm text-text-secondary">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <button
          type="button"
          onClick={onGoLogin}
          className="font-semibold text-accent transition-opacity hover:opacity-80"
        >
          وارد شوید
        </button>
      </p>
    </form>
  );
}
