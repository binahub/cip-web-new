import { z } from "zod";
import { toEnglishDigits } from "@/lib/format";
import { fieldSchemas, validationMessages } from "@/lib/validation";

const positiveIntString = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => /^\d+$/.test(value) && Number(value) > 0, message);

const birthDateSchema = z
  .string()
  .trim()
  .min(1, "تاریخ تولد را وارد کنید.")
  .transform((value) => toEnglishDigits(value))
  .refine((value) => /^\d{4}\/\d{2}\/\d{2}$/.test(value), {
    message: "تاریخ تولد را به صورت ۱۳۶۶/۰۶/۱۸ یا 1986/06/18 وارد کنید.",
  });

export const updateCustomerInfoSchema = z.object({
  firstName: fieldSchemas.firstName,
  lastName: fieldSchemas.lastName,
  mobileNumber: fieldSchemas.mobileNumber,
  address: z.string().trim().min(1, validationMessages.required),
  city: z.string().trim().min(1, validationMessages.required),
  nationalityId: positiveIntString("ملیت را انتخاب کنید."),
  birthDate: z.string().trim().min(1, validationMessages.required),
  gender: z.enum(["MALE", "FEMALE"], { message: "جنسیت را انتخاب کنید." }),
});

export type UpdateCustomerInfoFormValues = z.infer<typeof updateCustomerInfoSchema>;

export const cancelReservationSchema = z.object({
  reservationNumber: z.string().trim().min(1, validationMessages.required),
  cancelReason: z.string().trim().min(3, "دلیل لغو را وارد کنید."),
});

export type CancelReservationFormValues = z.infer<typeof cancelReservationSchema>;

export const passengerFormSchema = z.object({
  firstName: fieldSchemas.firstName,
  lastName: fieldSchemas.lastName,
  nationalCode: fieldSchemas.nationalCode,
  passportNumber: z.string().trim().optional(),
  gender: z.enum(["MALE", "FEMALE"], { message: "جنسیت را انتخاب کنید." }),
  birthDate: birthDateSchema,
  ageCategoryId: positiveIntString("رده سنی را وارد کنید."),
  nationalityId: positiveIntString("ملیت را وارد کنید."),
  needsWheelchair: z.boolean(),
  specialMeal: z.string().trim().optional(),
  medicalConditions: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  setAsDefault: z.boolean(),
});

export type PassengerFormValues = z.infer<typeof passengerFormSchema>;
