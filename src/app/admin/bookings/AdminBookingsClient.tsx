"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import Link from "next/link";

export default function AdminBookingsClient() {
  const bookingsQuery = api.admin.booking.getAll.useQuery();
  const updateStatusMutation = api.admin.booking.updateStatus.useMutation({
    onSuccess: () => bookingsQuery.refetch(),
  });
  const deleteMutation = api.admin.booking.delete.useMutation({
    onSuccess: () => bookingsQuery.refetch(),
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (bookingsQuery.isLoading) return <p>Loading bookings...</p>;
  if (bookingsQuery.error) return <p className="text-red-600">Error: {bookingsQuery.error.message}</p>;

  const bookings = bookingsQuery.data || [];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold mb-6">All Bookings</h1>

      {bookings.length === 0 && <p>No bookings found.</p>}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-semibold">{b.property.title}</div>
              <div>👤 {b.user.name} ({b.user.email})</div>
              <div>📍 {b.property.location}</div>
              <div>
                🗓️ {format(new Date(b.startDate), "yyyy-MM-dd")} → {format(new Date(b.endDate), "yyyy-MM-dd")}
              </div>
              <div className="mt-2">
                <select
                  value={b.status}
                  onChange={(e) =>
                    updateStatusMutation.mutate({ bookingId: b.id, status: e.target.value as "CONFIRMED" | "CANCELLED" })
                  }
                  disabled={updateStatusMutation.isPending}
                  className="border rounded p-1"
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this booking?")) {
                    setDeletingId(b.id);
                    deleteMutation.mutate(b.id, {
                      onSettled: () => setDeletingId(null),
                    });
                  }
                }}
                disabled={deleteMutation.isPending && deletingId === b.id}
                className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
              >
                {deleteMutation.isPending && deletingId === b.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <Link href="/admin" className="mt-6 inline-block align-center text-blue-600 hover:underline">
        ← Back to Admin Dashboard
      </Link>
    </div>
  );
}
