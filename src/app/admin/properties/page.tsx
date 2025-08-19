"use client"

// app/admin/properties/page.tsx
//import { api } from "@/trpc/server";
import { api } from "@/trpc/react";
import Link from "next/link";
import type { Property } from "@prisma/client";
import { useState } from "react";

type EditableProperty = Pick<Property, "id" | "title" | "price" | "location">;

export default function AdminPropertiesPage() {
  //const properties = await api.admin.getAllProperties();

  const utils = api.useUtils();

  const deleteMutation = api.admin.property.delete.useMutation({
    onSuccess: () => {
      utils.admin.getAllProperties.invalidate();
    },
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: properties = [], isLoading } = api.admin.getAllProperties.useQuery();
  const mutation = api.admin.property.update.useMutation({
    onSuccess: () => utils.admin.getAllProperties.invalidate(),
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditableProperty | null>(null);

  const startEditing = (property: EditableProperty) => {
    setEditingId(property.id);
    setForm(property);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(null);
  };

  const saveEdit = () => {
    if (!form) return;
    mutation.mutate(form);
    cancelEdit();
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Manage Properties</h1>
        <table className="w-full table-auto border">
            <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Beds/Baths</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Available</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Owner</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
            {properties.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{p.propertyType}</td>
                  <td className="px-4 py-2">
                    {p.bedrooms} / {p.bathrooms}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(p.availableFrom).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {p.owner?.name ?? "Unknown"} <br />
                    <span className="text-xs text-gray-500">{p.owner?.email}</span>
                  </td>
                {editingId === p.id ? (
                    <>
                    <td className="p-2">
                        <input
                        className="border rounded p-1 w-full"
                        value={form?.title ?? ""}
                        onChange={(e) => setForm((f) => f && { ...f, title: e.target.value })}
                        />
                    </td>
                    <td className="p-2">
                        <input
                        type="number"
                        className="border rounded p-1 w-full"
                        value={form?.price ?? ""}
                        onChange={(e) => setForm((f) => f && { ...f, price: Number(e.target.value) })}
                        />
                    </td>
                    <td className="p-2">
                        <input
                        className="border rounded p-1 w-full"
                        value={form?.location ?? ""}
                        onChange={(e) => setForm((f) => f && { ...f, location: e.target.value })}
                        />
                    </td>
                    <td className="p-2 flex gap-2">
                        <button onClick={saveEdit} className="px-2 py-1 bg-blue-600 text-white rounded">Save</button>
                        <button onClick={cancelEdit} className="px-2 py-1 bg-gray-300 rounded">Cancel</button>
                    </td>
                    </>
                ) : (
                    <>
                    <td className="p-2">{p.title}</td>
                    <td className="p-2">${p.price}</td>
                    <td className="p-2">{p.location}</td>
                    <td className="p-2">
                        <button onClick={() => startEditing(p)} className="px-2 py-1 bg-blue-400 text-white rounded mb-1">Edit</button>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this property?")) {
                              setDeletingId(p.id);
                              deleteMutation.mutate({ id: p.id }, {
                                onSettled: () => setDeletingId(null),
                              });
                            }
                          }}
                          disabled={deleteMutation.isPending && deletingId === p.id}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          {deleteMutation.isPending && deletingId === p.id ? "Deleting..." : "Delete"}
                        </button>
                    </td>
                    </>
                )}
                </tr>
            ))}
            </tbody>
        </table>
      
        <Link href="/admin" className="mt-6 inline-block text-blue-600 hover:underline">
            ← Back to Admin Dashboard
        </Link>
    </div>
  );
}
