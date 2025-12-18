"use client";

import { useState } from "react";
import { upload, UploadResponse } from "@imagekit/next";
import { useNotification } from "./Notification";

const MAX_SIZE_MB = 100;

export default function VideoUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      showNotification("Please select a valid video file", "error");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showNotification(`File must be less than ${MAX_SIZE_MB} MB`, "error");
      return;
    }

    setSelectedFile(file);
    showNotification(`File ready: ${file.name}`, "info");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const res: UploadResponse = await upload({
        file: selectedFile,
        fileName: selectedFile.name,
        publicKey: auth.publicKey,
        signature: auth.authenticationParameters.signature,
        expire: auth.authenticationParameters.expire,
        token: auth.authenticationParameters.token,
        onProgress: (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      });

      if (!res.url) throw new Error("No URL returned");

      const saveRes = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedFile.name,
          description: "Uploaded video",
          videoUrl: res.url,
          thumbnailUrl: res.thumbnailUrl || res.url,
          controls: true,
        }),
      });

      if (!saveRes.ok) throw new Error("DB save failed");

      setUploadedUrl(res.url);
      setSelectedFile(null);
      showNotification("Video uploaded & saved!", "success");

      // 🔥 refresh homepage
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      showNotification("Video upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* ---------- File input ---------- */}
      <input
        type="file"
        accept="video/*"
        disabled={uploading}
        onChange={handleFileSelect}
        className="
          block w-full max-w-xs text-sm text-gray-700
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:bg-blue-600 file:text-white
          hover:file:bg-blue-700
        "
      />

      {/* ---------- Upload Button ---------- */}
      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="
            w-full max-w-xs bg-blue-600 text-white py-2 
            rounded-lg hover:bg-blue-700 transition disabled:opacity-60
          "
        >
          {uploading ? "Uploading..." : `Upload ${selectedFile.name}`}
        </button>
      )}

      {/* ---------- Progress Bar ---------- */}
      {uploading && (
        <div className="w-full max-w-xs bg-gray-200 rounded-lg overflow-hidden h-2">
          <div
            className="bg-blue-600 h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* ---------- Preview Video ---------- */}
      {uploadedUrl && (
        <video
          src={uploadedUrl}
          controls
          className="mt-4 rounded-lg max-w-full shadow-lg"
        />
      )}
    </div>
  );
}
