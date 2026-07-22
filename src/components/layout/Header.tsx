"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, ArrowDown2, Menu, CloseSquare, LogoutCurve } from "iconsax-react";
import { useAuth } from "@/providers/auth-provider";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.username
    : "";

  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-[1296px] rounded-2xl bg-header-bg backdrop-blur-md">
      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/logo/logo-mark.svg"
              alt="Mehrabad CIP Lounge Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <Image
              src="/cip-lounge-text-header.svg"
              alt="Mehrabad CIP Lounge"
              width={104}
              height={24}
              className="h-[16px] sm:h-[24px] w-auto"
            />
          </Link>
          <div className="hidden md:block h-6 w-px bg-border-input/30 ml-2" />
          <nav className="hidden md:flex items-center gap-6 ml-2">
            <div className="flex items-center gap-1">
              <a
                href="#"
                className="text-base font-normal text-text-nav hover:text-white transition-colors"
              >
                خدمات
              </a>
              <ArrowDown2 size={16} color="#979dac" variant="Linear" />
            </div>
            <a
              href="#"
              className="text-base font-normal text-text-nav hover:text-white transition-colors"
            >
              وبلاگ
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((prev) => !prev)}
                className="hidden sm:flex items-center gap-2 rounded-xl bg-login-pill-bg px-4 py-2 text-sm font-semibold text-accent transition-colors hover:opacity-80"
              >
                <User size={18} color="#c9ada7" variant="Bulk" />
                <span className="max-w-[140px] truncate">{displayName}</span>
                <ArrowDown2 size={14} color="#c9ada7" variant="Linear" />
              </button>
              <button
                type="button"
                onClick={() => setAccountOpen((prev) => !prev)}
                className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-login-pill-bg transition-colors hover:opacity-80"
                aria-label="حساب کاربری"
              >
                <User size={20} color="#c9ada7" variant="Bulk" />
              </button>

              {accountOpen ? (
                <div className="absolute left-0 top-full z-[120] mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-border-input bg-dropdown-bg py-2 shadow-2xl">
                  <div className="px-4 py-2 text-right text-xs text-text-secondary sm:hidden">
                    {displayName}
                  </div>
                  <button
                    type="button"
                    dir="rtl"
                    onClick={() => {
                      setAccountOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center justify-end gap-2 px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-cta-pill-bg hover:text-accent"
                  >
                    <span>خروج</span>
                    <LogoutCurve size={18} color="#c9ada7" variant="Linear" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="hidden sm:flex items-center gap-2 rounded-xl bg-login-pill-bg px-4 py-2 text-sm font-semibold text-accent transition-colors hover:opacity-80"
              >
                <User size={18} color="#c9ada7" variant="Bulk" />
                <span>ورود | ثبت نام</span>
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-login-pill-bg transition-colors hover:opacity-80"
                aria-label="ورود یا ثبت نام"
              >
                <User size={20} color="#c9ada7" variant="Bulk" />
              </button>
            </>
          )}

          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-card-bg-subtle transition-colors hover:opacity-80"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <CloseSquare size={20} color="#979dac" variant="Linear" />
            ) : (
              <Menu size={20} color="#979dac" variant="Linear" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="md:hidden border-t border-border-input/20 px-4 py-4">
          <nav className="flex flex-col gap-4">
            <a
              href="#"
              className="text-base font-normal text-text-nav hover:text-white transition-colors"
            >
              وبلاگ
            </a>
            <a
              href="#"
              className="text-base font-normal text-text-nav hover:text-white transition-colors"
            >
              خدمات
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
