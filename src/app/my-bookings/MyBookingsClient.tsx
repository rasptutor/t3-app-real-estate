"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import type { Booking } from "@prisma/client";

type BookingWithProperty = Booking & {
  property: {
    title: string;
    imageUrl: string;
    location: string;
    price: number;
    description: string;
  };
};

export default function MyBookingsClient({ bookings }: { bookings: BookingWithProperty[] }) {
  const [selected, setSelected] = useState<BookingWithProperty | null>(null);

  const [status, setStatus] = useState<string | undefined>();
  const bookingsQuery = api.booking.getAll.useQuery({ status });
  const cancelMutation = api.booking.cancel.useMutation({
    onSuccess: () => bookingsQuery.refetch(),
  });

  const handleCancel = (id: string) => {
    cancelMutation.mutate({ bookingId: id });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold mb-4">My Bookings</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["ALL", "CONFIRMED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s === "ALL" ? undefined : s)}
            className={`px-4 py-2 border rounded ${
              status === s ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Booking List */}
      {bookingsQuery.isLoading && <p>Loading...</p>}
      {bookingsQuery.error && <p className="text-red-600">{bookingsQuery.error.message}</p>}
      {bookingsQuery.data?.length === 0 && <p>No bookings found.</p>}

      {bookingsQuery.data?.map((booking) => (
        <div key={booking.id} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
          <div>
            <p className="font-semibold">{booking.property.title}</p>
            <p>📅 {format(booking.startDate, "yyyy-MM-dd")} - {format(booking.endDate, "yyyy-MM-dd")}</p>
            <p>Status: <span className="font-medium">{booking.status}</span></p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(booking)}
              className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-100"
            >
              View
            </button>
            {booking.status !== "CANCELLED" && (
              <button
                onClick={() => handleCancel(booking.id)}
                className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
              </button>
            )}
          </div>          
        </div>
      ))}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2">{selected.property.title}</h2>
            <img
              src={selected.property.imageUrl}
              alt={selected.property.title}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <p className="text-gray-700 mb-1">{selected.property.description}</p>
            <p className="text-sm text-gray-600 mb-1">📍 {selected.property.location}</p>
            <p className="text-sm text-gray-600 mb-1">💰 ${selected.property.price.toLocaleString()}</p>
            <p className="text-sm text-gray-600">🗓️ {selected.startDate.toLocaleDateString()} → {selected.endDate.toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
