import ServiceCard from "./ServiceCard";
import { getServiceCards } from "@/data/services";

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
  const services = getServiceCards();
  // Only meaningful when the final row has exactly 1 leftover card at a given
  // breakpoint's column count. With 7 items this is true at both sm (2 cols,
  // remainder 1) and lg (3 cols, remainder 1).
  const isLastItemAlone = services.length % 3 === 1;

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
      <section className="mt-10 px-4 sm:px-6 pb-12">
        <div className="mx-auto max-w-[1296px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const isLast = index === services.length - 1;
              const centerAlone = isLast && isLastItemAlone;

              return (
                <div
                  key={service.id}
                  className={
                    centerAlone
                      ? "flex justify-center sm:col-span-2 lg:col-span-3"
                      : undefined
                  }
                >
                  <div className={centerAlone ? "w-full lg:max-w-[416px]" : "w-full"}>
                    <ServiceCard
                      id={service.id}
                      title={service.title}
                      price={service.price}
                      imageUrl={service.imageUrl}
                      imagePosition={service.imagePosition}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
