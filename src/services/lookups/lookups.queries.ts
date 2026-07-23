import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SelectOption } from "@/components/ui/Select";
import {
  fetchAgeCategories,
  fetchGenders,
  fetchNationalities,
} from "./lookups.api";
import type { AgeCategoryItem, GenderItem, NationalityItem } from "./lookups.types";

export const lookupKeys = {
  all: ["lookups"] as const,
  ageCategories: () => [...lookupKeys.all, "age-categories"] as const,
  nationalities: () => [...lookupKeys.all, "nationalities"] as const,
  genders: () => [...lookupKeys.all, "genders"] as const,
};

export function useAgeCategories(enabled = true) {
  return useQuery<AgeCategoryItem[]>({
    queryKey: lookupKeys.ageCategories(),
    queryFn: fetchAgeCategories,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useNationalities(enabled = true) {
  return useQuery<NationalityItem[]>({
    queryKey: lookupKeys.nationalities(),
    queryFn: fetchNationalities,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGenders(enabled = true) {
  return useQuery<GenderItem[]>({
    queryKey: lookupKeys.genders(),
    queryFn: fetchGenders,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/** Shared select options for nationality / gender / age-category forms. */
export function useLookupSelectOptions(enabled = true) {
  const ageCategoriesQuery = useAgeCategories(enabled);
  const nationalitiesQuery = useNationalities(enabled);
  const gendersQuery = useGenders(enabled);

  const ageCategoryOptions = useMemo<SelectOption[]>(
    () =>
      (ageCategoriesQuery.data ?? []).map((item) => ({
        value: String(item.id),
        label: item.description || item.name,
      })),
    [ageCategoriesQuery.data],
  );

  const nationalityOptions = useMemo<SelectOption[]>(
    () =>
      (nationalitiesQuery.data ?? []).map((item) => ({
        value: String(item.id),
        label: item.description || item.name,
      })),
    [nationalitiesQuery.data],
  );

  const genderOptions = useMemo<SelectOption[]>(
    () =>
      (gendersQuery.data ?? []).map((item) => ({
        value: item.code,
        label: item.persianName,
      })),
    [gendersQuery.data],
  );

  const genders: GenderItem[] = gendersQuery.data ?? [];

  return {
    ageCategoryOptions,
    nationalityOptions,
    genderOptions,
    ageCategoriesLoading: ageCategoriesQuery.isPending,
    nationalitiesLoading: nationalitiesQuery.isPending,
    gendersLoading: gendersQuery.isPending,
    genders,
  };
}
