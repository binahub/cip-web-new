import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import ServiceDetailView from "@/components/services/ServiceDetailView";
import { getServiceById, services } from "@/data/services";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    return { title: "خدمت یافت نشد" };
  }

  return {
    title: `${service.cardTitle} | Mehrabad CIP Lounge`,
    description: service.aboutIntro[0],
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-[72px]">
        <Header />
        <ServiceDetailView service={service} />
      </div>
    </div>
  );
}
