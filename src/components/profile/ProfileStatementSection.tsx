"use client";

import { useMemo, useState } from "react";
import ProfileSectionCard from "@/components/profile/ProfileSectionCard";
import DataTable, { type DataTableColumn } from "@/components/ui/DataTable";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import { formatDateFa, formatPrice } from "@/lib/format";
import {
  useCustomerWallet,
  useWalletStatement,
} from "@/services/customer/customer.queries";
import type { WalletAccount, WalletStatementItem } from "@/services/customer/customer.types";

const columns: DataTableColumn<WalletStatementItem>[] = [
  {
    key: "createTime",
    header: "تاریخ",
    render: (row) => formatDateFa(row.createTime),
  },
  {
    key: "type",
    header: "نوع",
    render: (row) => row.type,
  },
  {
    key: "amount",
    header: "مبلغ",
    render: (row) => formatPrice(row.amount),
  },
  {
    key: "availableBalance",
    header: "موجودی قابل برداشت",
    render: (row) => formatPrice(row.availableBalance),
  },
  {
    key: "description",
    header: "توضیحات",
    render: (row) => row.description || "—",
  },
];

export default function ProfileStatementSection() {
  const { data: wallet, isPending: walletLoading } = useCustomerWallet();
  const [accountId, setAccountId] = useState<string>("");
  const [page, setPage] = useState(0);

  const accounts = useMemo<WalletAccount[]>(
    () => wallet?.walletAccounts ?? [],
    [wallet?.walletAccounts],
  );
  const selectedAccountId =
    accountId || (accounts[0] != null ? String(accounts[0].id) : "");

  const { data, isPending, error } = useWalletStatement(
    selectedAccountId || null,
    page,
    20,
  );

  const accountOptions = useMemo(
    () =>
      accounts.map((account) => ({
        value: String(account.id),
        label: `کیف پول — ${account.walletAccountCurrencyObject?.description ?? ""}`,
      })),
    [accounts],
  );

  if (walletLoading) return <Spinner className="py-16" />;

  return (
    <ProfileSectionCard
      title="گردش حساب"
      description="تراکنش‌های حساب کیف پول خود را مشاهده کنید."
      action={
        accountOptions.length > 0 ? (
          <div className="w-full min-w-55 sm:w-70">
            <Select
              options={accountOptions}
              value={selectedAccountId}
              onChange={(event) => {
                setAccountId(event.target.value);
                setPage(0);
              }}
              placeholder="انتخاب حساب"
            />
          </div>
        ) : null
      }
    >
      {!selectedAccountId ? (
        <p className="py-8 text-center text-text-secondary">حسابی برای نمایش وجود ندارد.</p>
      ) : error ? (
        <p className="py-8 text-center text-white/70">امکان نمایش گردش حساب وجود ندارد.</p>
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
    </ProfileSectionCard>
  );
}
