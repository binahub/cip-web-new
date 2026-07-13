export type ServiceFeature = {
  id: string;
  label: string;
  icon: string;
};

export type ServicePriceBreakdown = {
  label: string;
  value: string;
};

export type ServicePricingTier = {
  title: string;
  subtitle: string;
  totalPrice: string;
  currency: string;
  note: string;
  mapImage: string;
  ctaLabel: string;
  breakdown: ServicePriceBreakdown[];
};

export type ServiceDescriptionSection = {
  title: string;
  items: string[];
};

export type ServiceDetail = {
  id: string;
  title: string;
  cardTitle: string;
  priceFrom: string;
  cardImageUrl: string;
  imagePosition?: string;
  images: string[];
  aboutTitle: string;
  aboutIntro: string[];
  descriptionSections: ServiceDescriptionSection[];
  address: string;
  features: ServiceFeature[];
  pricing: {
    iranian: ServicePricingTier;
    foreign: ServicePricingTier;
  };
  rulesTitle: string;
  rules: string[];
};

const sharedFeatures: ServiceFeature[] = [
  { id: "airport", label: "فرودگاه مهرآباد تهران", icon: "/icons/features/airport.svg" },
  { id: "food", label: "غذا و نوشیدنی", icon: "/icons/features/food.svg" },
  { id: "gate", label: "گیت اختصاصی سپاه", icon: "/icons/features/gate.svg" },
  { id: "sofa", label: "صندلی راحتی و کاناپه", icon: "/icons/features/sofa.svg" },
  { id: "mother-child", label: "اتاق مادر و کودک", icon: "/icons/features/mother-child.svg" },
  { id: "time", label: "زمان استفاده : ۳ ساعت", icon: "/icons/features/time.svg" },
  { id: "identity", label: "احراز هویت", icon: "/icons/features/identity.svg" },
  { id: "transfer", label: "حمل تا پرواز", icon: "/icons/features/transfer.svg" },
  { id: "capacity", label: "ظرفیت باقیمانده : ۱۰۰ نفر", icon: "/icons/features/capacity.svg" },
  { id: "meeting", label: "جلسات", icon: "/icons/features/meeting.svg" },
  { id: "hot-drink", label: "نوشیدنی گرم", icon: "/icons/features/hot-drink.svg" },
  { id: "boarding-pass", label: "کارت پرواز", icon: "/icons/features/boarding-pass.svg" },
  { id: "wheelchair", label: "صندلی چرخدار", icon: "/icons/features/wheelchair.svg" },
  { id: "wifi", label: "وای فای", icon: "/icons/features/wifi.svg" },
  { id: "luggage", label: "خدمات نگهداری چمدان", icon: "/icons/features/luggage.svg" },
  { id: "hospitality", label: "پذیرایی", icon: "/icons/features/hospitality.svg" },
  { id: "flight-info", label: "اطلاعات پرواز", icon: "/icons/features/flight-info.svg" },
  { id: "smoking", label: "اتاق سیگار", icon: "/icons/features/smoking.svg" },
];

const sharedAboutIntro = [
  "سالن تشریفات اختصاصی (CIP) فضایی آرام و مجهز برای پذیرایی و رفاه مسافران گرامی است. کلیه امور مربوط به پرواز توسط تیم تشریفاتی انجام می‌شود و مسافران بدون حضور در سالن‌های عمومی، خدمات کامل دریافت می‌کنند.",
  "مسافر ۳ ساعت قبل از پرواز می‌تواند حضور داشته باشد و ۱٫۵ ساعت قبل از پرواز حتماً باید حضور داشته باشد؛ قبل از بسته شدن گیت.",
];

const sharedDescriptionSections: ServiceDescriptionSection[] = [
  {
    title: "امکانات و خدمات CIP مسافران خروجی:",
    items: [
      "استقبال و همراهی: راهنمایی و استقبال از مسافر در ورودی سالن CIP",
      "پذیرش بار: تحویل بار توسط پرسنل CIP و صدور بارنامه / تگ بار",
      "چک‌این اختصاصی: دریافت کارت پرواز بدون نیاز به حضور در سالن عمومی",
      "کنترل گذرنامه و گیت امنیتی اختصاصی",
      "پذیرایی ویژه: نوشیدنی گرم و سرد / میان‌وعده / ناهار یا شام سفارشی (Order)",
      "امکانات رفاهی: محیطی آرام / اینترنت / تلویزیون / مطبوعات / فضای استراحت / پیانو",
      "ترانسفر اختصاصی: انتقال با خودرو لوکس تا پای پلکان هواپیما",
    ],
  },
  {
    title: "امکانات و خدمات CIP مسافران ورودی:",
    items: [
      "استقبال در پاویون: همراهی مسافر از پای پلکان هواپیما",
      "ترانسفر VIP: انتقال اختصاصی به سالن CIP",
      "تحویل بار: دریافت و جابجایی بار توسط پرسنل CIP از X-RAY",
      "امور گذرنامه و گمرک: انجام تشریفات پاسپورت و گمرک در فضای اختصاصی",
      "پذیرایی: نوشیدنی گرم و سرد / میان‌وعده / ناهار یا شام سفارشی (Order)",
      "امکانات رفاهی: سالن آرام / اینترنت / تلویزیون / مطبوعات / فضای استراحت",
      "تحویل نهایی بار و بدرقه: تحویل بار به مسافر در سالن و همراهی تا درب خروجی سالن فرودگاه انجام می‌شود.",
    ],
  },
];

const sharedRules = [
  "جریمه کنسلی از لحظه صدور تا ۳ ساعت مانده به پرواز: ۰ درصد",
  "جریمه کنسلی از ۳ ساعت مانده به پرواز به بعد: ۱۰۰ درصد",
];

const iranianPricing: ServicePricingTier = {
  title: "مسافران ایرانی",
  subtitle: "قیمت خدمات برای مسافران ایرانی",
  totalPrice: "۷۸,۱۰۰,۰۰۰",
  currency: "ریال",
  note: "هزینه خدمات برای کودکان زیر ۲ سال رایگان میباشد",
  mapImage: "/images/services/iran-map.svg",
  ctaLabel: "شروع سفارش",
  breakdown: [
    { label: "رده سنی", value: "بالای ۱۲ سال" },
    { label: "نرخ پایه", value: "۷۱,۰۰۰,۰۰۰ ریال" },
    { label: "مالیات", value: "۱۰ درصد" },
    { label: "سهم هر نفر", value: "۷۸,۱۰۰,۰۰۰ ریال" },
    { label: "تعداد نفرات", value: "۱ نفر" },
  ],
};

const foreignPricing: ServicePricingTier = {
  title: "مسافران غیر ایرانی",
  subtitle: "قیمت خدمات برای مسافران غیر ایرانی",
  totalPrice: "۱۱۷,۱۵۰,۰۰۰",
  currency: "ریال",
  note: "هزینه خدمات برای کودکان زیر ۲ سال رایگان میباشد",
  mapImage: "/images/services/world-map.svg",
  ctaLabel: "شروع سفارش",
  breakdown: [
    { label: "رده سنی", value: "بالای ۱۲ سال" },
    { label: "نرخ پایه", value: "۱۰۶,۵۰۰,۰۰۰ ریال" },
    { label: "مالیات", value: "۱۰ درصد" },
    { label: "سهم هر نفر", value: "۱۱۷,۱۵۰,۰۰۰ ریال" },
    { label: "تعداد نفرات", value: "۱ نفر" },
  ],
};

const galleryImages = [
  "/images/services/lounge-1.jpg",
  "/images/services/lounge-2.jpg",
  "/images/services/lounge-3.jpg",
];

function createService(partial: {
  id: string;
  cardTitle: string;
  title: string;
  priceFrom: string;
  cardImageUrl: string;
  imagePosition?: string;
}): ServiceDetail {
  return {
    ...partial,
    images: galleryImages,
    aboutTitle: `درباره ${partial.title}`,
    aboutIntro: sharedAboutIntro,
    descriptionSections: sharedDescriptionSections,
    address: "آدرس : سالن سی آی پی در طبقه ی فوقانی ترمینال یک واقع شده است",
    features: sharedFeatures,
    pricing: {
      iranian: iranianPricing,
      foreign: foreignPricing,
    },
    rulesTitle: "قوانین و مقررات",
    rules: sharedRules,
  };
}

export const services: ServiceDetail[] = [
  createService({
    id: "1",
    cardTitle: "لانژ اضافه مسافران",
    title: "خدمات تشریفات CIP Lounge",
    priceFrom: "۲۳,۱۰۰,۰۰۰",
    cardImageUrl: "/images/home/service-lounge-extra-passengers.jpg",
  }),
  createService({
    id: "2",
    cardTitle: "صندلی چرخدار و بالابر",
    title: "خدمات تشریفات CIP Lounge",
    priceFrom: "۲۳,۱۰۰,۰۰۰",
    cardImageUrl: "/images/home/service-wheelchair-lift.jpg",
  }),
  createService({
    id: "3",
    cardTitle: "خدمات تشریفات",
    title: "خدمات تشریفات CIP Lounge",
    priceFrom: "۲۳,۱۰۰,۰۰۰",
    cardImageUrl: "/images/home/service-vip-services.jpg",
  }),
  createService({
    id: "4",
    cardTitle: "مشایعت کننده",
    title: "خدمات تشریفات CIP Lounge",
    priceFrom: "۲۳,۱۰۰,۰۰۰",
    cardImageUrl: "/images/home/service-farewell-companion.jpg",
  }),
  createService({
    id: "5",
    cardTitle: "پارکینگ مسقف اختصاصی",
    title: "خدمات تشریفات CIP Lounge",
    priceFrom: "۲۳,۱۰۰,۰۰۰",
    cardImageUrl: "/images/home/service-covered-parking.jpg",
  }),
  createService({
    id: "6",
    cardTitle: "لانژ ویژه کادر پرواز",
    title: "خدمات تشریفات CIP Lounge",
    priceFrom: "۲۳,۱۰۰,۰۰۰",
    cardImageUrl: "/images/home/service-crew-lounge.jpg",
  }),
  createService({
    id: "7",
    cardTitle: "سوئیت اختصاصی",
    title: "خدمات تشریفات CIP Lounge",
    priceFrom: "۲۳,۱۰۰,۰۰۰",
    cardImageUrl: "/images/home/service-exclusive-suite.jpg",
  }),
];

export function getServiceById(id: string): ServiceDetail | undefined {
  return services.find((service) => service.id === id);
}

export function getServiceCards() {
  return services.map(({ id, cardTitle, priceFrom, cardImageUrl, imagePosition }) => ({
    id,
    title: cardTitle,
    price: priceFrom,
    imageUrl: cardImageUrl,
    imagePosition,
  }));
}
