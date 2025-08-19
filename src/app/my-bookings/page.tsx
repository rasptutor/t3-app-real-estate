// app/my-bookings/page.tsx
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import MyBookingsClient from "./MyBookingsClient";

export default async function MyBookingsPage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  const bookings = await db.booking.findMany({
    where: { userId: session.user.id },
    include: {
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-3 max-w-6xl mx-auto space-y-6">      
      
      <MyBookingsClient bookings={bookings}/>
      <Link
        href="/properties"
        className="inline-block mt-6 text-blue-600 hover:underline"
      >
        ← Back to Listings
      </Link>
    </div>
  );
}
