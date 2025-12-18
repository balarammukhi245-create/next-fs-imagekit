"use client";

import VideoUploadForm from "../components/VideoUploadForm";

export default function VideoUploadPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Upload New Reel
        </h1>

        <VideoUploadForm />
      </div>
    </div>
  );
}
