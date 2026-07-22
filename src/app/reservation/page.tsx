import type { Metadata } from "next";
import { Suspense } from "react";
import ReservationWizard from "@/components/reservation/ReservationWizard";
import Spinner from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "رزرو CIP | Mehrabad CIP Lounge",
  description: "ثبت سفارش و رزرو خدمات سی‌آی‌پی فرودگاه مهرآباد",
};

export default function ReservationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg">
          <Spinner />
        </div>
      }
    >
      <ReservationWizard />
    </Suspense>
  );
}
