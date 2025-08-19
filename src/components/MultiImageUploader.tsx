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
  //const [imageUrls, setImageUrls] = useState<string[]>([]);  
  /*
  const handleSimulatePicsum = () => {
    const urls = Array.from({ length: 4 }).map(
      (_, i) => `https://picsum.photos/seed/${Math.random()}/200/300`
    );
    setImageUrls(urls);
    onUploadComplete(urls); // Pass to parent form
  };
  
  const handleUploadComplete = (files: UploadedFile[]) => {
    console.log("Uploaded files:", files);
    const urls = files.map((f) => f.url);
    //setImageUrls(urls);
    setUploadedFiles(files);
    //onUploadComplete(urls);
    onUploadComplete(urls);
  };
  */
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

      {/*<button
        onClick={handleSimulatePicsum}
        className="mt-2 text-blue-600 underline"
      >
        Or use mock Picsum images
      </button>*/}

      {/*imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Uploaded ${i}`}
              className="rounded border"
            />
          ))}
        </div>
      )*/}

      {/*<UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const urls = res.map((r) => r.url);
          console.log("Upload complete:", urls);
          onUploadComplete(urls); // pass back to parent
        }}
        onUploadError={(error: Error) => {
          alert(`Upload failed: ${error.message}`);
        }}
      />*/}

    </div>
  );
}
