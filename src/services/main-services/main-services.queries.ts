import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api-client";
import type { CipApiResponse } from "@/types";
import type {
  ActiveMainServiceSummaryItem,
  ActiveMainServicesSummaryData,
  ServiceCardViewModel,
} from "./main-services.types";
import { formatPrice } from "@/lib/format";

export const mainServiceKeys = {
  all: ["main-services"] as const,
  activeSummary: () => [...mainServiceKeys.all, "active-summary"] as const,
};

const FALLBACK_CARD_IMAGE = "/images/home/service-vip-services.svg";

function resolveImageUrl(item: ActiveMainServiceSummaryItem): string {
  const image = item.mainImage;
  if (!image) return FALLBACK_CARD_IMAGE;
  if (image.isMainImage && image.cdnImage) return image.cdnImage;
  return image.localImage || image.cdnImage || FALLBACK_CARD_IMAGE;
}

export function mapActiveSummaryToServiceCards(
  items: ActiveMainServiceSummaryItem[],
): ServiceCardViewModel[] {
  return items
    .filter((item) => item.mainService.status === "ACTIVE")
    .map((item) => ({
      id: item.mainService.id,
      title: item.mainService.name,
      price: formatPrice(item.minPrice.price),
      imageUrl: resolveImageUrl(item),
      isMainService: item.mainService.isMainService,
      // imagePosition stays undefined so ServiceCard uses its design default
    }));
}

async function fetchActiveMainServicesSummary(): Promise<ServiceCardViewModel[]> {
  const { data } = await apiClient.get<CipApiResponse<ActiveMainServicesSummaryData>>(
    "/main-services/active-summary",
    { skipAuth: true },
  );

  return mapActiveSummaryToServiceCards(data.data?.list ?? []);
}

export function useActiveMainServices() {
  return useQuery<ServiceCardViewModel[]>({
    queryKey: mainServiceKeys.activeSummary(),
    queryFn: fetchActiveMainServicesSummary,
  });
}
