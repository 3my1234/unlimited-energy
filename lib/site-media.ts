export type SiteImage = { url: string; alt: string };

export type SiteMedia = {
  heroImage: SiteImage;
  residentialImages: SiteImage[];
  projectVideo: { url: string | null; poster: string; captions: string | null };
  processImage: SiteImage;
};

const defaults: SiteMedia = {
  heroImage: {
    url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2400&q=88",
    alt: "Solar panels installed on a modern home",
  },
  residentialImages: [
    {
      url: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=2400&q=88",
      alt: "Solar panels installed on a family home",
    },
    {
      url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2400&q=88",
      alt: "Aerial view of a rooftop solar installation",
    },
    {
      url: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=2400&q=88",
      alt: "Solar-powered home in the evening",
    },
  ],
  projectVideo: {
    url: null,
    poster: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2400&q=88",
    captions: null,
  },
  processImage: {
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=85",
    alt: "Technician installing rooftop solar panels",
  },
};

function publicUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function image(value: unknown, fallback: SiteImage): SiteImage {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Record<string, unknown>;
  return {
    url: publicUrl(candidate.url) ?? fallback.url,
    alt: typeof candidate.alt === "string" && candidate.alt.trim()
      ? candidate.alt.trim()
      : fallback.alt,
  };
}

export async function getSiteMedia(): Promise<SiteMedia> {
  const manifestUrl = publicUrl(process.env.SITE_MEDIA_MANIFEST_URL);
  if (!manifestUrl) return defaults;

  try {
    const response = await fetch(manifestUrl, { next: { revalidate: 300 } });
    if (!response.ok) return defaults;
    const manifest = await response.json() as Record<string, unknown>;
    const residential = Array.isArray(manifest.residentialImages)
      ? manifest.residentialImages.slice(0, 8).map((item, index) =>
          image(item, defaults.residentialImages[index % defaults.residentialImages.length]))
      : defaults.residentialImages;
    const video = manifest.projectVideo && typeof manifest.projectVideo === "object"
      ? manifest.projectVideo as Record<string, unknown>
      : {};

    return {
      heroImage: image(manifest.heroImage, defaults.heroImage),
      residentialImages: residential.length ? residential : defaults.residentialImages,
      projectVideo: {
        url: publicUrl(video.url),
        poster: publicUrl(video.poster) ?? defaults.projectVideo.poster,
        captions: publicUrl(video.captions),
      },
      processImage: image(manifest.processImage, defaults.processImage),
    };
  } catch {
    return defaults;
  }
}
