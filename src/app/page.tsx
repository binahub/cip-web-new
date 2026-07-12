import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import ServiceCategoryGrid from "@/components/home/ServiceCategoryGrid";
import LoungeShowcase from "@/components/home/LoungeShowcase";
import BlogTeaser from "@/components/home/BlogTeaser";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-[72px]">
        <Header />
        <Hero />
        <ServiceCategoryGrid />
        <FeatureHighlights />
        <section className="px-0 sm:px-6 py-12">
          <div className="mx-auto flex max-w-[1296px] flex-col items-start gap-6 lg:flex-row">
            <BlogTeaser />
            <LoungeShowcase />
          </div>
        </section>
      </div>
    </div>
  );
}
