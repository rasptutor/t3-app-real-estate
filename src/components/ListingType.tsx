"use client";

import React, { useState } from 'react'
import { Button } from './ui/button';
import { Building, HomeIcon } from 'lucide-react';

export default function ListingType() {
    const [searchFilters, setSearchFilters] = useState({
        location: "",
        propertyType: "",
        priceRange: "",
        listingType: "sale"
    });
    return (
        <div><section className="border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
                <div className="flex space-x-6">
                <Button
                    variant={searchFilters.listingType === "sale" ? "default" : "ghost"}
                    onClick={() => setSearchFilters(prev => ({ ...prev, listingType: "sale" }))}
                    className="flex items-center font-medium"
                    data-testid="button-for-sale"
                >
                    <HomeIcon className="mr-2 h-4 w-4" />
                    For Sale
                </Button>
                <Button
                    variant={searchFilters.listingType === "rent" ? "default" : "ghost"}
                    onClick={() => setSearchFilters(prev => ({ ...prev, listingType: "rent" }))}
                    className="flex items-center font-medium"
                    data-testid="button-for-rent"
                >
                    <Building className="mr-2 h-4 w-4" />
                    For Rent
                </Button>
                </div>
            </div>
            </div>
        </section>
        </div>
    )
}
