import type { ServiceFeature } from "@/data/services";

interface ServiceFeaturesProps {
  address: string;
  features: ServiceFeature[];
}

function FeatureChip({ label, icon }: { label: string; icon: string }) {
  return (
    <div
      className="flex min-h-10 items-center justify-end gap-2 rounded-xl bg-service-chip-bg px-3 py-2 sm:px-4"
      dir="ltr"
    >
      <span
        className="min-w-0 text-right text-xs font-normal tracking-[0.1px] text-white sm:text-sm"
        dir="rtl"
      >
        {label}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" width={24} height={24} className="size-6 shrink-0 object-contain" />
    </div>
  );
}

export default function ServiceFeatures({ address, features }: ServiceFeaturesProps) {
  return (
    <section className="w-full" dir="rtl">
      <h2 className="mb-4 text-right text-base font-bold tracking-[0.1px] text-white">
        ویژگی ها
      </h2>

      <div className="flex flex-col gap-4">
        <FeatureChip label={address} icon="/icons/features/location.svg" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureChip key={feature.id} label={feature.label} icon={feature.icon} />
          ))}
        </div>
      </div>
    </section>
  );
}
