import Dexie, { type Table } from "dexie";
import type { Lang, Playlist, SyncOp } from "../types";
export interface OfflineDua { id: string; title: string; category: string; arabicText: string; transliteration?: string; translations: { en?: string; ta?: string; ur?: string }; reference?: string; kind: string; verified: boolean; savedAt: number; searchText: string; audioUrl?: string }
export interface OfflineAudio { id: string; duaId: string; language: Lang; title: string; speaker?: string; duration: number; audioBlob: Blob; downloadedAt: number; sizeBytes?: number; checksum?: string }
class NoorDB extends Dexie {
  duas!: Table<OfflineDua, string>; audio!: Table<OfflineAudio, string>;
  playlists!: Table<Playlist, string>; queue!: Table<SyncOp, string>;
  favorites!: Table<{ duaId: string }, string>; prefs!: Table<{ key: string; value: unknown }, string>;
  constructor() {
    super("noor");
    this.version(1).stores({ duas: "id, category, savedAt", audio: "id, duaId, language", playlists: "id, updatedAt", queue: "opId", favorites: "duaId", prefs: "key" });
  }
}
export const db = new NoorDB();
export const searchKey = (s: string) => s.normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g, "").toLowerCase();
// Offline search over saved duas: Arabic marks stripped, so a plain-letter query still matches
export async function searchOffline(q: string, opts: { category?: string; downloadedOnly?: boolean } = {}) {
  const k = searchKey(q.trim()); let r = await db.duas.toArray();
  if (opts.category) r = r.filter(d => d.category === opts.category);
  return k ? r.filter(d => d.searchText.includes(k)) : r;
}
