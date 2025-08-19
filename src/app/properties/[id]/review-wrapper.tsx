"use client";

import dynamic from "next/dynamic";

const ReviewForm = dynamic(() => import("./ReviewForm"), { ssr: false });

export default function ReviewWrapper({
  propertyId,
  bookingId,
}: {
  propertyId: string;
  bookingId: string;
}) {
  return <ReviewForm propertyId={propertyId} bookingId={bookingId} />;
}
