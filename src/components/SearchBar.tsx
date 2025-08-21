"use client";

import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PROPERTY_CATEGORIES, PRICE_RANGES } from "@/lib/constants";

export default function SearchBar() {

    const [searchFilters, setSearchFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
    listingType: "sale"
  });

  // Fetch featured properties
  /*
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
    select: (data: PropertyWithDetails[]) => data.slice(0, 4), // Show first 4 properties
  });
  */
  // Fetch agencies
  /*
  const { data: agencies = [], isLoading: agenciesLoading } = useQuery({
    queryKey: ['/api/agencies'],
    select: (data: Agency[]) => data.slice(0, 3), // Show first 3 agencies
  });
  */
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchFilters.location) params.set('city', searchFilters.location);
    if (searchFilters.propertyType && searchFilters.propertyType !== 'all') params.set('propertyType', searchFilters.propertyType);
    if (searchFilters.listingType) params.set('listingType', searchFilters.listingType);
    
    // Handle price range
    if (searchFilters.priceRange) {
      const ranges = PRICE_RANGES[searchFilters.listingType as keyof typeof PRICE_RANGES];
      const selectedRange = ranges.find(r => r.label === searchFilters.priceRange);
      if (selectedRange) {
        if (selectedRange.min > 0) {
          params.set(searchFilters.listingType === 'sale' ? 'minPrice' : 'minRent', selectedRange.min.toString());
        }
        if (selectedRange.max) {
          params.set(searchFilters.listingType === 'sale' ? 'maxPrice' : 'maxRent', selectedRange.max.toString());
        }
      }
    }

    window.location.href = `/properties?${params.toString()}`;
  };

  const priceRanges = PRICE_RANGES[searchFilters.listingType as keyof typeof PRICE_RANGES] || PRICE_RANGES.sale;

    return (
        <><div className="max-w-4xl mx-auto glass-effect rounded-lg shadow-xl p-6 bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input
                        type="text"
                        placeholder="City, neighborhood, ZIP"
                        value={searchFilters.location}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full"
                        data-testid="input-search-location" />
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <Select
                        value={searchFilters.propertyType}
                        onValueChange={(value) => setSearchFilters(prev => ({ ...prev, propertyType: value }))}
                    >
                        <SelectTrigger data-testid="select-property-type">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {Object.entries(PROPERTY_CATEGORIES).map(([category, categoryData]) => Object.entries(categoryData.types).map(([typeKey, typeLabel]) => (
                                <SelectItem key={typeKey} value={typeKey}>
                                    {typeLabel}
                                </SelectItem>
                            ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <Select
                        value={searchFilters.priceRange}
                        onValueChange={(value) => setSearchFilters(prev => ({ ...prev, priceRange: value }))}
                    >
                        <SelectTrigger data-testid="select-price-range">
                            <SelectValue placeholder="Any Price" />
                        </SelectTrigger>
                        <SelectContent>
                            {priceRanges.map((range) => (
                                <SelectItem key={range.label} value={range.label}>
                                    {range.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-end">
                    <Button
                        onClick={handleSearch}
                        className="w-full btn-primary"
                        data-testid="button-search"
                    >
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                </div>
            </div>
        </div></>
    )
}
