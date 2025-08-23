"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type SortType = "latest" | "priceAsc" | "priceDesc";
type ListingType = "sale" | "rent";

export interface PropertyFilters {
  search: string;
  type: string;
  beds: number | null;
  baths: number | null;
  min: string;
  max: string;
  from: string;
  sort: SortType;
  listingType: ListingType | "";
  view: "grid" | "list";
}

export function usePropertyFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const filters: PropertyFilters = useMemo(() => {
    // Normalize sort
    let sortParam = params.get("sort") || "latest";
    if (sortParam === "newest") sortParam = "latest";
    const sort: SortType =
      ["latest", "priceAsc", "priceDesc"].includes(sortParam) ? (sortParam as SortType) : "latest";

    // Listing type
    const listingTypeParam = params.get("listingType");
    const listingType: ListingType | "" =
      listingTypeParam === "sale" || listingTypeParam === "rent" ? listingTypeParam : "";

    // View mode
    const view = params.get("view") === "list" ? "list" : "grid";

    // Beds & Baths
    const beds = params.get("beds") ? parseInt(params.get("beds")!) : null;
    const baths = params.get("baths") ? parseInt(params.get("baths")!) : null;

    // Min / Max price
    const min = params.get("min") || "";
    const max = params.get("max") || "";

    // Available from
    const from = params.get("from") || "";

    // Search & Type
    const search = params.get("search") || "";
    const type = params.get("type") || "";

    return { search, type, beds, baths, min, max, from, sort, listingType, view };
  }, [params]);

  const updateFilter = (key: keyof PropertyFilters | "reset", value: string | number | null) => {
    const newParams = new URLSearchParams(params.toString());

    if (key === "reset") {
      // Clear all filters
      newParams.delete("search");
      newParams.delete("type");
      newParams.delete("beds");
      newParams.delete("baths");
      newParams.delete("min");
      newParams.delete("max");
      newParams.delete("from");
      newParams.delete("sort");
      newParams.delete("listingType");
      newParams.delete("view");
    } else {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    }

    newParams.set("page", "1"); // reset pagination
    router.replace(`/properties?${newParams.toString()}`);
  };

  return { filters, updateFilter };
}
