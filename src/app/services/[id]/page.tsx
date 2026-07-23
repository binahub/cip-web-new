import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import ServiceDetailContainer from "@/components/services/ServiceDetailContainer";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `جزئیات خدمت ${id} | Mehrabad CIP Lounge`,
    description: "جزئیات خدمات تشریفات فرودگاه مهرآباد",
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-[72px]">
        <Header />
        <ServiceDetailContainer id={id} />
      </div>
    </div>
  );
}
