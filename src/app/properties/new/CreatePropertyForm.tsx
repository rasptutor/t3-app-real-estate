"use client";

import { useRouter } from "next/navigation";
import { api } from "@/trpc/react"; // adjust path if needed
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import MultiImageUploader from "../../../components/MultiImageUploader";
import { UploadButton } from "@/utils/uploadthing";

const propertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(3),
  //imageUrl: z.string().url(),
  price: z.coerce.number().positive(),
  propertyType: z.enum(["Apartment", "House", "Villa", "Cottage"]),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  availableFrom: z.string().min(1),
  //images: z.array(z.string().url()).min(1, "At least one image is required"),
  images: z.array(z.string().url()).optional(),
});

type PropertyInput = z.infer<typeof propertySchema>;

export default function CreatePropertyForm() {    
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
  });

  const mutation = api.property.create.useMutation({
    onSuccess: () => router.push("/properties"),
    onError: (err) => console.error("Mutation failed:", err),
  });

  const onSubmit = (data: PropertyInput) => {    
    console.log("Submitting form data:", data, images);

    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }   

    mutation.mutate({
      ...data,      
      images,
      imageUrl: images[0] as string,
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create New Property</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 capitalize">
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

        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
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
          {errors.propertyType && <p className="text-red-600 text-sm">{errors.propertyType.message}</p>}
        </div>       
        
        <MultiImageUploader onUploadComplete={setImages} />             
      
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isSubmitting || mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create Property"}
        </button>
        {mutation.error && <p className="text-red-600">{mutation.error.message}</p>}
      </form>
    </div>
  );
}