import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (
      !process.env.IMAGEKIT_PRIVATE_KEY ||
      !process.env.NEXT_PUBLIC_PUBLIC_KEY
    ) {
      throw new Error("ImageKit env variables missing");
    }
    const authenticationParameters = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    });

    return NextResponse.json({
      authenticationParameters,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Authentication for ImageKit failed" },
      { status: 500 }
    );
  }
}
