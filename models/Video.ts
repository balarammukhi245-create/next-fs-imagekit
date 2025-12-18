// models/Video.ts
import mongoose, { Schema, model, models, Types } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface IVideo {
  _id?: string; // store as string for easier TypeScript usage
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new Schema<IVideo & { _id: Types.ObjectId }>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  { timestamps: true }
);

const Video =
  models.Video || model<IVideo & { _id: Types.ObjectId }>("Video", videoSchema);

export default Video;
