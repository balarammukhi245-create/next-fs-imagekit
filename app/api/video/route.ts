import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET() {
  try {
    await connectToDatabase();

    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .lean<{ _id: Types.ObjectId }[]>();

    const formattedVideos = videos.map((video) => ({
      ...video,
      _id: video._id.toString(),
    }));

    return NextResponse.json(formattedVideos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    const newVideo = await Video.create({
      title: body.title,
      description: body.description,
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    });

    return NextResponse.json(
      { ...newVideo.toObject(), _id: newVideo._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
