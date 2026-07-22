import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { AuthProvider } from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const yekanBakh = localFont({
  src: [
    { path: "../../public/fonts/yekan-bakh/YekanBakhFaNum-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/yekan-bakh/YekanBakhFaNum-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/yekan-bakh/YekanBakhFaNum-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/yekan-bakh/YekanBakhFaNum-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-yekan-bakh-local",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مهرآباد CIP lounge",
  description: "سی آی پی فرودگاه مهرآباد",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      dir="rtl"
      lang="fa"
      className={`${geistSans.variable} ${geistMono.variable} ${yekanBakh.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <QueryProvider>
          <AuthProvider>
            <main className="flex-1 overflow-x-hidden">{children}</main>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
