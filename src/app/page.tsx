import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import ServiceCategoryGrid from "@/components/home/ServiceCategoryGrid";
import LoungeShowcase from "@/components/home/LoungeShowcase";
import BlogTeaser from "@/components/home/BlogTeaser";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[1440px] px-[72px]">
        <Header />
        <Hero />
        <FeatureHighlights />
        <ServiceCategoryGrid />
        <LoungeShowcase />
        <BlogTeaser />
      </div>
    </div>
  );
}
