"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloseSquare, Edit2 } from "iconsax-react";
import ProfileSectionCard from "@/components/profile/ProfileSectionCard";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import TextField from "@/components/ui/TextField";
import { getFormErrorMessage } from "@/components/auth/auth-form-utils";
import { dateInputToIso } from "@/lib/format";
import { toastSuccess } from "@/lib/toast";
import {
  updateCustomerInfoSchema,
  type UpdateCustomerInfoFormValues,
} from "@/schemas/customer";
import { liveFormValidation } from "@/lib/validation";
import { useCustomerInfo, useUpdateCustomerInfo } from "@/services/customer/customer.queries";
import { useLookupSelectOptions } from "@/services/lookups/lookups.queries";

export default function ProfileInfoSection() {
  const [isEditing, setIsEditing] = useState(false);
  const { data, isPending, error } = useCustomerInfo();
  const updateMutation = useUpdateCustomerInfo();
  const {
    nationalityOptions,
    genderOptions,
    nationalitiesLoading,
    gendersLoading,
  } = useLookupSelectOptions(isEditing);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateCustomerInfoFormValues>({
    resolver: zodResolver(updateCustomerInfoSchema),
    ...liveFormValidation,
    defaultValues: {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      address: "",
      city: "",
      nationalityId: "",
      birthDate: "",
      gender: "",
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
      nationalityId: "",
      birthDate: "",
      gender: "",
    });
  }, [data, reset]);

  function openEdit() {
    if (!data) return;
    reset({
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      mobileNumber: data.mobileNumber ?? "",
      address: "",
      city: "",
      nationalityId: "",
      birthDate: "",
      gender: "",
    });
    updateMutation.reset();
    setIsEditing(true);
  }

  function closeEdit() {
    setIsEditing(false);
    updateMutation.reset();
    if (data) {
      reset({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        mobileNumber: data.mobileNumber ?? "",
        address: "",
        city: "",
        nationalityId: "",
        birthDate: "",
        gender: "",
      });
    }
  }

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
      setIsEditing(false);
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

  const summaryItems = [
    { label: "نام و نام خانوادگی", value: `${data.firstName} ${data.lastName}` },
    { label: "کد ملی", value: data.nationalId },
    { label: "موبایل", value: data.mobileNumber },
    { label: "سطح مشتری", value: data.customerLevelDescription },
    { label: "نوع مشتری", value: data.customerTypeObject?.description },
    { label: "شرکت", value: data.companyName || "—" },
  ];

  return (
    <ProfileSectionCard
      title="اطلاعات من"
      description={
        isEditing
          ? "اطلاعات تماس و هویتی خود را به‌روزرسانی کنید."
          : "خلاصه حساب کاربری شما"
      }
      action={
        isEditing ? (
          <button
            type="button"
            onClick={closeEdit}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-border-input px-4 text-sm text-text-secondary transition-opacity hover:bg-cta-pill-bg"
          >
            <CloseSquare size={18} color="#c9ada7" variant="Linear" />
            انصراف
          </button>
        ) : (
          <button
            type="button"
            onClick={openEdit}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-extrabold text-black transition-opacity hover:opacity-90"
          >
            <Edit2 size={18} color="#000" variant="Linear" />
            ویرایش اطلاعات
          </button>
        )
      }
    >
      {isEditing ? (
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
          <Select
            label="جنسیت"
            options={genderOptions}
            placeholder="انتخاب کنید"
            isLoading={gendersLoading}
            error={errors.gender?.message}
            {...register("gender")}
          />
          <TextField
            label="تاریخ تولد"
            type="date"
            error={errors.birthDate?.message}
            {...register("birthDate")}
          />
          <Select
            label="ملیت"
            options={nationalityOptions}
            placeholder="انتخاب کنید"
            isLoading={nationalitiesLoading}
            searchable
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

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-accent transition-opacity hover:opacity-90 disabled:opacity-50 sm:flex-none sm:min-w-[200px] sm:px-8"
            >
              <span className="text-base font-extrabold text-black">
                {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </span>
            </button>
            <button
              type="button"
              onClick={closeEdit}
              disabled={updateMutation.isPending}
              className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-border-input text-text-secondary transition-opacity hover:bg-cta-pill-bg disabled:opacity-50 sm:flex-none sm:min-w-[140px] sm:px-6"
            >
              انصراف
            </button>
          </div>

          {updateMutation.isError ? (
            <p className="text-sm text-danger sm:col-span-2">
              {getFormErrorMessage(updateMutation.error, "ذخیره اطلاعات ناموفق بود.")}
            </p>
          ) : null}
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {summaryItems.map((item) => (
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
      )}
    </ProfileSectionCard>
  );
}
