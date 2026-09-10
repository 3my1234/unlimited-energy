import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSession, passwordMatches } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  if (!passwordMatches(form.get("password"))) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }
  const session = createAdminSession();
  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(ADMIN_COOKIE, session.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: session.maxAge });
  return response;
}
