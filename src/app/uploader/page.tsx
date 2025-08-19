"use client"

import ImageUploadForm from "@/components/ImageUploadForm";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />       

        <div className="w-full max-w-md">
        <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // do something with the response
              console.log("Files uploaded:", res);
              alert("Upload completed!");
            }}
            onUploadError={(err) => {
              alert("Upload failed: " + err.message);
            }}
          />
        </div>

        <ImageUploadForm />
        
        <Link
          href="/properties"
          className="inline-block mt-6 text-blue-600 hover:underline"
        >
          ← Back to Listings
        </Link>
      </div>      
    </main>
  );
}