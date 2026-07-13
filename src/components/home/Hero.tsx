import Image from "next/image";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative px-4 sm:px-6 pt-6 sm:pt-8 pb-10 sm:pb-16">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
          <Image
            src="/cip-lounge-text-wide.svg"
            alt="Mehrabad CIP Lounge"
            width={435}
            height={23}
            className="w-[250px] sm:w-[435px] h-auto"
          />
          <Image
            src="/cip-mehr-farsi-text.svg"
            alt="سی آی پی فرودگاه مهرآباد"
            width={181}
            height={21}
            className="w-[120px] sm:w-[181px] h-auto"
          />
        </div>

        <SearchBar />
      </div>
    </section>
  );
}
