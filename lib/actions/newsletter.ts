"use server";

import prisma from "@/lib/db/prisma";

export type SubscribeResult = {
  success: boolean;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  email: string
): Promise<SubscribeResult> {
  const normalized = email.trim().toLowerCase();

  if (!EMAIL_RE.test(normalized)) {
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
