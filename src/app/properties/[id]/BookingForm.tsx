"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { createBookingSchema } from "@/lib/validators/booking";
import { useRouter } from "next/navigation";
import { isAfter, isBefore } from "date-fns";

type Props = {
  propertyId: string;
};

export function BookingForm({ propertyId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState<string | null>(null);

  const { data: bookings = [] } = api.booking.getBookedDates.useQuery({ propertyId });

  // Helper to check if chosen range conflicts with any booked range
  function isRangeAvailable(start: Date, end: Date) {
    return !bookings.some(({ startDate, endDate }) => {
      const bookedStart = new Date(startDate);
      const bookedEnd = new Date(endDate);
      // Overlapping condition:
      return !(isAfter(start, bookedEnd) || isBefore(end, bookedStart));
    });
  }  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null); // Clear error on change
  };

  useEffect(() => {
    if (!form.startDate || !form.endDate) return;

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (start > end) {
      setError("Start date cannot be after end date.");
      return;
    }

    if (!isRangeAvailable(start, end)) {
      setError("Selected dates overlap with existing bookings.");
    } else {
      setError(null);
    }
  }, [form.startDate, form.endDate, bookings]);

  const mutation = api.booking.create.useMutation({
    onSuccess: () => router.push("/my-bookings"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      alert(error);
      return;
    }

    const result = createBookingSchema.safeParse({
      propertyId,
      ...form,
    });

    if (!result.success) {
      alert("Invalid input");
      return;
    }

    mutation.mutate({
      propertyId,
      startDate: form.startDate,
      endDate: form.endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 border-t pt-6">
      <h2 className="text-xl font-semibold">Book this property</h2>
      <div className="grid gap-2">
        <label>
          Start Date
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            className="block w-full border rounded px-3 py-2"
            min={new Date().toISOString().split("T")[0]} // optional: prevent past dates
          />
        </label>
        <label>
          End Date
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
            className="block w-full border rounded px-3 py-2"
            min={form.startDate || new Date().toISOString().split("T")[0]} // prevent end < start
          />
        </label>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={mutation.isPending || !!error}
      >
        {mutation.isPending ? "Booking..." : "Book Now"}
      </button>

      {(error || mutation.error) && (
        <p className="text-red-600 text-sm mt-2">{error || mutation.error?.message}</p>
      )}
    </form>
  );
}
