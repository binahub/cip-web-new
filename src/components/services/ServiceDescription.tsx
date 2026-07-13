import type { ServiceDescriptionSection } from "@/data/services";

interface ServiceDescriptionProps {
  aboutTitle: string;
  aboutIntro: string[];
  sections: ServiceDescriptionSection[];
}

export default function ServiceDescription({
  aboutTitle,
  aboutIntro,
  sections,
}: ServiceDescriptionProps) {
  return (
    <section className="w-full text-right" dir="rtl">
      {/* Figma: Yekan Bakh Black 32px, white */}
      <h1 className="text-right text-[22px] font-black leading-[1.918] text-white sm:text-[32px]">
        {aboutTitle}
      </h1>

      {/* Figma: Regular 14px, #7d7d7d */}
      <div className="mt-4 space-y-4 text-sm font-normal leading-[1.918] text-service-body">
        {aboutIntro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            {/* Figma: Bold 15–16px, white */}
            <h2 className="mb-2 text-[15px] font-bold leading-[1.918] text-white sm:text-base">
              {section.title}
            </h2>
            <ul className="space-y-0 text-sm font-normal leading-[1.918] text-service-body">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
