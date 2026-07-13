"use client";

import { useState } from "react";
import Image from "next/image";
import { User, ArrowDown2, Menu, CloseSquare } from "iconsax-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-[1296px] rounded-2xl bg-header-bg backdrop-blur-md">
      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6">
        {/* Brand wordmark + logomark + nav links */}
        <div className="flex items-center gap-2 sm:gap-3">
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

        {/* left side: Login pill + mobile menu toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden sm:flex items-center gap-2 rounded-xl bg-login-pill-bg px-4 py-2 text-sm font-semibold text-accent transition-colors hover:opacity-80">
            <User size={18} color="#c9ada7" variant="Bulk" />
            <span>ورود | ثبت نام</span>
          </button>
          <button className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-login-pill-bg transition-colors hover:opacity-80">
            <User size={20} color="#c9ada7" variant="Bulk" />
          </button>

          {/* Mobile menu toggle */}
          <button
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

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
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
      )}
    </header>
  );
}
