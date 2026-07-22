import type { Metadata } from "next";
import ProfilePageClient from "@/components/profile/ProfilePageClient";

export const metadata: Metadata = {
  title: "پروفایل | Mehrabad CIP Lounge",
  description: "مدیریت حساب کاربری، کیف پول، رزروها و مسافران",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
