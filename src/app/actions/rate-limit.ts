"use server";

import { headers } from "next/headers";

const RATE_LIMIT_MAP = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function checkRateLimit(action: string) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  const key = `${ip}:${action}`;

  const now = Date.now();
  const record = RATE_LIMIT_MAP.get(key);

  if (!record || now > record.resetTime) {
    RATE_LIMIT_MAP.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  record.count++;
  return true;
}
