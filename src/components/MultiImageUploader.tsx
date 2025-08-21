// src/app/properties/new/MultiImageUploader
"use client";

import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import { X } from "lucide-react";

type UploadedFile = {
  url: string;
  key: string;
};

type MultiImageUploaderProps = {
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
};

export default function MultiImageUploader({ value, onChange }: MultiImageUploaderProps) {
  const handleUploadComplete = (res: { url: string; key: string }[]) => {
    onChange([...value, ...res]);
  };

  const handleRemove = (key: string) => {
    onChange(value.filter((file) => file.key !== key));
  };

  return (
    <div className="space-y-4">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(err) => alert(`Upload error: ${err.message}`)}
      />

      <div className="grid grid-cols-3 gap-3">
        {value.map((file) => (
          <div
            key={file.key}
            className="relative aspect-square rounded-lg overflow-hidden border"
          >
            <Image
              src={file.url}
              alt="Uploaded preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(file.key)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}