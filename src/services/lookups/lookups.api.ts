import apiClient from "@/services/api-client";
import type { CipApiResponse } from "@/types";
import type { CipPage } from "@/services/customer/customer.types";
import type {
  AgeCategoryItem,
  GenderItem,
  GenderListData,
  LookupListParams,
  NationalityItem,
} from "./lookups.types";

function unwrapData<T>(data: CipApiResponse<T>, fallbackMessage: string): T {
  if (!data.data) {
    throw { message: fallbackMessage, status: 404, errorDetail: data.errorDetail };
  }
  return data.data;
}

const defaultLookupParams = (extra: Record<string, string> = {}): LookupListParams => ({
  parameterMap: {
    id: "",
    name: "",
    page: "0",
    size: "50",
    orderBy: "id",
    sort: "asc",
    ...extra,
  },
});

export async function fetchAgeCategories(): Promise<AgeCategoryItem[]> {
  const { data } = await apiClient.post<CipApiResponse<CipPage<AgeCategoryItem>>>(
    "/age-category/list",
    defaultLookupParams(),
  );
  return unwrapData(data, "دریافت رده‌های سنی ناموفق بود.").list ?? [];
}

export async function fetchNationalities(): Promise<NationalityItem[]> {
  const { data } = await apiClient.post<CipApiResponse<CipPage<NationalityItem>>>(
    "/nationality/list",
    defaultLookupParams(),
  );
  return unwrapData(data, "دریافت ملیت‌ها ناموفق بود.").list ?? [];
}

export async function fetchGenders(): Promise<GenderItem[]> {
  const { data } = await apiClient.get<CipApiResponse<GenderListData>>("/gender/list");
  return unwrapData(data, "دریافت جنسیت‌ها ناموفق بود.").list ?? [];
}
