"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  Profile2User,
  Reserve,
  Wallet2,
  WalletMoney,
} from "iconsax-react";
import Header from "@/components/layout/Header";
import ProfileInfoSection from "@/components/profile/ProfileInfoSection";
import ProfilePassengersSection from "@/components/profile/ProfilePassengersSection";
import ProfileReservationsSection from "@/components/profile/ProfileReservationsSection";
import ProfileStatementSection from "@/components/profile/ProfileStatementSection";
import ProfileWalletSection from "@/components/profile/ProfileWalletSection";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/providers/auth-provider";

const tabs = [
  { id: "info", label: "اطلاعات من", icon: Card },
  { id: "wallet", label: "کیف پول", icon: Wallet2 },
  { id: "statement", label: "گردش حساب", icon: WalletMoney },
  { id: "reservations", label: "رزروها", icon: Reserve },
  { id: "passengers", label: "مسافران من", icon: Profile2User },
] as const;

type ProfileTabId = (typeof tabs)[number]["id"];

function isProfileTabId(value: string | null): value is ProfileTabId {
  return tabs.some((tab) => tab.id === value);
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function ProfilePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isClient = useIsClient();
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const tabParam = searchParams.get("tab");
  const activeTab: ProfileTabId = isProfileTabId(tabParam) ? tabParam : "info";

  function selectTab(tabId: ProfileTabId) {
    const params = new URLSearchParams(searchParams.toString());
    if (tabId === "info") {
      params.delete("tab");
    } else {
      params.set("tab", tabId);
    }
    const query = params.toString();
    router.replace(query ? `/profile?${query}` : "/profile", { scroll: false });
  }

  useEffect(() => {
    if (!isClient) return;
    if (!isAuthenticated) {
      openAuthModal("login");
    }
  }, [isClient, isAuthenticated, openAuthModal]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-[72px]">
          <Header />
          <Spinner className="py-24" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-[72px]">
          <Header />
          <div className="mx-auto max-w-lg py-20 text-center" dir="rtl">
            <h1 className="text-2xl font-bold text-white">ورود لازم است</h1>
            <p className="mt-3 text-text-secondary">
              برای مشاهده پروفایل ابتدا وارد حساب کاربری شوید.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="flex h-12 min-w-[160px] items-center justify-center rounded-2xl bg-accent px-6 font-extrabold text-black"
              >
                ورود
              </button>
              <Link
                href="/"
                className="flex h-12 min-w-[160px] items-center justify-center rounded-2xl border border-border-input px-6 text-text-secondary"
              >
                بازگشت به خانه
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.username
    : "کاربر";

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-[72px]">
        <Header />

        <div className="relative py-8 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(100vw,900px)] -translate-x-1/2 rounded-full opacity-35 blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(201,173,167,0.2) 0%, rgba(0,0,0,0) 70%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-[1100px]" dir="rtl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-accent">حساب کاربری</p>
                <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                  سلام، {displayName}
                </h1>
              </div>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-xl border border-border-input px-4 py-2 text-sm text-text-secondary hover:text-white"
              >
                بازگشت به صفحه اصلی
              </button>
            </div>

            <div className="app-scroll mb-6 flex gap-2 overflow-x-auto overscroll-x-contain pb-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => selectTab(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm transition-colors ${
                      active
                        ? "border-accent/50 bg-cta-pill-bg text-accent"
                        : "border-border-input/40 bg-transparent text-text-secondary hover:text-white"
                    }`}
                  >
                    <Icon size={18} color={active ? "#c9ada7" : "#969696"} variant="Linear" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "info" ? <ProfileInfoSection /> : null}
            {activeTab === "wallet" ? <ProfileWalletSection /> : null}
            {activeTab === "statement" ? <ProfileStatementSection /> : null}
            {activeTab === "reservations" ? <ProfileReservationsSection /> : null}
            {activeTab === "passengers" ? <ProfilePassengersSection /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
