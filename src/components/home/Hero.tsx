import Image from "next/image";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 pt-6 sm:pt-8 pb-10 sm:pb-16">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/home/hero-glow-primary.png"
          alt=""
          fill
          className="object-cover opacity-30"
        />
        <Image
          src="/images/home/hero-glow-secondary.png"
          alt=""
          fill
          className="object-cover opacity-30"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1296px]">
        {/* Brand heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          {/* Logomark */}
          <Image
            src="/logo/logo-mark.svg"
            alt="Mehrabad CIP Lounge Logo"
            width={76}
            height={77}
            className="mb-2 object-contain w-[50px] h-[51px] sm:w-[76px] sm:h-[77px]"
          />
          <h1 className="font-['Kavo_Serif:Black_Styled'] text-2xl sm:text-[32px] leading-[1.808] text-text-hero">
            mehrabad CIP lounge
          </h1>
          <p className="font-['Rokh:Medium'] text-base sm:text-[20px] leading-[1.808] text-text-hero">
            سی آی پی فرودگاه مهرآباد
          </p>
        </div>

        <SearchBar />
      </div>
    </section>
  );
}
