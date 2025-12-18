import Header from "./components/Header";
import VideoFeed from "./components/VideoFeed";
import Video, { IVideo } from "@/models/Video";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Types } from "mongoose";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg mb-4">
          Please login to view videos
        </p>

        <Link
          href="/login"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Login
        </Link>
      </div>
    );
  }
  await connectToDatabase();

  const videosFromDB = await Video.find()
    .sort({ createdAt: -1 })
    .lean<(Omit<IVideo, "_id"> & { _id: Types.ObjectId })[]>();

  const videos: IVideo[] = videosFromDB.map((video) => ({
    ...video,
    _id: video._id.toString(),
  }));
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Welcome, {session.user?.name}
        </h1>

        {videos.length ? (
          <VideoFeed videos={videos} />
        ) : (
          <div className="text-center py-16">
            <p className="text-red-200 text-lg ">No videos uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
