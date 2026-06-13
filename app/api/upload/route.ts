import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import cloudinary from "@/lib/media/cloudinary";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || (session.user.role !== "WRITER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 20 uploads per minute per IP
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 20, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before uploading again." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "20",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: "coffeenme",
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Signature generation error:", error);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
