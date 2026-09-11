import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSession, passwordMatches } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  if (!passwordMatches(form.get("password"))) {
    return new NextResponse(null, { status: 303, headers: { Location: "/admin/login?error=1" } });
  }
  const session = createAdminSession();
  const response = new NextResponse(null, { status: 303, headers: { Location: "/admin" } });
  response.cookies.set(ADMIN_COOKIE, session.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: session.maxAge });
  return response;
}
