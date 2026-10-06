"use client";

import { forwardRef, useCallback, type ChangeEvent, type ReactNode } from "react";
import { Sms } from "iconsax-react";
import TextField from "@/components/ui/TextField";
import { useWebOtp } from "@/hooks/useWebOtp";
import { toEnglishDigits } from "@/lib/format";

interface OtpFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  error?: string;
  label?: string;
  placeholder?: string;
  /** Enable Web OTP listener (Android Chrome) + autofocus. */
  autoFillEnabled?: boolean;
  maxLength?: number;
  leadingIcon?: ReactNode;
}

/**
 * OTP input tuned for SMS autofill:
 * - iOS Safari: autocomplete="one-time-code"
 * - Android Chrome: Web OTP API via useWebOtp
 * - Normalizes Persian/Arabic digits while typing
 */
const OtpField = forwardRef<HTMLInputElement, OtpFieldProps>(function OtpField(
  {
    value,
    onChange,
    onBlur,
    name = "otp",
    error,
    label = "کد تایید",
    placeholder = "کد پیامک‌شده را وارد کنید",
    autoFillEnabled = true,
    maxLength = 8,
    leadingIcon = <Sms size={20} color="#969696" variant="Linear" />,
  },
  ref,
) {
  const handleOtpAutofill = useCallback(
    (code: string) => {
      onChange(code.slice(0, maxLength));
    },
    [maxLength, onChange],
  );

  useWebOtp({ enabled: autoFillEnabled, onOtp: handleOtpAutofill });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const digits = toEnglishDigits(event.target.value).replace(/\D/g, "").slice(0, maxLength);
    onChange(digits);
  }

  return (
    <TextField
      ref={ref}
      id="otp-one-time-code"
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      inputMode="numeric"
      autoComplete="one-time-code"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      enterKeyHint="done"
      pattern="[0-9]*"
      maxLength={maxLength}
      autoFocus={autoFillEnabled}
      leadingIcon={leadingIcon}
      error={error}
    />
  );
});

export default OtpField;
