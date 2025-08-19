// app/admin/page.tsx
import Link from "next/link";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <nav className="flex flex-col gap-4">
        <Link
          href="/admin/users"
          className="text-blue-600 hover:underline text-lg"
        >
          Manage Users
        </Link>
        <Link
          href="/admin/properties"
          className="text-blue-600 hover:underline text-lg"
        >
          Manage Properties
        </Link>
        <Link
          href="/admin/bookings"
          className="text-blue-600 hover:underline text-lg"
        >
          Manage Bookings
        </Link>
        <Link 
          href="/admin/reviews" 
          className="text-blue-600 hover:underline text-lg"
        >
          Manage Reviews
        </Link>        
      </nav>
        <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
            {session ? "Sign out" : "Sign in"}
        </Link>      
    </div>
  );
}