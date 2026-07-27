"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "iconsax-react";
import ProfileSectionCard from "@/components/profile/ProfileSectionCard";
import DataTable, { type DataTableColumn } from "@/components/ui/DataTable";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import { formatPrice } from "@/lib/format";
import {
  useCustomerWallet,
  useWalletStatement,
} from "@/services/customer/customer.queries";
import type { WalletAccount, WalletStatementItem } from "@/services/customer/customer.types";

function isDeposit(row: WalletStatementItem) {
  const value = (row.typeObject?.value || row.type || "").toUpperCase();
  const label = row.typeObject?.description ?? "";
  return value === "D" || label.includes("واریز");
}

function isWithdrawal(row: WalletStatementItem) {
  const value = (row.typeObject?.value || row.type || "").toUpperCase();
  const label = row.typeObject?.description ?? "";
  return value === "W" || label.includes("برداشت");
}

function StatementTypeBadge({ row }: { row: WalletStatementItem }) {
  const label = row.typeObject?.description || row.type || "—";
  const deposit = isDeposit(row);
  const withdrawal = isWithdrawal(row);

  const tone = deposit
    ? "border-success/35 bg-success/10 text-success"
    : withdrawal
      ? "border-danger/35 bg-danger/10 text-danger"
      : "border-border-input/40 bg-service-chip-bg text-text-secondary";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${tone}`}
    >
      {deposit ? (
        <ArrowUp size={14} color="currentColor" fontSize={40} variant="Outline" aria-hidden />
      ) : null}
      {withdrawal ? (
        <ArrowDown size={14} color="currentColor" fontSize={40} variant="TwoTone" aria-hidden />
      ) : null}
      {label}
    </span>
  );
}

function StatementAmount({ row }: { row: WalletStatementItem }) {
  const deposit = isDeposit(row);
  const withdrawal = isWithdrawal(row);
  const prefix = deposit ? "+" : withdrawal ? "−" : "";
  const tone = deposit ? "text-success" : withdrawal ? "text-danger" : "text-white";

  return (
    <span className={`font-semibold tabular-nums ${tone}`} dir="ltr">
      {prefix}
      {formatPrice(row.amount)}
    </span>
  );
}

const columns: DataTableColumn<WalletStatementItem>[] = [
  {
    key: "createTime",
    header: "تاریخ",
    render: (row) => (
      <span dir="ltr" className="inline-block text-left tabular-nums">
        {row.createTime || "—"}
      </span>
    ),
  },
  {
    key: "type",
    header: "نوع",
    render: (row) => <StatementTypeBadge row={row} />,
  },
  {
    key: "amount",
    header: "مبلغ",
    render: (row) => <StatementAmount row={row} />,
  },
  {
    key: "availableBalance",
    header: "موجودی قابل برداشت",
    render: (row) => (
      <span dir="ltr" className="tabular-nums">
        {formatPrice(row.availableBalance)}
      </span>
    ),
  },
  {
    key: "description",
    header: "توضیحات",
    truncateAt: 20,
    render: (row) => row.description || "—",
  },
];

export default function ProfileStatementSection() {
  const { data: wallet, isPending: walletLoading, isFetching: walletFetching } =
    useCustomerWallet();
  const [accountId, setAccountId] = useState<string>("");
  const [page, setPage] = useState(0);

  const accounts = useMemo<WalletAccount[]>(
    () => wallet?.walletAccounts ?? [],
    [wallet?.walletAccounts],
  );
  const selectedAccountId =
    accountId || (accounts[0] != null ? String(accounts[0].id) : "");

  const { data, isPending, isFetching, error } = useWalletStatement(
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

  if (walletLoading && !wallet) return <Spinner className="py-16" />;

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
          isLoading={isPending || isFetching || walletFetching}
          page={data?.number ?? page}
          totalPages={data?.totalPages ?? 0}
          minPage={0}
          onPageChange={setPage}
        />
      )}
    </ProfileSectionCard>
  );
}
