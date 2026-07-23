import type { ServiceDetailExtraInfoView } from "@/services/main-services/main-services.types";

interface ServiceDescriptionProps {
  aboutTitle: string;
  extraInfo: ServiceDetailExtraInfoView[];
}

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const htmlContentClassName =
  "text-sm font-normal leading-[1.918] text-service-body break-words " +
  "[&_pre]:m-0 [&_pre]:whitespace-pre-wrap [&_pre]:font-[inherit] [&_pre]:bg-transparent [&_pre]:p-0 " +
  "[&_p]:m-0 [&_p+p]:mt-3 " +
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pr-5 " +
  "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pr-5 " +
  "[&_li]:my-1";

function ExtraInfoContent({ content }: { content: string }) {
  if (HTML_TAG_PATTERN.test(content)) {
    return (
      <div
        className={htmlContentClassName}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <p className="whitespace-pre-line text-sm font-normal leading-[1.918] text-service-body">
      {content}
    </p>
  );
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
              <ExtraInfoContent content={item.content} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
