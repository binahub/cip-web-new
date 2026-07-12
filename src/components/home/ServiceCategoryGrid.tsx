import ServiceCard from "./ServiceCard";

const services = [
  { 
    title: "لانژ اضافه مسافران", 
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-lounge-extra-passengers.jpg"
  },
  { 
    title: "صندلی چرخدار و بالابر", 
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-wheelchair-lift.jpg"
  },
  { 
    title: "خدمات تشریفات", 
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-vip-services.jpg"
  },
  { 
    title: "مشایعت کننده", 
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-farewell-companion.jpg"
  },
  { 
    title: "پارکینگ مسقف اختصاصی", 
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-covered-parking.jpg"
  },
  { 
    title: "لانژ ویژه کادر پرواز", 
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-crew-lounge.jpg"
  },
  { 
    title: "سوئیت اختصاصی", 
    price: "۲۳,۱۰۰,۰۰۰",
    imageUrl: "/images/home/service-exclusive-suite.jpg"
  },
];

export default function ServiceCategoryGrid() {
  return (
    <section className="px-4 sm:px-6 py-8 sm:py-12">
      <div className="mx-auto max-w-[1296px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
  );
}
