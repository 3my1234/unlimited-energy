import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createUpload } from "@/lib/s3-admin";

export const runtime = "nodejs";
const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm", "text/vtt"]);
const sections = new Set(["hero", "residential", "project-video", "project-poster", "project-captions", "process"]);

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { fileName, contentType, section } = await request.json() as Record<string, unknown>;
    if (typeof fileName !== "string" || typeof contentType !== "string" || typeof section !== "string" || !allowed.has(contentType) || !sections.has(section)) {
      return NextResponse.json({ error: "Unsupported file or section." }, { status: 400 });
    }
    return NextResponse.json(await createUpload(fileName, contentType, section));
  } catch {
    return NextResponse.json({ error: "Could not create an upload link." }, { status: 500 });
  }
}
