"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

interface ServiceImageSliderProps {
  images: string[];
  alt: string;
}

export default function ServiceImageSlider({ images, alt }: ServiceImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  const prevIndex = (activeIndex - 1 + images.length) % images.length;
  const nextIndex = (activeIndex + 1) % images.length;

  return (
    <div className="relative mx-auto w-full max-w-[711px]">
      <div className="relative flex h-[220px] items-center justify-center sm:h-[291px]">
        {/* Previous peek — desktop only */}
        <button
          type="button"
          aria-label="تصویر قبلی"
          onClick={() => setActiveIndex(prevIndex)}
          className="absolute left-0 top-1/2 z-0 hidden h-[190px] w-[100px] -translate-y-1/2 overflow-hidden rounded-lg sm:block lg:h-[235px] lg:w-[134px]"
        >
          <Image
            src={images[prevIndex]}
            alt=""
            fill
            className="object-cover"
            sizes="134px"
          />
          <div className="absolute inset-0 bg-[#0d1012]/70" />
        </button>

        {/* Active slide */}
        <div className="relative z-10 h-full w-full overflow-hidden rounded-lg sm:w-[min(100%,529px)]">
          <Image
            src={images[activeIndex]}
            alt={alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 529px"
          />

          {/* Mobile arrow controls */}
          <div className="absolute inset-y-0 inset-x-0 z-20 flex items-center justify-between px-2 sm:hidden">
            <button
              type="button"
              aria-label="تصویر بعدی"
              onClick={() => setActiveIndex(nextIndex)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
            >
              <ArrowRight2 size={20} color="#ffffff" variant="Linear" />
            </button>
            <button
              type="button"
              aria-label="تصویر قبلی"
              onClick={() => setActiveIndex(prevIndex)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
            >
              <ArrowLeft2 size={20} color="#ffffff" variant="Linear" />
            </button>
          </div>
        </div>

        {/* Next peek — desktop only */}
        <button
          type="button"
          aria-label="تصویر بعدی"
          onClick={() => setActiveIndex(nextIndex)}
          className="absolute right-0 top-1/2 z-0 hidden h-[190px] w-[100px] -translate-y-1/2 overflow-hidden rounded-lg sm:block lg:h-[235px] lg:w-[134px]"
        >
          <Image
            src={images[nextIndex]}
            alt=""
            fill
            className="object-cover"
            sizes="134px"
          />
          <div className="absolute inset-0 bg-[#0d1012]/70" />
        </button>
      </div>

      {/* Dots — all breakpoints */}
      <div className="mt-4 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`اسلاید ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-4 bg-accent" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
