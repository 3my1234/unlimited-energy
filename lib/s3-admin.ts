import "server-only";

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { defaultSiteMedia, normalizeSiteMedia, type SiteMedia } from "@/lib/site-media";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

const client = new S3Client({ region: process.env.AWS_REGION || "eu-north-1" });
const bucket = () => required("S3_BUCKET_NAME");
const manifestKey = () => process.env.SITE_MEDIA_MANIFEST_KEY?.trim() || "website/manifest.json";

export async function readManifest(): Promise<SiteMedia> {
  try {
    const result = await client.send(new GetObjectCommand({ Bucket: bucket(), Key: manifestKey() }));
    return normalizeSiteMedia(JSON.parse(await result.Body!.transformToString()));
  } catch (error) {
    if (error && typeof error === "object" && "name" in error && error.name === "NoSuchKey") return defaultSiteMedia;
    throw error;
  }
}

export async function writeManifest(media: SiteMedia) {
  await client.send(new PutObjectCommand({
    Bucket: bucket(), Key: manifestKey(), Body: JSON.stringify(media, null, 2), ContentType: "application/json",
    CacheControl: "public, max-age=60",
  }));
}

export async function createUpload(fileName: string, contentType: string, section: string) {
  const extension = fileName.toLowerCase().match(/\.[a-z0-9]{2,5}$/)?.[0] || "";
  const safeSection = section.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "other";
  const key = `website/${safeSection}/${Date.now()}-${crypto.randomUUID()}${extension}`;
  const command = new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 });
  const base = required("SITE_MEDIA_PUBLIC_BASE_URL").replace(/\/$/, "");
  return { uploadUrl, publicUrl: `${base}/${key}`, key };
}
