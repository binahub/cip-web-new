import { Shield, Headphone, Microscope } from "iconsax-react";

const features = [
  {
    icon: <Shield size={32} color="#c9ada7" variant="Bulk" />,
    title: "آرامش قبل از پرواز",
    description:
      "در سالن اختصاصی استراحت کنید و پذیرایی شوید؛ دریافت کارت پرواز و ترانسفر تا پای هواپیما با ما.",
  },
  {
    icon: <Headphone size={32} color="#c9ada7" variant="Bulk" />,
    title: "VIP سفر کنید",
    description:
      "بدون صف و شلوغی از گیت اختصاصی عبور کنید و با خودروی تشریفاتی تا پای پلکان هواپیما بروید.",
  },
  {
    icon: <Microscope size={32} color="#c9ada7" variant="Bulk" />,
    title: "پرواز بدون معطلی",
    description:
      "صفر تا صد امور پروازی (بار و کارت پرواز) توسط تیم ما؛ شما فقط از بوفه و اینترنت لذت ببرید.",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto flex max-w-[1296px] gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="relative flex-1 rounded-3xl bg-card-bg-subtle p-6"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              {feature.title}
            </h3>
            <p className="w-[280px] text-sm leading-[1.808] text-text-secondary">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
