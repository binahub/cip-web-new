import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "لانژ اضافه مسافران",
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-lounge-extra-passengers.jpg",
  },
  {
    title: "صندلی چرخدار و بالابر",
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-wheelchair-lift.jpg",
  },
  {
    title: "خدمات تشریفات",
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-vip-services.jpg",
  },
  {
    title: "مشایعت کننده",
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-farewell-companion.jpg",
  },
  {
    title: "پارکینگ مسقف اختصاصی",
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-covered-parking.jpg",
  },
  {
    title: "لانژ ویژه کادر پرواز",
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-crew-lounge.jpg",
  },
  {
    title: "سوئیت اختصاصی",
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-exclusive-suite.jpg",
  },
];

function TitleDecoration() {
  return (
    <div className="hidden lg:flex items-center gap-[54px]" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <img key={i} src="/icons/title-decoration.svg" alt="" className="h-[42px] w-[30px]" />
      ))}
    </div>
  );
}

export default function ServiceCategoryGrid() {
  return (
    <>
      {/* Section title with decorative vectors */}
      <div className="flex items-center justify-center gap-10 lg:gap-20">
        <TitleDecoration />
        <h2 className="text-center text-lg sm:text-2xl font-bold text-white whitespace-nowrap">
          خدمات جایگاه تشریفات
        </h2>
        <TitleDecoration />
      </div>
      <section className="px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-[1296px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                price={service.price}
                imageUrl={service.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
