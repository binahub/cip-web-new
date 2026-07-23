import { z, type ZodTypeAny } from "zod";

/** Shared Persian validation messages for forms across the app. */
export const validationMessages = {
  required: "این فیلد الزامی است.",
  invalid: "مقدار وارد شده معتبر نیست.",
  mobile: "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.",
  nationalCode: "کد ملی باید ۱۰ رقم و معتبر باشد.",
  passwordMin: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
  passwordMatch: "تکرار رمز عبور مطابقت ندارد.",
  otp: "کد تایید باید بین ۴ تا ۸ رقم باشد.",
  captcha: "کد امنیتی را وارد کنید.",
  username: "نام کاربری را وارد کنید.",
  firstName: "نام را وارد کنید.",
  lastName: "نام خانوادگی را وارد کنید.",
  firstNameEnglish: "نام را به انگلیسی بنویسید (کیبورد را انگلیسی کنید).",
  lastNameEnglish: "نام خانوادگی را به انگلیسی بنویسید (کیبورد را انگلیسی کنید).",
} as const;

/** Latin letters only; spaces / hyphen / apostrophe allowed between parts. */
const ENGLISH_NAME_PATTERN = /^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/;

export function isEnglishName(value: string): boolean {
  return ENGLISH_NAME_PATTERN.test(value.trim());
}

export function isValidIranianNationalCode(value: string): boolean {
  if (!/^\d{10}$/.test(value)) return false;
  if (/^(\d)\1{9}$/.test(value)) return false;

  const check = Number(value[9]);
  const sum = value
    .split("")
    .slice(0, 9)
    .reduce((acc, digit, index) => acc + Number(digit) * (10 - index), 0);
  const remainder = sum % 11;

  return remainder < 2 ? check === remainder : check + remainder === 11;
}

/** Reusable field schemas — compose these in feature schemas. */
export const fieldSchemas = {
  requiredString: (message = validationMessages.required) =>
    z.string().trim().min(1, message),

  username: z.string().trim().min(1, validationMessages.username),

  password: z.string().min(8, validationMessages.passwordMin),

  mobileNumber: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, validationMessages.mobile),

  nationalCode: z
    .string()
    .trim()
    .regex(/^\d{10}$/, validationMessages.nationalCode)
    .refine(isValidIranianNationalCode, validationMessages.nationalCode),

  firstName: z.string().trim().min(1, validationMessages.firstName).max(50),

  lastName: z.string().trim().min(1, validationMessages.lastName).max(50),

  firstNameEnglish: z
    .string()
    .trim()
    .min(1, validationMessages.firstName)
    .max(50)
    .regex(ENGLISH_NAME_PATTERN, validationMessages.firstNameEnglish),

  lastNameEnglish: z
    .string()
    .trim()
    .min(1, validationMessages.lastName)
    .max(50)
    .regex(ENGLISH_NAME_PATTERN, validationMessages.lastNameEnglish),

  captchaAnswer: z.string().trim().min(1, validationMessages.captcha),

  otp: z
    .string()
    .trim()
    .regex(/^\d{4,8}$/, validationMessages.otp),
} as const;

export type FieldErrors = Record<string, string>;

/** Convert Zod issues to a flat field→message map for UI inputs. */
export function zodIssuesToFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

/**
 * Safe-parse a schema and return either data or field errors.
 * Use in submit handlers (with or without react-hook-form).
 */
export function parseWithZod<TSchema extends ZodTypeAny>(
  schema: TSchema,
  values: unknown,
):
  | { success: true; data: z.infer<TSchema> }
  | { success: false; fieldErrors: FieldErrors } {
  const result = schema.safeParse(values);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, fieldErrors: zodIssuesToFieldErrors(result.error) };
}
