import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, Email and Password are Required" },
        { status: 400 }
      );
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    await User.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { message: "User Registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 400 }
    );
  }
}
