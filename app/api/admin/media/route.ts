import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { normalizeSiteMedia } from "@/lib/site-media";
import { readManifest, writeManifest } from "@/lib/s3-admin";

export const runtime = "nodejs";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json(await readManifest()); }
  catch { return NextResponse.json({ error: "Could not read the S3 media manifest." }, { status: 500 }); }
}

export async function PUT(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const media = normalizeSiteMedia(await request.json());
    await writeManifest(media);
    revalidatePath("/");
    return NextResponse.json({ ok: true, media });
  } catch { return NextResponse.json({ error: "Could not publish the media manifest." }, { status: 500 }); }
}
