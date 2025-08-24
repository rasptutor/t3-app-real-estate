// app/properties/page.tsx
import { api } from "@/trpc/server";
import PropertyCard from "./PropertyCard";
import Link from "next/link";
import { auth } from "@/server/auth";
import PropertyFilterBar from "./PropertyFilterBar";
import PropertyHeader from "./PropertyHeader";

const VALID_SORTS = ["latest", "priceAsc", "priceDesc"] as const;
type SortType = typeof VALID_SORTS[number];

const VALID_LISTING_TYPES = ["sale", "rent"] as const;
type ListingType = typeof VALID_LISTING_TYPES[number];

export default async function PropertiesPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  //const sort = (searchParams.sort as "latest" | "priceAsc" | "priceDesc") ?? "latest";
  let sortParam = searchParams.sort;
  if (sortParam === "newest") sortParam = "latest"; // normalize old value
  const sort: SortType = VALID_SORTS.includes(sortParam as any)
    ? (sortParam as SortType)
    : "latest";    
  
  const session = await auth();

  const queryInput = {
    page,
    limit: 1,
    sort,
    search: searchParams.search,
    //listingType: searchParams.listingType as "sale" | "rent",
    listingType: searchParams.listingType as ListingType | undefined,
    type: searchParams.type,
    beds: searchParams.beds ? parseInt(searchParams.beds) : undefined,
    baths: searchParams.baths ? parseInt(searchParams.baths) : undefined,
  };

  const { properties, totalPages, currentPage } = await api.property.getAll(queryInput);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <PropertyHeader />
      
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">Property Listings</h1>
        <Link href="/my-bookings" className="text-blue-600 hover:underline">My Bookings</Link>
        {session && <p className="text-center ">Logged in as <span className="text-blue-600">{session.user?.name}</span></p>} 
      </div> 

      <aside className="lg:col-span-1">
        <PropertyFilterBar /> 
      </aside>          

      <div className="space-y-4">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-4 mt-6">
        {currentPage > 1 && (
          <Link href={`/properties?page=${currentPage - 1}`} className="px-4 py-2 border rounded hover:bg-gray-100">
            Previous
          </Link>
        )}
        <span className="px-4 py-2 border rounded">
          Page {currentPage} of {totalPages}
        </span>
        {currentPage < totalPages && (
          <Link href={`/properties?page=${currentPage + 1}`} className="px-4 py-2 border rounded hover:bg-gray-100">
            Next
          </Link>
        )}
      </div>
    </div>
  );
}




