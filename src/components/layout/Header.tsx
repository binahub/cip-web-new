import Image from "next/image";
import { User, ArrowDown } from "iconsax-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-[1296px] rounded-2xl bg-header-bg backdrop-blur-md">
      <div className="flex h-[72px] items-center justify-between px-6">
        {/* Brand wordmark + logomark */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo/logo-mark.svg"
            alt="Mehrabad CIP Lounge Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-['Kavo_Serif:Black_Styled'] text-sm text-text-hero">mehrabad</span>
            <span className="font-['Kavo_Serif:Light_Styled'] text-sm text-text-hero">CIP lounge</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-6">
          <a href="#" className="text-base font-normal text-text-nav hover:text-white transition-colors">
            وبلاگ
          </a>
          <div className="flex items-center gap-1">
            <a href="#" className="text-base font-normal text-text-nav hover:text-white transition-colors">
              خدمات
            </a>
            <ArrowDown size={16} color="#979dac" variant="Linear" />
          </div>
          <div className="h-6 w-px bg-border-input/30" />
        </nav>

        {/* Login pill */}
        <button className="flex items-center gap-2 rounded-xl bg-login-pill-bg px-4 py-2 text-sm font-semibold text-accent transition-colors hover:opacity-80">
          <User size={18} color="#c9ada7" variant="Bulk" />
          <span>ورود | ثبت نام</span>
        </button>
      </div>
    </header>
  );
}
