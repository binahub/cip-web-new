import { Profile2User, Calendar, Location, ArrowDown } from "iconsax-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-8 pb-16">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[446px] -top-[409px] h-[1002px] w-[2366px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute -bottom-[200px] left-[622px] h-[1002px] w-[1183px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1296px]">
        {/* Brand heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          {/* Logomark */}
          <div className="mb-2 flex h-[77px] w-[76px] items-center justify-center rounded-full bg-accent/20">
            {/* TODO: replace with exported logo-mark.svg from Figma */}
            <div className="h-12 w-12 rounded-full bg-accent/60" />
          </div>
          <h1 className="font-['Kavo_Serif:Black_Styled'] text-[32px] leading-[1.808] text-text-hero">
            mehrabad CIP lounge
          </h1>
          <p className="font-['Rokh:Medium'] text-[20px] leading-[1.808] text-text-hero">
            سی آی پی فرودگاه مهرآباد
          </p>
        </div>

        {/* Section title */}
        <h2 className="mt-10 text-center text-2xl font-bold text-white">
          خدمات جایگاه تشریفات
        </h2>

        {/* Search bar */}
        <div className="relative mt-6">
          <div className="flex items-stretch gap-6 rounded-3xl bg-search-card-bg p-4">
            {/* مسافران field */}
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border-input px-4 h-14">
              <span className="text-base text-text-secondary">مسافران</span>
              <Profile2User size={20} color="#969696" variant="Linear" className="mr-auto" />
            </div>

            {/* زمان پرواز | تاریخ پرواز field */}
            <div className="flex flex-1 items-center gap-0 rounded-2xl border border-border-input h-14">
              <span className="flex-1 px-4 text-base text-text-secondary">زمان پرواز</span>
              <div className="h-8 w-px bg-border-input/30" />
              <span className="flex-1 px-4 text-base text-text-secondary">تاریخ پرواز</span>
              <Calendar size={20} color="#969696" variant="Linear" className="ml-2" />
            </div>

            {/* فرودگاه field */}
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border-input px-4 h-14">
              <ArrowDown size={18} color="#969696" variant="Linear" />
              <span className="text-base text-text-secondary">فرودگاه</span>
              <Location size={20} color="#969696" variant="Linear" className="mr-auto" />
            </div>
          </div>

          {/* Accent promo tile */}
          <div className="absolute -left-4 -top-4 flex h-[88px] w-[173px] items-center justify-center rounded-2xl bg-accent">
            <span className="text-base font-extrabold text-black">بررسی خدمات</span>
          </div>
        </div>
      </div>
    </section>
  );
}
