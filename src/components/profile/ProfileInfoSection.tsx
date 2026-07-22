"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileSectionCard from "@/components/profile/ProfileSectionCard";
import SelectField from "@/components/ui/SelectField";
import Spinner from "@/components/ui/Spinner";
import TextField from "@/components/ui/TextField";
import { getFormErrorMessage } from "@/components/auth/auth-form-utils";
import { dateInputToIso } from "@/lib/format";
import { toastSuccess } from "@/lib/toast";
import {
  updateCustomerInfoSchema,
  type UpdateCustomerInfoFormValues,
} from "@/schemas/customer";
import { useCustomerInfo, useUpdateCustomerInfo } from "@/services/customer/customer.queries";

const genderOptions = [
  { value: "MALE", label: "مرد" },
  { value: "FEMALE", label: "زن" },
];

export default function ProfileInfoSection() {
  const { data, isPending, error } = useCustomerInfo();
  const updateMutation = useUpdateCustomerInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateCustomerInfoFormValues>({
    resolver: zodResolver(updateCustomerInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      address: "",
      city: "",
      nationalityId: "1",
      birthDate: "",
      gender: "MALE",
    },
  });

  useEffect(() => {
    if (!data) return;
    reset({
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      mobileNumber: data.mobileNumber ?? "",
      address: "",
      city: "",
      nationalityId: "1",
      birthDate: "",
      gender: "MALE",
    });
  }, [data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateMutation.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        mobileNumber: values.mobileNumber,
        address: values.address,
        city: values.city,
        gender: values.gender,
        birthDate: dateInputToIso(values.birthDate),
        nationalityId: Number(values.nationalityId),
      });
      toastSuccess("اطلاعات با موفقیت به‌روزرسانی شد.");
    } catch {
      // Error message shown below via updateMutation.isError
    }
  });

  if (isPending) return <Spinner className="py-16" />;
  if (error || !data) {
    return (
      <p className="py-12 text-center text-white/70">امکان نمایش اطلاعات وجود ندارد.</p>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileSectionCard
        title="خلاصه حساب"
        description="اطلاعات اصلی حساب کاربری شما"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "نام و نام خانوادگی", value: `${data.firstName} ${data.lastName}` },
            { label: "کد ملی", value: data.nationalId },
            { label: "موبایل", value: data.mobileNumber },
            { label: "سطح مشتری", value: data.customerLevelDescription },
            { label: "نوع مشتری", value: data.customerTypeObject?.description },
            { label: "شرکت", value: data.companyName || "—" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border-input/30 bg-service-chip-bg px-4 py-3"
            >
              <p className="text-xs text-text-secondary">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-white" dir="auto">
                {item.value || "—"}
              </p>
            </div>
          ))}
        </div>
      </ProfileSectionCard>

      <ProfileSectionCard
        title="ویرایش اطلاعات"
        description="برای به‌روزرسانی اطلاعات تماس و هویتی فرم زیر را تکمیل کنید."
      >
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
          <TextField
            label="نام"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <TextField
            label="نام خانوادگی"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
          <TextField
            label="شماره موبایل"
            error={errors.mobileNumber?.message}
            {...register("mobileNumber")}
          />
          <SelectField
            label="جنسیت"
            options={genderOptions}
            error={errors.gender?.message}
            {...register("gender")}
          />
          <TextField
            label="تاریخ تولد"
            type="date"
            error={errors.birthDate?.message}
            {...register("birthDate")}
          />
          <TextField
            label="شناسه ملیت"
            type="number"
            error={errors.nationalityId?.message}
            {...register("nationalityId")}
          />
          <TextField label="شهر" error={errors.city?.message} {...register("city")} />
          <TextField
            label="آدرس"
            className="sm:col-span-2"
            error={errors.address?.message}
            {...register("address")}
          />

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto sm:min-w-[200px] sm:px-8"
            >
              <span className="text-base font-extrabold text-black">
                {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </span>
            </button>
            {updateMutation.isError ? (
              <p className="mt-2 text-sm text-danger">
                {getFormErrorMessage(updateMutation.error, "ذخیره اطلاعات ناموفق بود.")}
              </p>
            ) : null}
          </div>
        </form>
      </ProfileSectionCard>
    </div>
  );
}
