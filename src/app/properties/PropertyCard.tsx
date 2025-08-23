// src/app/properties/PropertyCard

import Image from "next/image";
import Link from "next/link";
import type { Property } from "@prisma/client";

// Allow owner.name to be null
type PropertyWithImages = Property & {
  images: { id: string; url: string; key: string; propertyId: string }[];
  owner: { name: string | null } | null;
};

export default function PropertyCard({ property }: { property: PropertyWithImages }) {
  return (
    <div className="border rounded-xl p-4 flex flex-col md:flex-row gap-4 shadow-sm">
      {property.images[0] && (
        <Image
          src={property.images[0].url}
          alt={property.title}
          width={400}
          height={300}
          className="object-cover rounded-md w-full md:w-40 h-32"
        />
      )}

      <div className="flex-1">
        <Link href={`/properties/${property.id}`} className="text-xl font-semibold hover:underline">
          {property.title}
        </Link>
        <p className="text-gray-600">{property.description}</p>
        <p>📍 {property.location}</p>
        <p className="font-semibold text-lg">
          💰{" "}
          {property.rentPrice
            ? `$${property.rentPrice.toLocaleString()} / mo`
            : `$${property.price?.toLocaleString()}`}
        </p>
        <p className="text-sm text-gray-500">Owner: {property.owner?.name ?? "N/A"}</p>
        
      </div>
    </div>
  );
}

