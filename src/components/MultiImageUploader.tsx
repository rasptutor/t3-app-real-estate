// src/app/properties/new/MultiImageUploader
"use client";

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react";


interface MultiImageUploaderProps {
  onUploadComplete: (urls: string[]) => void;
}

export default function MultiImageUploader({ onUploadComplete }: MultiImageUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string }[]>([]);
  
  return (
    <div className="space-y-4 flex flex-col items-center">

      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const newFiles = res.map((f) => ({ url: f.url }));
          setUploadedFiles((prev) => [...prev, ...newFiles]);
          onUploadComplete([...uploadedFiles.map((f) => f.url), ...newFiles.map((f) => f.url)]);
        }}
        onUploadError={(err) => alert("Upload failed: " + err.message)}
      />

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4 w-full">
          {uploadedFiles.map((file, i) => (
            <div key={i} className="w-full h-40 border rounded overflow-hidden">
              <img src={file.url} alt={`uploaded-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}      

    </div>
  );
}
