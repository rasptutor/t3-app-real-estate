"use client";

import { useState } from "react";
import type { Agency } from "@prisma/client";
import AgencySearchFilters from "./AgencySearchFilters"
import AgencyCard from "./AgencyCard";
import AgenciesSkeletonGrid from "./AgenciesSkeletonGrid";
import AgenciesErrorState from "./AgenciesErrorState";
import AgenciesEmptyState from "./AgenciesEmptyState";

interface Props {
  agencies: Agency[];
  isLoading: boolean;
  error: Error | null;
  uniqueSpecializations: (string | null)[];
}

export default function AgenciesPage({
  agencies,
  isLoading,
  error,
  uniqueSpecializations,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // --- Filtering logic
  const filteredAgencies = agencies
    .filter((a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((a) =>
      specializationFilter === "all" ? true : a.specialization === specializationFilter
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "listings":
          return (b.activeListings ?? 0) - (a.activeListings ?? 0);
        case "sales":
          return (b.salesThisYear ?? 0) - (a.salesThisYear ?? 0);
        case "rating":
        default:
          return (b.rating ?? 0) - (a.rating ?? 0);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
            Real Estate Agencies
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find trusted real estate professionals to help with your property needs
          </p>
          <AgencySearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            specializationFilter={specializationFilter}
            setSpecializationFilter={setSpecializationFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            uniqueSpecializations={uniqueSpecializations}
          />
        </div>
      </section>

      {/* Agencies Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900" data-testid="text-results-count">
            {filteredAgencies.length} {filteredAgencies.length === 1 ? "Agency" : "Agencies"} Found
          </h2>
        </div>

        {isLoading ? (
          <AgenciesSkeletonGrid />
        ) : error ? (
          <AgenciesErrorState message={error?.message ?? "Failed to load agencies"} />
        ) : filteredAgencies.length === 0 ? (
          <AgenciesEmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="agencies-grid">
            {filteredAgencies.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
