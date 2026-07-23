"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import ReservationStepper from "@/components/reservation/ReservationStepper";
import StepConfirmCounts from "@/components/reservation/steps/StepConfirmCounts";
import StepFlightInfo from "@/components/reservation/steps/StepFlightInfo";
import StepPassengers from "@/components/reservation/steps/StepPassengers";
import StepPayment from "@/components/reservation/steps/StepPayment";
import StepServices from "@/components/reservation/steps/StepServices";
import Spinner from "@/components/ui/Spinner";
import { toastSuccess } from "@/lib/toast";
import { useAuth } from "@/providers/auth-provider";
import type {
  FinalizedReservation,
  ReservationDraft,
} from "@/services/reservation/reservation.types";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function ReservationWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isClient = useIsClient();
  const { isAuthenticated, openAuthModal } = useAuth();

  const initialServiceId = searchParams.get("serviceId") ?? "";
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ReservationDraft | null>(null);
  const [primaryServiceId, setPrimaryServiceId] = useState(initialServiceId);
  const [completed, setCompleted] = useState<FinalizedReservation | null>(null);

  useEffect(() => {
    if (!isClient) return;
    if (!isAuthenticated) {
      openAuthModal("login");
    }
  }, [isClient, isAuthenticated, openAuthModal]);

  useEffect(() => {
    if (initialServiceId) setPrimaryServiceId(initialServiceId);
  }, [initialServiceId]);

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
              برای شروع رزرو ابتدا وارد حساب کاربری شوید.
            </p>
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="mt-6 inline-flex h-12 min-w-[160px] items-center justify-center rounded-2xl bg-accent px-6 font-extrabold text-black"
            >
              ورود
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-bg">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-[72px]">
          <Header />
          <div className="mx-auto max-w-xl py-16 text-center" dir="rtl">
            <div className="rounded-[24px] border border-accent/40 bg-service-detail-card p-8">
              <p className="text-sm text-accent">رزرو با موفقیت ثبت شد</p>
              <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                {completed.reservationNumber}
              </h1>
              <p className="mt-3 text-text-secondary">
                وضعیت: {completed.currentStatus} · پرداخت: {completed.paymentStatus}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/profile?tab=reservations"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-accent px-6 font-extrabold text-black"
                >
                  مشاهده رزروها
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-border-input px-6 text-text-secondary"
                >
                  بازگشت به خانه
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          <div className="relative z-10 mx-auto max-w-[1100px] space-y-8" dir="rtl">
            <div className="relative px-12 text-center sm:px-16">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="absolute left-0 top-1 text-sm text-text-secondary transition-colors hover:text-white"
              >
                انصراف
              </button>
              <p className="text-sm text-accent">ثبت سفارش</p>
              <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                رزرو خدمات CIP
              </h1>
            </div>

            <ReservationStepper currentStep={step} />

            <div className="rounded-[24px] border border-border-input/30 bg-service-detail-card p-4 sm:p-6">
              {step === 1 ? (
                <StepFlightInfo
                  initialServiceId={primaryServiceId}
                  onSuccess={(nextDraft, selectedServiceId) => {
                    setDraft(nextDraft);
                    setPrimaryServiceId(
                      selectedServiceId ||
                        String(nextDraft.services[0]?.mainServiceId ?? ""),
                    );
                    setStep(2);
                  }}
                />
              ) : null}

              {step === 2 && draft ? (
                <StepConfirmCounts
                  draft={draft}
                  primaryServiceId={primaryServiceId}
                  onBack={() => setStep(1)}
                  onDraftUpdate={setDraft}
                  onSuccess={(nextDraft, serviceId) => {
                    setDraft(nextDraft);
                    setPrimaryServiceId(serviceId);
                    setStep(3);
                  }}
                />
              ) : null}

              {step === 3 && draft ? (
                <StepPassengers
                  draft={draft}
                  onBack={() => setStep(2)}
                  onSuccess={(nextDraft) => {
                    setDraft(nextDraft);
                    setStep(4);
                  }}
                />
              ) : null}

              {step === 4 && draft ? (
                <StepServices
                  draft={draft}
                  onBack={() => setStep(3)}
                  onSuccess={(nextDraft) => {
                    setDraft(nextDraft);
                    setStep(5);
                  }}
                />
              ) : null}

              {step === 5 && draft ? (
                <StepPayment
                  draft={draft}
                  onBack={() => setStep(4)}
                  onDraftUpdate={setDraft}
                  onSuccess={(reservation) => {
                    toastSuccess("رزرو با موفقیت نهایی شد.");
                    setCompleted(reservation);
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
