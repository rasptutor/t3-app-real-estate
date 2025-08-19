"use client";
// app/admin/users/page.tsx
import { useState } from "react";
import { api } from "@/trpc/react";
import type { Role, User } from "@prisma/client";
import Link from "next/link";

type EditableUser = Pick<User, "id" | "name" | "email" | "role">;

export default function AdminUsersPage() {
  const utils = api.useUtils();
  const { data: users = [], isLoading } = api.admin.user.getAll.useQuery();
  const updateMutation = api.admin.user.update.useMutation({
    onSuccess: () => utils.admin.user.getAll.invalidate(),
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<EditableUser | null>(null);

  const startEdit = (user: EditableUser) => {
    setEditingId(user.id);
    setFormState(user);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormState(null);
  };

  const saveEdit = () => {
    if (formState) {
      updateMutation.mutate({
        id: formState.id,
        role: formState.role,
        name: formState.name ?? undefined,
        email: formState.email ?? undefined,
      });
      cancelEdit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => prev ? { ...prev, [name]: value } : null);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isEditing = editingId === user.id;
            return (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      name="name"
                      value={formState?.name ?? ""}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    />
                  ) : user.name}
                </td>
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      name="email"
                      value={formState?.email ?? ""}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    />
                  ) : user.email}
                </td>
                <td className="px-4 py-2">
                  {isEditing ? (
                    <select
                      name="role"
                      value={formState?.role ?? "USER"}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    >
                      {["USER", "AGENT", "ADMIN"].map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  ) : user.role}
                </td>
                <td className="px-4 py-2">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="px-2 py-1 bg-green-600 text-white rounded">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="px-2 py-1 bg-gray-300 rounded">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        startEdit({
                          id: user.id,
                          name: user.name ?? "",
                          email: user.email ?? "",
                          role: user.role,
                        })
                      }
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link href="/admin" className="mt-6 inline-block text-blue-600 hover:underline">
          ← Back to Admin Dashboard
      </Link>
    </div>
  );
}