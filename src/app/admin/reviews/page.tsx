// src/app/admin/reviews/page.tsx

"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import Link from "next/link";

export default function AdminReviewsPage() {
  const utils = api.useUtils();
  const { data: reviews = [], isLoading } = api.admin.review.getAll.useQuery();
  const deleteMutation = api.admin.review.delete.useMutation({
    onSuccess: () => utils.admin.review.getAll.invalidate(),
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold mb-4">Review Moderation</h1>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border p-4 rounded shadow-sm">
            <div className="flex justify-between">
              <div>
                <p>
                  <strong>{r.user?.name || "Anonymous"}</strong> on{" "}
                  <em>{r.property.title}</em>
                </p>
                <p>⭐ {r.rating} / 5</p>
                <p className="text-gray-700">{r.comment}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(r.createdAt), "yyyy-MM-dd")}
                </p>
              </div>
              <button
                onClick={() => {
                  setDeletingId(r.id);
                  deleteMutation.mutate({ reviewId: r.id }, {
                    onSettled: () => setDeletingId(null)
                  });
                }}
                disabled={deletingId === r.id}
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 mt-5 mb-5"
              >
                {deletingId === r.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
        <Link href="/admin" className="mt-6 inline-block text-blue-600 hover:underline">
            ← Back to Admin Dashboard
        </Link>
    </div>
  );
}
