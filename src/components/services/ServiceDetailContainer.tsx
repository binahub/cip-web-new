"use client";

import { notFound } from "next/navigation";
import ServiceDetailView from "./ServiceDetailView";
import Spinner from "@/components/ui/Spinner";
import { useMainServiceDetail } from "@/services/main-services/main-services.queries";

interface ServiceDetailContainerProps {
  id: string;
}

export default function ServiceDetailContainer({ id }: ServiceDetailContainerProps) {
  const { data: service, isPending, error } = useMainServiceDetail(id);

  if (isPending) {
    return <Spinner className="py-24" />;
  }

  if (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status?: unknown }).status)
        : 0;

    if (status === 404) {
      notFound();
    }

    return (
      <p className="py-24 text-center text-white/70" dir="rtl">
        امکان نمایش جزئیات این خدمت وجود ندارد.
      </p>
    );
  }

  if (!service || service.status !== "ACTIVE") {
    notFound();
  }

  return <ServiceDetailView service={service} />;
}
