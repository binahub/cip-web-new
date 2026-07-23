"use client";

import ProfileSectionCard from "@/components/profile/ProfileSectionCard";
import DataTable, { type DataTableColumn } from "@/components/ui/DataTable";
import Spinner from "@/components/ui/Spinner";
import { formatPrice } from "@/lib/format";
import { useCustomerWallet } from "@/services/customer/customer.queries";
import type { WalletAccount } from "@/services/customer/customer.types";

const columns: DataTableColumn<WalletAccount>[] = [
  {
    key: "accountNumber",
    header: "شماره حساب",
    render: (row) => <span dir="ltr">{row.accountNumber}</span>,
  },
  {
    key: "currency",
    header: "ارز",
    render: (row) => row.walletAccountCurrencyObject?.description || row.walletAccountCurrencyObject?.value,
  },
  {
    key: "balance",
    header: "موجودی",
    render: (row) => formatPrice(row.balance),
  },
  {
    key: "status",
    header: "وضعیت",
    render: (row) => row.status,
  },
];

export default function ProfileWalletSection() {
  const { data, isPending, error } = useCustomerWallet();

  if (isPending) return <Spinner className="py-16" />;
  if (error || !data) {
    return (
      <p className="py-12 text-center text-white/70">امکان نمایش کیف پول وجود ندارد.</p>
    );
  }

  const totalBalance = data.walletAccounts.reduce((sum, account) => sum + (account.balance || 0), 0);

  return (
    <ProfileSectionCard
      title="کیف پول"
      description={data.description || "موجودی و حساب‌های کیف پول شما"}
    >
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-accent/30 bg-cta-pill-bg px-4 py-4 sm:col-span-1">
          <p className="text-xs text-text-secondary">موجودی کل</p>
          <p className="mt-2 text-2xl font-extrabold text-white">
            {formatPrice(totalBalance)}
          </p>
        </div>
        <div className="rounded-2xl border border-border-input/30 bg-service-chip-bg px-4 py-4">
          <p className="text-xs text-text-secondary">شناسه کیف پول</p>
          <p className="mt-2 text-lg font-bold text-white" dir="ltr">
            {data.walletId}
          </p>
        </div>
        <div className="rounded-2xl border border-border-input/30 bg-service-chip-bg px-4 py-4">
          <p className="text-xs text-text-secondary">وضعیت</p>
          <p className="mt-2 text-lg font-bold text-accent">{data.status}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={data.walletAccounts}
        rowKey={(row) => row.id}
        emptyMessage="حسابی در کیف پول ثبت نشده است."
      />
    </ProfileSectionCard>
  );
}
