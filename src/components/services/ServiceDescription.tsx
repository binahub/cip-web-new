import type { ServiceDetailExtraInfoView } from "@/services/main-services/main-services.types";

interface ServiceDescriptionProps {
  aboutTitle: string;
  extraInfo: ServiceDetailExtraInfoView[];
}

export default function ServiceDescription({
  aboutTitle,
  extraInfo,
}: ServiceDescriptionProps) {
  return (
    <section className="w-full text-right" dir="rtl">
      <h1 className="text-right text-[22px] font-black leading-[1.918] text-white sm:text-[32px]">
        {aboutTitle}
      </h1>

      {extraInfo.length > 0 ? (
        <div className="mt-6 space-y-6">
          {extraInfo.map((item) => (
            <div key={item.id}>
              <h2 className="mb-2 text-[15px] font-bold leading-[1.918] text-white sm:text-base">
                {item.title}
              </h2>
              <p className="text-sm font-normal leading-[1.918] text-service-body">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
