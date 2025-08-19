"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import StarRating from "@/components/StarRating";

export default function ReviewForm({ bookingId, propertyId }: {
  bookingId: string;
  propertyId: string;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const utils = api.useUtils();

  const mutation = api.review.create.useMutation({
    onSuccess: () => {
      setComment("");
      utils.review.getByProperty.invalidate({ propertyId });
    },
    onError: (err) => {
      alert(err.message); // Optional user-friendly feedback
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ bookingId, rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label>Rating:</label>        
        <StarRating rating={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Review
      </button>
    </form>
  );
}
