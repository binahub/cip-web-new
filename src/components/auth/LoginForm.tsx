"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeSlash, Lock, User } from "iconsax-react";
import CaptchaField from "@/components/auth/CaptchaField";
import { getFieldErrors, getFormErrorMessage } from "@/components/auth/auth-form-utils";
import TextField from "@/components/ui/TextField";
import { loginSchema, type LoginFormValues } from "@/schemas/auth";
import { liveFormValidation } from "@/lib/validation";
import {
  useCaptcha,
  useLoginMutation,
  useRefreshCaptcha,
} from "@/services/auth/auth.queries";
import type { AuthSessionData } from "@/services/auth/auth.types";

interface LoginFormProps {
  onSuccess: (session: AuthSessionData) => void;
  onGoSignup: () => void;
}

export default function LoginForm({ onSuccess, onGoSignup }: LoginFormProps) {
  const { data: captcha, isPending: captchaLoading, isFetching } = useCaptcha(true);
  const refreshCaptcha = useRefreshCaptcha();
  const loginMutation = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [apiFieldErrors, setApiFieldErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      captchaAnswer: "",
    },
    ...liveFormValidation,
  });

  const captchaAnswer = watch("captchaAnswer");

  useEffect(() => {
    setValue("captchaAnswer", "");
  }, [captcha?.uuid, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setApiFieldErrors({});

    if (!captcha?.uuid) {
      setFormError("کد امنیتی آماده نیست. لطفا دوباره تلاش کنید.");
      refreshCaptcha();
      return;
    }

    try {
      const session = await loginMutation.mutateAsync({
        username: values.username,
        password: values.password,
        captchaUuid: captcha.uuid,
        captchaAnswer: values.captchaAnswer,
      });
      onSuccess(session);
    } catch (error) {
      setApiFieldErrors(getFieldErrors(error));
      setFormError(getFormErrorMessage(error, "ورود ناموفق بود."));
      setValue("captchaAnswer", "");
      refreshCaptcha();
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" dir="rtl" noValidate>
      <div className="space-y-1 text-right">
        <h2 className="text-xl font-bold text-white sm:text-2xl">ورود به حساب</h2>
        <p className="text-sm text-text-secondary">
          برای شروع سفارش وارد حساب کاربری خود شوید.
        </p>
      </div>

      <TextField
        label="نام کاربری"
        placeholder="نام کاربری خود را وارد کنید"
        autoComplete="username"
        leadingIcon={<User size={20} color="#969696" variant="Linear" />}
        error={errors.username?.message || apiFieldErrors.username}
        {...register("username")}
      />

      <TextField
        label="رمز عبور"
        type={showPassword ? "text" : "password"}
        placeholder="رمز عبور"
        autoComplete="current-password"
        leadingIcon={<Lock size={20} color="#969696" variant="Linear" />}
        trailingSlot={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
            className="flex items-center justify-center"
          >
            {showPassword ? (
              <EyeSlash size={20} color="#969696" variant="Linear" />
            ) : (
              <Eye size={20} color="#969696" variant="Linear" />
            )}
          </button>
        }
        error={errors.password?.message || apiFieldErrors.password}
        {...register("password")}
      />

      <CaptchaField
        captcha={captcha}
        isLoading={captchaLoading || isFetching}
        value={captchaAnswer}
        onChange={(value) =>
          setValue("captchaAnswer", value, { shouldValidate: !!errors.captchaAnswer })
        }
        onRefresh={refreshCaptcha}
        error={
          errors.captchaAnswer?.message ||
          apiFieldErrors.captchaAnswer ||
          apiFieldErrors.captchaUuid
        }
      />

      {formError ? (
        <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</p>
      ) : null}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="mt-1 flex h-14 w-full shrink-0 items-center justify-center rounded-2xl bg-accent transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <span className="text-base font-extrabold text-black">
          {loginMutation.isPending ? "در حال ورود..." : "ورود"}
        </span>
      </button>

      <p className="text-center text-sm text-text-secondary">
        حساب کاربری ندارید؟{" "}
        <button
          type="button"
          onClick={onGoSignup}
          className="font-semibold text-accent transition-opacity hover:opacity-80"
        >
          ثبت‌نام کنید
        </button>
      </p>
    </form>
  );
}
