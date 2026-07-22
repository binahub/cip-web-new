import { z } from "zod";
import { fieldSchemas, validationMessages } from "@/lib/validation";

export const loginSchema = z.object({
  username: fieldSchemas.username,
  password: z.string().min(1, validationMessages.required),
  captchaAnswer: fieldSchemas.captchaAnswer,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupInfoSchema = z.object({
  firstName: fieldSchemas.firstName,
  lastName: fieldSchemas.lastName,
  nationalCode: fieldSchemas.nationalCode,
  mobileNumber: fieldSchemas.mobileNumber,
  captchaAnswer: fieldSchemas.captchaAnswer,
});

export type SignupInfoFormValues = z.infer<typeof signupInfoSchema>;

export const signupVerifySchema = z
  .object({
    otp: fieldSchemas.otp,
    password: fieldSchemas.password,
    repeatPassword: z.string().min(1, validationMessages.required),
  })
  .refine((values) => values.password === values.repeatPassword, {
    message: validationMessages.passwordMatch,
    path: ["repeatPassword"],
  });

export type SignupVerifyFormValues = z.infer<typeof signupVerifySchema>;
