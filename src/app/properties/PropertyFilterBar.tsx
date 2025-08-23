"use client";

import { Button } from "@/components/ui/button";
import { BATHROOM_OPTIONS, BEDROOM_OPTIONS, PROPERTY_CATEGORIES } from "@/lib/constants";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";

const typeStrings = Object.values(PROPERTY_CATEGORIES)
  .flatMap(category => Object.values(category.types));

export default function PropertyFilterBar() {
  const { filters, updateFilter } = usePropertyFilters();

  return (
    <form
      onSubmit={(e) => e.preventDefault()} // filters update instantly via URL
      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border rounded-lg bg-white shadow"
    >
      {/* Search */}
      <div className="col-span-2">
        <label className="block text-sm font-medium">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder="Title or location"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={filters.type || ""}
          onChange={(e) => updateFilter("type", e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Any</option>
          {typeStrings.map((pt) => (
            <option key={pt} value={pt}>
              {pt}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium">Sort by</label>
        <select
          value={filters.sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="latest">Latest</option>
          <option value="priceAsc">Price ↑</option>
          <option value="priceDesc">Price ↓</option>
        </select>
      </div>

      {/* Listing type */}
      <div>
        <label className="block text-sm font-medium">Listing type</label>
        <select
          value={filters.listingType || ""}
          onChange={(e) => updateFilter("listingType", e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Any type</option>
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-sm font-medium mb-2">Bedrooms</label>
        <div className="flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((option) => (
            <Button
              key={option.label}
              variant={filters.beds === option.value ? "default" : "outline"}
              size="sm"
              onClick={() =>
                updateFilter("beds", filters.beds === option.value ? null : option.value)
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="block text-sm font-medium mb-2">Bathrooms</label>
        <div className="flex flex-wrap gap-2">
          {BATHROOM_OPTIONS.map((option) => (
            <Button
              key={option.label}
              variant={filters.baths === option.value ? "default" : "outline"}
              size="sm"
              onClick={() =>
                updateFilter("baths", filters.baths === option.value ? null : option.value)
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Min Price */}
      <div>
        <label className="block text-sm font-medium">Min Price</label>
        <input
          type="number"
          value={filters.min || ""}
          onChange={(e) => updateFilter("min", e.target.value)}
          min={0}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Max Price */}
      <div>
        <label className="block text-sm font-medium">Max Price</label>
        <input
          type="number"
          value={filters.max || ""}
          onChange={(e) => updateFilter("max", e.target.value)}
          min={0}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Available From */}
      <div>
        <label className="block text-sm font-medium">Available From</label>
        <input
          type="date"
          value={filters.from || ""}
          onChange={(e) => updateFilter("from", e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Reset Filters */}
      <div className="md:col-span-4 flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={() => updateFilter("reset", "")}>
          Reset Filters
        </Button>
      </div>
    </form>
  );
}



