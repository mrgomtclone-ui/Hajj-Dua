import { db, searchKey, type OfflineDua } from "../../db/indexedDb";
import type { Lang, TrackRef } from "../../types";
import type { UrlResolver } from "../audio/player";
import { API_BASE } from "../api/client";
export const hasAudio = async (id: string) => !!(await db.audio.get(id)); // never re-download a valid local copy
export const saveDuaText = (d: Omit<OfflineDua, "savedAt" | "searchText">) =>
  db.duas.put({ ...d, savedAt: Date.now(), searchText: searchKey([d.title, d.arabicText, d.translations.en, d.translations.ta, d.translations.ur, d.reference, d.category].filter(Boolean).join(" ")) });
export async function storageInfo() { const e = await navigator.storage?.estimate?.(); return { used: e?.usage ?? 0, quota: e?.quota ?? 0 }; }
const active = new Map<string, AbortController>();
export const cancelDownload = (id: string) => active.get(id)?.abort();

export async function downloadAudio(meta: { duaId: string; language: Lang; title: string; track: TrackRef }, onProgress?: (frac: number) => void) {
  const { track } = meta; if (await hasAudio(track.id)) return "exists" as const;
  const { used, quota } = await storageInfo(); // refuse early if a rough estimate says there's no room (~10 MB assumed if size unknown)
  if (quota && quota - used < 10_000_000) throw new Error("Not enough storage space. Remove some downloads and try again.");
  const ctl = new AbortController(); active.set(track.id, ctl);
  try {
    const res = await fetch(`${API_BASE}/api/audio/${track.id}/stream`, { signal: ctl.signal, credentials: "include" });
    if (!res.ok || !res.body) throw new Error(res.status === 404 ? "This audio is not available on the server yet." : "Download failed.");
    const total = +(res.headers.get("Content-Length") ?? 0), chunks: Uint8Array[] = [], reader = res.body.getReader(); let got = 0;
    for (;;) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); got += value.length; if (total) onProgress?.(got / total); }
    const blob = new Blob(chunks as BlobPart[], { type: res.headers.get("Content-Type") ?? "audio/mpeg" });
    try { await db.audio.put({ id: track.id, duaId: meta.duaId, language: meta.language, title: meta.title, speaker: track.speaker, duration: track.duration, audioBlob: blob, downloadedAt: Date.now(), sizeBytes: blob.size }); }
    catch (e) { if ((e as DOMException).name === "QuotaExceededError") throw new Error("Storage is full. Remove some downloads and try again."); throw e; }
    onProgress?.(1); return "downloaded" as const;
  } catch (e) { if ((e as Error).name === "AbortError") return "cancelled" as const; throw e; }
  finally { active.delete(track.id); }
}
export const removeAudio = (id: string) => db.audio.delete(id); // text in db.duas is untouched
// Local blob first, network URL otherwise; the player revokes the object URL when the track changes
export const offlineResolver: UrlResolver = async t => {
  const a = await db.audio.get(t.id); if (!a) return { url: t.url };
  const url = URL.createObjectURL(a.audioBlob); return { url, revoke: () => URL.revokeObjectURL(url) };
};
