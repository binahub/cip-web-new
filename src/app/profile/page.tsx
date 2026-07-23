import type { Metadata } from "next";
import { Suspense } from "react";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import Spinner from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "پروفایل | Mehrabad CIP Lounge",
  description: "مدیریت حساب کاربری، کیف پول، رزروها و مسافران",
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg">
          <Spinner />
        </div>
      }
    >
      <ProfilePageClient />
    </Suspense>
  );
}
