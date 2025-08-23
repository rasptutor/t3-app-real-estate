"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PropertyDetailsHeader() {
    const [isFavorite, setIsFavorite] = useState(false);
    return (
        <div>{/* Header */}
            <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                <Link href="/properties">
                    <Button variant="ghost" className="flex items-center text-blue-600 hover:underline" data-testid="button-back">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Property Listings
                    </Button>
                </Link>
                
                <div className="flex items-center space-x-2">
                    <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                    data-testid="button-favorite"
                    >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="icon" data-testid="button-share">
                    <Share2 className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
}
