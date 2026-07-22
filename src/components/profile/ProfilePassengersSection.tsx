"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Edit2, Trash } from "iconsax-react";
import ProfileSectionCard from "@/components/profile/ProfileSectionCard";
import { getFormErrorMessage } from "@/components/auth/auth-form-utils";
import DataTable, { type DataTableColumn } from "@/components/ui/DataTable";
import SelectField from "@/components/ui/SelectField";
import TextField from "@/components/ui/TextField";
import { dateInputToIso, formatDateFa, isoToDateInput } from "@/lib/format";
import { toastSuccess } from "@/lib/toast";
import { passengerFormSchema, type PassengerFormValues } from "@/schemas/customer";
import {
  useCreatePassenger,
  useCustomerPassengers,
  useDeletePassenger,
  useUpdatePassenger,
} from "@/services/customer/customer.queries";
import type { CustomerPassenger } from "@/services/customer/customer.types";

const genderOptions = [
  { value: "MALE", label: "مرد" },
  { value: "FEMALE", label: "زن" },
];

const defaultFormValues: PassengerFormValues = {
  firstName: "",
  lastName: "",
  nationalCode: "",
  passportNumber: "",
  gender: "MALE",
  birthDate: "",
  ageCategoryId: "1",
  nationalityId: "1",
  needsWheelchair: false,
  specialMeal: "",
  medicalConditions: "",
  notes: "",
  setAsDefault: false,
};

export default function ProfilePassengersSection() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState({ firstName: "", lastName: "", nationalCode: "" });
  const [draftSearch, setDraftSearch] = useState(search);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerPassenger | null>(null);

  const params = useMemo(
    () => ({
      firstName: search.firstName,
      lastName: search.lastName,
      nationalCode: search.nationalCode,
      page: String(page),
      size: "10",
      orderBy: "id",
      sort: "asc" as const,
    }),
    [search, page],
  );

  const { data, isPending, error } = useCustomerPassengers(params);
  const createMutation = useCreatePassenger();
  const updateMutation = useUpdatePassenger();
  const deleteMutation = useDeletePassenger();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PassengerFormValues>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues: defaultFormValues,
  });

  function openCreate() {
    setEditing(null);
    reset(defaultFormValues);
    setEditorOpen(true);
  }

  function openEdit(row: CustomerPassenger) {
    setEditing(row);
    reset({
      firstName: row.firstName,
      lastName: row.lastName,
      nationalCode: row.nationalCode,
      passportNumber: row.passportNumber ?? "",
      gender: row.gender === "FEMALE" ? "FEMALE" : "MALE",
      birthDate: isoToDateInput(row.birthDate),
      ageCategoryId: String(row.ageCategoryId || 1),
      nationalityId: String(row.nationalityId || 1),
      needsWheelchair: row.needsWheelchair,
      specialMeal: row.specialMeal ?? "",
      medicalConditions: "",
      notes: "",
      setAsDefault: row.isDefault,
    });
    setEditorOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      nationalCode: values.nationalCode,
      passportNumber: values.passportNumber || undefined,
      gender: values.gender,
      birthDate: dateInputToIso(values.birthDate),
      ageCategoryId: Number(values.ageCategoryId),
      nationalityId: Number(values.nationalityId),
      needsWheelchair: values.needsWheelchair,
      specialMeal: values.specialMeal || undefined,
      medicalConditions: values.medicalConditions || undefined,
      notes: values.notes || undefined,
      setAsDefault: values.setAsDefault,
    };

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload });
      toastSuccess("مسافر به‌روزرسانی شد.");
    } else {
      await createMutation.mutateAsync(payload);
      toastSuccess("مسافر جدید افزوده شد.");
    }
    setEditorOpen(false);
  });

  async function handleDelete(row: CustomerPassenger) {
    const confirmed = window.confirm(
      `مسافر «${row.firstName} ${row.lastName}» حذف شود؟`,
    );
    if (!confirmed) return;
    await deleteMutation.mutateAsync(row.id);
    toastSuccess("مسافر حذف شد.");
  }

  const columns: DataTableColumn<CustomerPassenger>[] = [
    {
      key: "name",
      header: "نام",
      render: (row) => (
        <span>
          {row.firstName} {row.lastName}
          {row.isDefault ? (
            <span className="mr-2 rounded-lg bg-cta-pill-bg px-2 py-0.5 text-[10px] text-accent">
              پیش‌فرض
            </span>
          ) : null}
        </span>
      ),
    },
    {
      key: "nationalCode",
      header: "کد ملی",
      render: (row) => <span dir="ltr">{row.nationalCode}</span>,
    },
    {
      key: "gender",
      header: "جنسیت",
      render: (row) => (row.gender === "FEMALE" ? "زن" : "مرد"),
    },
    {
      key: "birthDate",
      header: "تاریخ تولد",
      render: (row) => formatDateFa(row.birthDate),
    },
    {
      key: "ageCategoryName",
      header: "رده سنی",
      render: (row) => row.ageCategoryName || "—",
    },
    {
      key: "actions",
      header: "عملیات",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="rounded-lg border border-border-input p-2 text-accent hover:bg-cta-pill-bg"
            aria-label="ویرایش"
          >
            <Edit2 size={16} color="#c9ada7" variant="Linear" />
          </button>
          <button
            type="button"
            onClick={() => void handleDelete(row)}
            className="rounded-lg border border-danger/40 p-2 text-danger hover:bg-danger/10"
            aria-label="حذف"
          >
            <Trash size={16} color="#e35d5d" variant="Linear" />
          </button>
        </div>
      ),
    },
  ];

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <ProfileSectionCard
      title="مسافران من"
      description="مسافران ذخیره‌شده برای رزروهای بعدی"
      action={
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-extrabold text-black"
        >
          <Add size={18} color="#000" variant="Linear" />
          افزودن مسافر
        </button>
      }
    >
      <form
        className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(0);
          setSearch(draftSearch);
        }}
      >
        <TextField
          placeholder="نام"
          value={draftSearch.firstName}
          onChange={(event) =>
            setDraftSearch((prev) => ({ ...prev, firstName: event.target.value }))
          }
        />
        <TextField
          placeholder="نام خانوادگی"
          value={draftSearch.lastName}
          onChange={(event) =>
            setDraftSearch((prev) => ({ ...prev, lastName: event.target.value }))
          }
        />
        <TextField
          placeholder="کد ملی"
          value={draftSearch.nationalCode}
          onChange={(event) =>
            setDraftSearch((prev) => ({ ...prev, nationalCode: event.target.value }))
          }
        />
        <button
          type="submit"
          className="h-14 rounded-2xl border border-accent/50 text-accent transition-opacity hover:bg-cta-pill-bg"
        >
          جستجو
        </button>
      </form>

      {error ? (
        <p className="py-8 text-center text-white/70">امکان نمایش مسافران وجود ندارد.</p>
      ) : (
        <DataTable
          columns={columns}
          rows={data?.list ?? []}
          rowKey={(row) => row.id}
          isLoading={isPending}
          page={data?.number ?? page}
          totalPages={data?.totalPages ?? 0}
          minPage={0}
          onPageChange={setPage}
        />
      )}

      {editorOpen ? (
        <div className="fixed inset-0 z-[210] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="بستن"
            onClick={() => setEditorOpen(false)}
          />
          <form
            onSubmit={onSubmit}
            className="relative z-10 flex max-h-[min(92dvh,760px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border-input/40 bg-dropdown-bg sm:rounded-3xl"
            dir="rtl"
            noValidate
          >
            <div className="shrink-0 border-b border-border-input/20 px-5 py-4">
              <h3 className="text-lg font-bold text-white">
                {editing ? "ویرایش مسافر" : "افزودن مسافر"}
              </h3>
            </div>
            <div className="modal-scroll min-h-0 flex-1 space-y-4 px-5 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              </div>
              <TextField
                label="کد ملی"
                error={errors.nationalCode?.message}
                {...register("nationalCode")}
              />
              <TextField
                label="شماره پاسپورت"
                error={errors.passportNumber?.message}
                {...register("passportNumber")}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  label="شناسه رده سنی"
                  type="number"
                  error={errors.ageCategoryId?.message}
                  {...register("ageCategoryId")}
                />
                <TextField
                  label="شناسه ملیت"
                  type="number"
                  error={errors.nationalityId?.message}
                  {...register("nationalityId")}
                />
              </div>
              <TextField label="وعده غذایی ویژه" {...register("specialMeal")} />
              <TextField label="شرایط پزشکی" {...register("medicalConditions")} />
              <TextField label="یادداشت" {...register("notes")} />

              <label className="flex items-center justify-between gap-3 rounded-2xl border border-border-input px-4 py-3 text-sm text-white">
                <span>نیاز به ویلچر</span>
                <input
                  type="checkbox"
                  checked={watch("needsWheelchair")}
                  onChange={(event) => setValue("needsWheelchair", event.target.checked)}
                  className="size-4 accent-[#c9ada7]"
                />
              </label>
              <label className="flex items-center justify-between gap-3 rounded-2xl border border-border-input px-4 py-3 text-sm text-white">
                <span>مسافر پیش‌فرض</span>
                <input
                  type="checkbox"
                  checked={watch("setAsDefault")}
                  onChange={(event) => setValue("setAsDefault", event.target.checked)}
                  className="size-4 accent-[#c9ada7]"
                />
              </label>

              {(createMutation.isError || updateMutation.isError) && (
                <p className="text-sm text-danger">
                  {getFormErrorMessage(
                    createMutation.error || updateMutation.error,
                    "ذخیره مسافر ناموفق بود.",
                  )}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-3 border-t border-border-input/20 px-5 py-4">
              <button
                type="submit"
                disabled={saving}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-accent font-extrabold text-black disabled:opacity-50"
              >
                {saving ? "در حال ذخیره..." : "ذخیره"}
              </button>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-border-input text-text-secondary"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </ProfileSectionCard>
  );
}
