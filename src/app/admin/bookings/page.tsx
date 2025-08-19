// app/admin/bookings/page.tsx
import { api } from "@/trpc/server";
import Link from "next/link";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import AdminBookingsClient from "./AdminBookingsClient";

export default async function AdminBookingsPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  //const bookings = await api.admin.booking.getAll();

  return <AdminBookingsClient />;
}
