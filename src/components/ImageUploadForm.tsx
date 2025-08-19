"use client";

import { useState } from "react";
import { UploadDropzone } from "@/utils/uploadthing";

export default function ImageUploadForm() {
  const [name, setName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, files: uploadedFiles }),
      });
      const data = await res.json();
      alert("Form submitted! " + JSON.stringify(data));
      setName("");
      setUploadedFiles([]);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border rounded-lg space-y-4"
    >
      {/* Name Field */}
      <div>
        <label className="block font-medium mb-1">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Dropzone */}
      <div>
        <label className="block font-medium mb-1">Upload Images:</label>
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            setUploadedFiles((prev) => [...prev, ...res.map((f) => ({ url: f.url }))]);
          }}
          onUploadError={(err) => alert("Upload failed: " + err.message)}
        />
      </div>

      {/* Previews */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {uploadedFiles.map((file, idx) => (
            <div key={idx} className="w-24 h-24 border rounded overflow-hidden relative">
              <img
                src={file.url}
                alt={`uploaded-${idx}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
