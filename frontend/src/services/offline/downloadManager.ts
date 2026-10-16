import { db } from "../../db/indexedDb";
import type { DuaItem } from "../../types";

const CACHE_NAME = "haj-duas-v4";

export interface DownloadState {
  downloadedIds: Set<string>;
  downloadingIds: Set<string>;
  progress: Record<string, number>; // 0 to 100
  totalSizeBytes: number;
}

export class DownloadManager {
  private downloaded = new Set<string>();
  private downloading = new Set<string>();
  private progress: Record<string, number> = {};
  private listeners = new Set<(state: DownloadState) => void>();
  private blobUrls = new Map<string, string>();

  constructor() {
    this.init();
  }

  public subscribe(fn: (state: DownloadState) => void): () => void {
    this.listeners.add(fn);
    fn(this.getState());
    return () => this.listeners.delete(fn);
  }

  public getState(): DownloadState {
    return {
      downloadedIds: new Set(this.downloaded),
      downloadingIds: new Set(this.downloading),
      progress: { ...this.progress },
      totalSizeBytes: 0
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  public async init() {
    try {
      // 1. Check IndexedDB audio table
      const stored = await db.audio.toArray();
      for (const item of stored) {
        this.downloaded.add(item.duaId || item.id);
        if (item.audioBlob) {
          const url = URL.createObjectURL(item.audioBlob);
          this.blobUrls.set(item.duaId || item.id, url);
        }
      }

      // 2. Check Cache Storage for cached audio URLs
      if ("caches" in window) {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        for (const req of keys) {
          if (req.url.includes("/Duas/")) {
            // Found audio in cache
          }
        }
      }
    } catch (err) {
      console.warn("Failed to init downloads from DB:", err);
    }
    this.notify();
  }

  public async pruneOrphans(activeDuas: DuaItem[]) {
    if (!activeDuas || activeDuas.length === 0) return;
    const activeIds = new Set(activeDuas.map((d) => d._id));
    try {
      const stored = await db.audio.toArray();
      let changed = false;
      for (const item of stored) {
        const primaryId = item.id;
        const duaId = item.duaId;
        const matchesActive = activeIds.has(primaryId) || (duaId && activeIds.has(duaId));
        if (!matchesActive) {
          changed = true;
          await db.audio.delete(primaryId);
          if (duaId && duaId !== primaryId) {
            await db.audio.delete(duaId);
          }
          if (this.blobUrls.has(primaryId)) {
            URL.revokeObjectURL(this.blobUrls.get(primaryId)!);
            this.blobUrls.delete(primaryId);
          }
          if (duaId && this.blobUrls.has(duaId)) {
            URL.revokeObjectURL(this.blobUrls.get(duaId)!);
            this.blobUrls.delete(duaId);
          }
          this.downloaded.delete(primaryId);
          if (duaId) this.downloaded.delete(duaId);
        }
      }
      if (changed) {
        this.notify();
      }
    } catch (err) {
      console.warn("Failed to prune orphan audio:", err);
    }
  }

  public isDownloaded(id: string): boolean {
    return this.downloaded.has(id);
  }

  public isDownloading(id: string): boolean {
    return this.downloading.has(id);
  }

  public getProgress(id: string): number {
    return this.progress[id] || 0;
  }

  public getAudioUrl(dua: DuaItem, lang?: "en" | "ta" | "ur" | "ar"): string {
    if (this.blobUrls.has(dua._id)) {
      return this.blobUrls.get(dua._id)!;
    }
    if (lang === "en") return dua.audioEnglishUrl || dua.audioUrl || "";
    if (lang === "ta") return dua.audioTamilUrl || dua.audioUrl || "";
    if (lang === "ur") return dua.audioUrduUrl || dua.audioUrl || "";
    return dua.audioUrl || dua.audioEnglishUrl || dua.audioTamilUrl || dua.audioUrduUrl || "";
  }

  public async download(dua: DuaItem, lang?: "en" | "ta" | "ur" | "ar"): Promise<boolean> {
    const targetUrl = this.getAudioUrl(dua, lang);
    if (!targetUrl) return false;
    if (this.downloaded.has(dua._id)) return true;
    if (this.downloading.has(dua._id)) return false;

    this.downloading.add(dua._id);
    this.progress[dua._id] = 10;
    this.notify();

    try {
      const audioUrl = encodeURI(targetUrl);
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      this.progress[dua._id] = 50;
      this.notify();

      // Clone response for Cache Storage
      const responseClone = response.clone();
      if ("caches" in window) {
        try {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(audioUrl, responseClone);
        } catch (e) {
          console.warn("Cache put failed:", e);
        }
      }

      const blob = await response.blob();
      this.progress[dua._id] = 85;
      this.notify();

      // Save to IndexedDB
      await db.audio.put({
        id: dua._id,
        duaId: dua._id,
        language: "ar",
        title: dua.title,
        duration: 0,
        audioBlob: blob,
        downloadedAt: Date.now(),
        sizeBytes: blob.size
      });

      // Create local object URL for offline playback
      const objectUrl = URL.createObjectURL(blob);
      this.blobUrls.set(dua._id, objectUrl);

      this.downloaded.add(dua._id);
      this.progress[dua._id] = 100;
      return true;
    } catch (err) {
      console.error(`Failed to download audio for ${dua.title}:`, err);
      return false;
    } finally {
      this.downloading.delete(dua._id);
      delete this.progress[dua._id];
      this.notify();
    }
  }

  public async remove(duaId: string, audioUrl?: string): Promise<void> {
    try {
      await db.audio.delete(duaId);
      if (this.blobUrls.has(duaId)) {
        URL.revokeObjectURL(this.blobUrls.get(duaId)!);
        this.blobUrls.delete(duaId);
      }
      if (audioUrl && "caches" in window) {
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(audioUrl);
      }
      this.downloaded.delete(duaId);
    } catch (err) {
      console.warn("Failed to remove download:", err);
    } finally {
      this.notify();
    }
  }

  public async downloadAll(duas: DuaItem[]): Promise<void> {
    const audioDuas = duas.filter((d) => Boolean(d.audioUrl || d.audioEnglishUrl || d.audioTamilUrl || d.audioUrduUrl));
    for (const d of audioDuas) {
      if (!this.downloaded.has(d._id)) {
        await this.download(d);
      }
    }
  }

  public async removeAll(duas: DuaItem[]): Promise<void> {
    try {
      for (const d of duas) {
        if (this.downloaded.has(d._id)) {
          await this.remove(d._id, d.audioUrl);
        }
      }
      // Also purge any lingering / orphaned records
      await db.audio.clear();
      this.blobUrls.forEach((url) => URL.revokeObjectURL(url));
      this.blobUrls.clear();
      this.downloaded.clear();
      this.downloading.clear();
      this.progress = {};
    } catch (err) {
      console.warn("Failed to remove all downloads:", err);
    } finally {
      this.notify();
    }
  }

  public async getTotalStorage(): Promise<{ usedBytes: number; count: number }> {
    try {
      const stored = await db.audio.toArray();
      let total = 0;
      for (const item of stored) {
        total += item.sizeBytes || item.audioBlob?.size || 0;
      }
      return { usedBytes: total, count: stored.length };
    } catch {
      return { usedBytes: 0, count: this.downloaded.size };
    }
  }
}

export const downloadManager = new DownloadManager();
