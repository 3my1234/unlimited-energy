import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "unlimited_admin";
const SESSION_SECONDS = 60 * 60 * 12;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  return value;
}

function sign(expires: number) {
  return createHmac("sha256", secret()).update(String(expires)).digest("base64url");
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return { value: `${expires}.${sign(expires)}`, maxAge: SESSION_SECONDS };
}

export async function isAdmin() {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const [rawExpires, signature] = value.split(".");
  const expires = Number(rawExpires);
  if (!Number.isSafeInteger(expires) || expires <= Date.now() / 1000 || !signature) return false;
  const expected = Buffer.from(sign(expires));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function passwordMatches(candidate: unknown) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || typeof candidate !== "string") return false;
  const expected = Buffer.from(configured);
  const received = Buffer.from(candidate);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
