import { z } from "zod";
import { fieldSchemas, validationMessages } from "@/lib/validation";

const positiveInt = (message: string) =>
  z.number({ message }).int().positive(message);

const nonNegativeInt = (message: string = validationMessages.required) =>
  z.number({ message }).int().min(0, message);

export const createDraftFormSchema = z
  .object({
    tripTypeId: z.string().trim().min(1, "نوع سفر را انتخاب کنید."),
    airportId: z.string().trim().min(1, "فرودگاه را انتخاب کنید."),
    airlineId: z.string().trim().min(1, "ایرلاین را انتخاب کنید."),
    destinationAirportId: z.string().trim().min(1, "فرودگاه مقصد را انتخاب کنید."),
    flightNumber: z.string().trim().min(1, "شماره پرواز را وارد کنید."),
    terminal: z.string().trim().min(1, "ترمینال را وارد کنید."),
    flightDate: z.string().trim().min(1, "تاریخ و زمان پرواز را انتخاب کنید."),
    primaryServiceId: z.string().trim().min(1, "خدمت اصلی را انتخاب کنید."),
    adultCount: nonNegativeInt("تعداد بزرگسال نامعتبر است."),
    childCount: nonNegativeInt(),
    infantCount: nonNegativeInt(),
    luggageCount: nonNegativeInt(),
  })
  .refine((values) => values.adultCount + values.childCount + values.infantCount >= 1, {
    message: "حداقل یک مسافر لازم است.",
    path: ["adultCount"],
  });

export type CreateDraftFormValues = z.infer<typeof createDraftFormSchema>;

export const updateCountsFormSchema = z
  .object({
    adultCount: nonNegativeInt(),
    childCount: nonNegativeInt(),
    infantCount: nonNegativeInt(),
    luggageCount: nonNegativeInt(),
    primaryServiceId: z.string().trim().min(1, "خدمت اصلی را انتخاب کنید."),
  })
  .refine((values) => values.adultCount + values.childCount + values.infantCount >= 1, {
    message: "حداقل یک مسافر لازم است.",
    path: ["adultCount"],
  });

export type UpdateCountsFormValues = z.infer<typeof updateCountsFormSchema>;

export const draftPassengerSchema = z.object({
  customerPassengerId: z.string().optional(),
  firstName: fieldSchemas.firstNameEnglish,
  lastName: fieldSchemas.lastNameEnglish,
  nationalCode: fieldSchemas.nationalCodeOptional,
  mobileNumber: fieldSchemas.mobileNumber,
  passportNumber: z.string().trim().optional(),
  gender: z.string().trim().min(1, "جنسیت را انتخاب کنید."),
  birthDate: fieldSchemas.birthDate,
  ageCategoryId: z.string().trim().min(1, "رده سنی را انتخاب کنید."),
  nationalityId: z.string().trim().min(1, "ملیت را انتخاب کنید."),
  needsWheelchair: z.boolean(),
  specialMeal: z.string().trim().optional(),
  medicalConditions: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  saveToMyPassengers: z.boolean(),
  setAsDefault: z.boolean(),
});

export const addPassengersFormSchema = z.object({
  passengers: z.array(draftPassengerSchema).min(1, "حداقل یک مسافر لازم است."),
});

export type AddPassengersFormValues = z.infer<typeof addPassengersFormSchema>;
export type DraftPassengerFormValues = z.infer<typeof draftPassengerSchema>;

export const draftServiceRowSchema = z.object({
  mainServiceId: z.string().trim().min(1, "خدمت را انتخاب کنید."),
  quantity: positiveInt("تعداد باید حداقل ۱ باشد."),
  ageCategoryId: z.string().trim().min(1, "رده سنی را انتخاب کنید."),
  nationalityId: z.string().trim().min(1, "ملیت را انتخاب کنید."),
  description: z.string().trim().optional(),
});

export const addServicesFormSchema = z.object({
  services: z.array(draftServiceRowSchema),
});

export type AddServicesFormValues = z.infer<typeof addServicesFormSchema>;

export const paymentFormSchema = z
  .object({
    paymentMethod: z.enum(["postpaid", "wallet"]),
    walletAccountId: z.string().optional(),
    specialNeeds: z.string().trim().optional(),
    customerNotes: z.string().trim().optional(),
    agreeToTerms: z.boolean().refine((value) => value === true, {
      message: "پذیرش قوانین الزامی است.",
    }),
    saveMainPassengerAsDefault: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.paymentMethod === "wallet" && !values.walletAccountId?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "حساب کیف پول را انتخاب کنید.",
        path: ["walletAccountId"],
      });
    }
  });

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
