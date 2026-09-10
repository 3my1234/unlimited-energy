"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import type { SiteImage, SiteMedia } from "@/lib/site-media";
import styles from "./admin.module.css";

type Slot = "heroImage" | "processImage" | "projectVideo" | "projectPoster" | "projectCaptions";

export default function AdminDashboard() {
  const [media, setMedia] = useState<SiteMedia | null>(null);
  const [message, setMessage] = useState("Loading current media…");
  const [busy, setBusy] = useState(false);

  useEffect(() => { fetch("/api/admin/media").then(async r => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    setMedia(data); setMessage("");
  }).catch(e => setMessage(e.message)); }, []);

  async function upload(file: File, section: string) {
    const ticket = await fetch("/api/admin/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileName: file.name, contentType: file.type, section }) });
    const data = await ticket.json();
    if (!ticket.ok) throw new Error(data.error);
    const sent = await fetch(data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
    if (!sent.ok) throw new Error("S3 rejected the upload. Check the bucket CORS configuration.");
    return data.publicUrl as string;
  }

  async function choose(event: ChangeEvent<HTMLInputElement>, slot: Slot, index?: number) {
    const file = event.target.files?.[0]; if (!file || !media) return;
    setBusy(true); setMessage(`Uploading ${file.name}…`);
    try {
      const section = slot === "heroImage" ? "hero" : slot === "processImage" ? "process" : slot === "projectVideo" ? "project-video" : slot === "projectPoster" ? "project-poster" : slot === "projectCaptions" ? "project-captions" : "residential";
      const url = await upload(file, section);
      setMedia(current => {
        if (!current) return current;
        if (slot === "heroImage" || slot === "processImage") return { ...current, [slot]: { ...current[slot], url } };
        if (slot === "projectVideo") return { ...current, projectVideo: { ...current.projectVideo, url } };
        if (slot === "projectPoster") return { ...current, projectVideo: { ...current.projectVideo, poster: url } };
        if (slot === "projectCaptions") return { ...current, projectVideo: { ...current.projectVideo, captions: url } };
        const images = [...current.residentialImages]; images[index!] = { ...images[index!], url }; return { ...current, residentialImages: images };
      });
      setMessage("Upload complete. Click Publish changes to make it live.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Upload failed."); }
    finally { setBusy(false); event.target.value = ""; }
  }

  function updateImage(slot: "heroImage" | "processImage", change: Partial<SiteImage>) { setMedia(m => m && ({ ...m, [slot]: { ...m[slot], ...change } })); }
  function updateResidential(index: number, change: Partial<SiteImage>) { setMedia(m => { if (!m) return m; const images = [...m.residentialImages]; images[index] = { ...images[index], ...change }; return { ...m, residentialImages: images }; }); }
  function addResidential() { setMedia(m => m && ({ ...m, residentialImages: [...m.residentialImages, { url: "", alt: "Residential solar installation" }].slice(0, 8) })); }
  function removeResidential(index: number) { setMedia(m => m && ({ ...m, residentialImages: m.residentialImages.filter((_, i) => i !== index) })); }

  async function publish() {
    if (!media) return; setBusy(true); setMessage("Publishing…");
    try { const response = await fetch("/api/admin/media", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(media) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setMedia(data.media); setMessage("Published. The homepage may take up to five minutes to refresh everywhere."); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Publishing failed."); } finally { setBusy(false); }
  }

  if (!media) return <section className={styles.panel}><p>{message}</p></section>;
  return <div className={styles.dashboard}>
    <header className={styles.topbar}><div><p className={styles.kicker}>Unlimited Energy Systems</p><h1>Website media</h1></div><form action="/api/admin/logout" method="post"><button className={styles.secondary}>Sign out</button></form></header>
    <p className={styles.notice} aria-live="polite">{message || "Upload media, review the preview, then publish."}</p>
    <MediaCard title="Hero image" image={media.heroImage} onAlt={alt => updateImage("heroImage", { alt })} onFile={e => choose(e, "heroImage")} accept="image/jpeg,image/png,image/webp,image/avif" />
    <section className={styles.panel}><div className={styles.row}><div><h2>Residential gallery</h2><p>Up to eight horizontally scrollable images.</p></div><button className={styles.secondary} onClick={addResidential} disabled={media.residentialImages.length >= 8}>Add image</button></div><div className={styles.gallery}>{media.residentialImages.map((item, index) => <div className={styles.galleryItem} key={`${index}-${item.url}`}><Preview url={item.url} alt={item.alt} /><label>Alternative text<input value={item.alt} onChange={e => updateResidential(index, { alt: e.target.value })} /></label><label className={styles.file}>Replace image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => choose(e, "residentialImages" as Slot, index)} disabled={busy} /></label><button className={styles.danger} onClick={() => removeResidential(index)} disabled={media.residentialImages.length <= 1}>Remove from site</button></div>)}</div></section>
    <section className={styles.panel}><h2>Project video</h2><div className={styles.videoGrid}><Upload label="Upload MP4 or WebM" accept="video/mp4,video/webm" onFile={e => choose(e, "projectVideo")} busy={busy} /><Upload label="Upload poster image" accept="image/jpeg,image/png,image/webp,image/avif" onFile={e => choose(e, "projectPoster")} busy={busy} /><Upload label="Upload WebVTT captions" accept="text/vtt,.vtt" onFile={e => choose(e, "projectCaptions")} busy={busy} /></div>{media.projectVideo.poster && <Preview url={media.projectVideo.poster} alt="Current project video poster" />}</section>
    <MediaCard title="Process image" image={media.processImage} onAlt={alt => updateImage("processImage", { alt })} onFile={e => choose(e, "processImage")} accept="image/jpeg,image/png,image/webp,image/avif" />
    <div className={styles.publish}><button onClick={publish} disabled={busy}>Publish changes</button></div>
  </div>;
}

function Preview({ url, alt }: SiteImage) {
  // eslint-disable-next-line @next/next/no-img-element -- user-managed S3/CloudFront URLs
  return url ? <img className={styles.preview} src={url} alt={alt} /> : <div className={styles.empty}>Choose an image</div>;
}
function Upload({ label, accept, onFile, busy }: { label: string; accept: string; onFile: (e: ChangeEvent<HTMLInputElement>) => void; busy: boolean }) { return <label className={styles.file}>{label}<input type="file" accept={accept} onChange={onFile} disabled={busy} /></label>; }
function MediaCard({ title, image, onAlt, onFile, accept }: { title: string; image: SiteImage; onAlt: (v: string) => void; onFile: (e: ChangeEvent<HTMLInputElement>) => void; accept: string }) { return <section className={styles.panel}><h2>{title}</h2><div className={styles.mediaRow}><Preview {...image} /><div><label>Alternative text<input value={image.alt} onChange={e => onAlt(e.target.value)} /></label><Upload label="Replace image" accept={accept} onFile={onFile} busy={false} /></div></div></section>; }
