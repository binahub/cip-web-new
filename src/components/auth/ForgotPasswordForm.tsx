"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Call, Eye, EyeSlash, Lock, Profile } from "iconsax-react";
import CaptchaField from "@/components/auth/CaptchaField";
import OtpField from "@/components/auth/OtpField";
import {
  getFieldErrors,
  getFormErrorMessage,
  resolveOtpDeadline,
} from "@/components/auth/auth-form-utils";
import TextField from "@/components/ui/TextField";
import {
  forgotPasswordInfoSchema,
  forgotPasswordVerifySchema,
  type ForgotPasswordInfoFormValues,
  type ForgotPasswordVerifyFormValues,
} from "@/schemas/auth";
import { liveFormValidation } from "@/lib/validation";
import { toastSuccess } from "@/lib/toast";
import {
  useCaptcha,
  useForgotPasswordSendOtpMutation,
  useForgotPasswordVerifyOtpMutation,
  useRefreshCaptcha,
} from "@/services/auth/auth.queries";
import type { ForgotPasswordSendOtpData } from "@/services/auth/auth.types";

interface ForgotPasswordFormProps {
  onGoLogin: () => void;
}

type ForgotPasswordStep = "info" | "verify";

export default function ForgotPasswordForm({ onGoLogin }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<ForgotPasswordStep>("info");
  const [otpSession, setOtpSession] = useState<ForgotPasswordSendOtpData | null>(null);
  const [now, setNow] = useState(Date.now());
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [apiFieldErrors, setApiFieldErrors] = useState<Record<string, string>>({});

  const { data: captcha, isPending: captchaLoading, isFetching } = useCaptcha(true);
  const refreshCaptcha = useRefreshCaptcha();
  const sendOtpMutation = useForgotPasswordSendOtpMutation();
  const verifyOtpMutation = useForgotPasswordVerifyOtpMutation();

  const infoForm = useForm<ForgotPasswordInfoFormValues>({
    resolver: zodResolver(forgotPasswordInfoSchema),
    defaultValues: {
      nationalCode: "",
      mobileNumber: "",
      captchaAnswer: "",
    },
    ...liveFormValidation,
  });

  const verifyForm = useForm<ForgotPasswordVerifyFormValues>({
    resolver: zodResolver(forgotPasswordVerifySchema),
    defaultValues: {
      otp: "",
      password: "",
      repeatPassword: "",
    },
    ...liveFormValidation,
  });

  const captchaAnswer = infoForm.watch("captchaAnswer");
  const otpValue = verifyForm.watch("otp");
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
      setFormError("جلسه بازیابی منقضی شده است. دوباره شروع کنید.");
      setStep("info");
      return;
    }

    try {
      const message = await verifyOtpMutation.mutateAsync({
        hashedCode: otpSession.hashedCode,
        otp: values.otp,
        password: values.password,
        repeatPassword: values.repeatPassword,
      });
      toastSuccess(
        typeof message === "string" && message.trim()
          ? message
          : "رمز عبور با موفقیت تغییر کرد. اکنون وارد شوید.",
      );
      onGoLogin();
    } catch (error) {
      setApiFieldErrors(getFieldErrors(error));
      setFormError(getFormErrorMessage(error, "بازیابی رمز عبور ناموفق بود."));
    }
  });

  async function handleResendOtp() {
    if (remainingSeconds > 0 || !captcha?.uuid) return;

    const parsed = forgotPasswordInfoSchema.safeParse(infoForm.getValues());
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
          <h2 className="text-xl font-bold text-white sm:text-2xl">بازیابی رمز عبور</h2>
          <p className="text-sm text-text-secondary">
            کد تایید به شماره{" "}
            <span className="font-semibold text-accent" dir="ltr">
              {otpSession.mobileNumber}
            </span>{" "}
            ارسال شد. کد را وارد کنید و رمز جدید بسازید.
          </p>
        </div>

        <OtpField
          value={otpValue}
          onChange={(value) =>
            verifyForm.setValue("otp", value, {
              shouldValidate: !!verifyForm.formState.errors.otp || value.length >= 4,
              shouldDirty: true,
            })
          }
          onBlur={() => verifyForm.trigger("otp")}
          error={verifyForm.formState.errors.otp?.message || apiFieldErrors.otp}
          autoFillEnabled
        />

        <TextField
          label="رمز عبور جدید"
          type={showPassword ? "text" : "password"}
          placeholder="حداقل ۸ کاراکتر"
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
          placeholder="تکرار رمز عبور جدید"
          autoComplete="new-password"
          leadingIcon={<Lock size={20} color="#969696" variant="Linear" />}
          error={
            verifyForm.formState.errors.repeatPassword?.message ||
            apiFieldErrors.repeatPassword
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
            {verifyOtpMutation.isPending ? "در حال ذخیره..." : "تغییر رمز عبور"}
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
        <h2 className="text-xl font-bold text-white sm:text-2xl">فراموشی رمز عبور</h2>
        <p className="text-sm text-text-secondary">
          کد ملی و شماره موبایل ثبت‌شده را وارد کنید تا کد تایید برایتان پیامک شود.
        </p>
      </div>

      <TextField
        label="کد ملی"
        placeholder="کد ملی ۱۰ رقمی"
        inputMode="numeric"
        autoComplete="username"
        leadingIcon={<Profile size={20} color="#969696" variant="Linear" />}
        error={infoForm.formState.errors.nationalCode?.message || apiFieldErrors.nationalCode}
        {...infoForm.register("nationalCode")}
      />

      <TextField
        label="شماره موبایل"
        placeholder="09xxxxxxxxx"
        inputMode="tel"
        autoComplete="tel"
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
        رمز عبور را به‌خاطر دارید؟{" "}
        <button
          type="button"
          onClick={onGoLogin}
          className="font-semibold text-accent transition-opacity hover:opacity-80"
        >
          ورود
        </button>
      </p>
    </form>
  );
}
