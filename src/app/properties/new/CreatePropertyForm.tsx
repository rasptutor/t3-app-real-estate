"use client";

import { useRouter } from "next/navigation";
import { api } from "@/trpc/react"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import MultiImageTest from "@/components/MultiImageTest";

const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  propertyType: z.enum(["Apartment", "House", "Villa", "Cottage"]),
  bedrooms: z.coerce.number().int().min(0, "Bedrooms must be 0 or more"),
  bathrooms: z.coerce.number().int().min(0, "Bathrooms must be 0 or more"),
  availableFrom: z.string().min(1, "Please select a date"),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        key: z.string(),
      })
    )
    .min(1, "At least one image is required"),
});

type PropertyInput = z.infer<typeof propertySchema>;

export default function CreatePropertyForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      images: [], // start empty
    },
  });

  const mutation = api.property.create.useMutation({
    onSuccess: () => router.push("/properties"),
    onError: (err) => console.error("Mutation failed:", err),
  });

  const onSubmit = (data: PropertyInput) => {
    if (data.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    console.log("Submitting form data:", data);

    mutation.mutate({
      ...data,
      imageUrl: data.images[0]?.url as string, // fallback for admin panel
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create New Property</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Text fields */}
        {[
          { name: "title", type: "text" },
          { name: "description", type: "text" },
          { name: "location", type: "text" },
          { name: "price", type: "number" },
          { name: "bedrooms", type: "number" },
          { name: "bathrooms", type: "number" },
          { name: "availableFrom", type: "date" },
        ].map(({ name, type }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700 capitalize"
            >
              {name.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={type}
              id={name}
              {...register(name as keyof PropertyInput)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors[name as keyof PropertyInput] && (
              <p className="text-red-600 text-sm">
                {errors[name as keyof PropertyInput]?.message?.toString()}
              </p>
            )}
          </div>
        ))}

        {/* Property Type */}
        <div>
          <label
            htmlFor="propertyType"
            className="block text-sm font-medium text-gray-700"
          >
            Property Type
          </label>
          <select
            id="propertyType"
            {...register("propertyType")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Cottage">Cottage</option>
          </select>
          {errors.propertyType && (
            <p className="text-red-600 text-sm">{errors.propertyType.message}</p>
          )}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <MultiImageTest
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.images && (
            <p className="text-red-600 text-sm">{errors.images.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isSubmitting || mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create Property"}
        </button>
        {mutation.error && (
          <p className="text-red-600">{mutation.error.message}</p>
        )}
      </form>
    </div>
  );
}
