"use client";

import { Video } from "@imagekit/next";
import Link from "next/link";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="card bg-base-100 shadow rounded-xl overflow-hidden">
      <Link href={`/videos/${video._id}`}>
        <div style={{ aspectRatio: "9/16" }} className="w-full">
          <Video
            src={video.videoUrl} // ✅ FULL ImageKit URL
            controls={video.controls}
            transformation={[{ height: 1920, width: 1080 }]}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <h2 className="font-semibold">{video.title}</h2>
        <p className="text-sm opacity-70">{video.description}</p>
      </div>
    </div>
  );
}
