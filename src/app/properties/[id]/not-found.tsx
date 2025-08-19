// app/properties/[id]/not-found.tsx
import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <div className="p-6 max-w-2xl mx-auto text-center space-y-4">
      <h1 className="text-2xl font-bold">Property Not Found</h1>
      <p>The property you're looking for doesn't exist or has been removed.</p>
      <Link href="/properties" className="text-blue-600 hover:underline">
        ← Back to Listings
      </Link>
    </div>
  );
}
