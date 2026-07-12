import ServiceCard from "./ServiceCard";

const services = [
  { title: "لانژ اضافه مسافران", price: "۲۳,۱۰۰,۰۰۰" },
  { title: "صندلی چرخدار و بالابر", price: "۲۳,۱۰۰,۰۰۰" },
  { title: "خدمات تشریفات", price: "۲۳,۱۰۰,۰۰۰" },
  { title: "مشایعت کننده", price: "۲۳,۱۰۰,۰۰۰" },
  { title: "پارکینگ مسقف اختصاصی", price: "۲۳,۱۰۰,۰۰۰" },
  { title: "لانژ ویژه کادر پرواز", price: "۲۳,۱۰۰,۰۰۰" },
];

export default function ServiceCategoryGrid() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-[1296px]">
        <div className="grid grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              price={service.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
