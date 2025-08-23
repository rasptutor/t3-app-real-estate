"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List } from "lucide-react";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";

export default function PropertyHeader() {
  const { filters, updateFilter } = usePropertyFilters();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border rounded-xl shadow-sm bg-white">
      {/* Sale / Rent Toggle */}
      <div className="flex gap-2">
        <Button
          variant={filters.listingType === "sale" ? "default" : "outline"}
          onClick={() => updateFilter("listingType", filters.listingType === "sale" ? "" : "sale")}
        >
          For Sale
        </Button>
        <Button
          variant={filters.listingType === "rent" ? "default" : "outline"}
          onClick={() => updateFilter("listingType", filters.listingType === "rent" ? "" : "rent")}
        >
          For Rent
        </Button>
      </div>

      {/* Sort Select */}
      <Select value={filters.sort} onValueChange={(v) => updateFilter("sort", v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="priceAsc">Price: Low to High</SelectItem>
          <SelectItem value="priceDesc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>

      {/* View Mode Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filters.view === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilter("view", "grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={filters.view === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilter("view", "list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
