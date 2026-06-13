"use server";

import prisma from "@/lib/db/prisma";
import { rateLimit } from "@/lib/utils/rate-limit";
import { headers } from "next/headers";

export type SubscribeResult = {
  success: boolean;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  email: string
): Promise<SubscribeResult> {
  // Rate limit: 5 subscription attempts per minute per IP
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const rl = rateLimit(ip, { limit: 5, windowMs: 60_000 });
  if (!rl.success) {
    return { success: false, message: "Too many attempts. Please try again in a minute." };
  }

  const normalized = email.trim().toLowerCase();

  // RFC 5321 caps an email address at 254 chars; reject anything larger to
  // avoid storing abusive payloads.
  if (normalized.length > 254 || !EMAIL_RE.test(normalized)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const existing = await prisma.subscriber.findUnique({
      where: { email: normalized },
    });

    if (existing) {
      return { success: true, message: "You're already on the list. ☕" };
    }

    await prisma.subscriber.create({ data: { email: normalized } });
    return { success: true, message: "Welcome aboard! Fresh stories, coming up." };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
