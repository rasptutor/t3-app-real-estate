// src/app/properties/[id]/AvailabilityCalendar.tsx

"use client";

import { useMemo } from "react";
import { api } from "@/trpc/react";
import { eachDayOfInterval } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function AvailabilityCalendar({ propertyId }: { propertyId: string }) {
  const { data: bookings = [] } = api.booking.getBookedDates.useQuery({ propertyId });

  // 🔁 Compute bookedDates only when bookings change
  const bookedDates = useMemo(() => {
    const dates: Date[] = [];
    for (const { startDate, endDate } of bookings) {
      const range = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
      });
      dates.push(...range);
    }
    return dates;
  }, [bookings]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Availability Calendar</h3>
      <DayPicker
        mode="single"
        disabled={bookedDates}
        modifiersClassNames={{ disabled: "bg-red-100 text-gray-500" }}
        className="border rounded p-4"
      />
    </div>
  );
}


