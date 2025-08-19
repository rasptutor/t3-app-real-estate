// app/properties/page.tsx
import Link from "next/link";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import PropertyFilterBar from "./PropertyFilterBar";

function getPlainQuery(params: Record<string, string | string[] | undefined>, override?: Record<string, string | number>) {
  const plain: Record<string, string> = {};
  for (const key in params) {
    if (typeof params[key] === "string") {
      plain[key] = params[key];
    }
  }
  return {
    ...plain,
    ...override,
  };
}

export default async function PropertiesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const session = await auth();

  const queryInput = {
    search: typeof searchParams.search === "string" ? searchParams.search : undefined,
    type: typeof searchParams.type === "string" ? searchParams.type : undefined,
    beds:
      typeof searchParams.beds === "string" ? Number(searchParams.beds) : undefined,
    baths:
      typeof searchParams.baths === "string" ? Number(searchParams.baths) : undefined,
    min: typeof searchParams.min === "string" ? Number(searchParams.min) : undefined,
    max: typeof searchParams.max === "string" ? Number(searchParams.max) : undefined,
    from: typeof searchParams.from === "string" ? searchParams.from : undefined,
    sort: typeof searchParams.sort === "string" ? (searchParams.sort as any) : undefined,
    page: typeof searchParams.page === "string" ? Number(searchParams.page) : 1,
  };

  const { properties, totalPages, currentPage } = await api.property.getAll(queryInput);

  return (
    <div className="p-6 space-y-4">
      
      <div className="flex flex-row">
        <h1 className="text-2xl font-bold">Property Listings</h1>
        <Link
          href="/my-bookings"
          className="inline-block px-6 mt-1 text-blue-600 hover:underline"
        >
          My Bookings
        </Link>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-2xl text-black">
          {session && <span>Logged in as {session.user?.name}</span>}
        </p>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>

      <PropertyFilterBar />

      <div className="space-y-4">
        {properties.map((p) => (
          <div key={p.id} className="border rounded-xl p-4 flex justify-between items-start gap-4 shadow-sm">
            <div className="flex gap-4">
              <img src={p.imageUrl} alt={p.title} className="w-40 h-32 object-cover rounded-md" />
              <div>
                <Link href={`/properties/${p.id}`} className="text-xl font-semibold hover:underline">
                  {p.title}
                </Link>
                <p className="text-gray-600">{p.description}</p>
                <p>📍 {p.location}</p>
                <p>💰 ${p.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Owner: {p.owner?.name}</p>
              </div>
            </div>           
            
            <div className="min-w-[140px] text-right text-sm text-gray-700">
              {p.averageRating !== null ? (
                <div>
                  <div className="text-lg font-medium text-yellow-600">⭐ {p.averageRating.toFixed(1)}</div>
                  <div>({p.reviewCount} reviews)</div>
                </div>
              ) : (
                <div className="text-gray-400">No ratings yet</div>
              )}
            </div>
          </div>
        ))}
      </div>    

      {/* Pagination Controls */}
      <div className="flex gap-4 mt-6">
        {currentPage > 1 && (
          <Link
            href={{
              pathname: "/properties",
              query: getPlainQuery(searchParams, { page: currentPage - 1 }),
            }}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Previous
          </Link>
        )}
        <span className="px-4 py-2 border rounded">Page {currentPage} of {totalPages}</span>
        {currentPage < totalPages && (
          <Link
            href={{
              pathname: "/properties",
              query: getPlainQuery(searchParams, { page: currentPage + 1 }),
            }}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}

