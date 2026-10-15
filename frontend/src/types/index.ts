export type Lang = "ar" | "en" | "ta" | "ur";
export interface TrackRef { id: string; url: string; duration: number; speaker?: string }
export interface QueueItem { duaId: string; title: string; tracks: Partial<Record<Lang, TrackRef>> }
export type RepeatMode = "off" | "one" | "all";
export interface PlayerState {
  queue: QueueItem[]; index: number; lang: Lang; playing: boolean; loading: boolean;
  currentTime: number; duration: number; speed: number; repeat: RepeatMode; shuffle: boolean;
  error: string | null; // user-readable, e.g. "No Tamil audio for this dua"
}
export interface Playlist { id: string; title: string; duaIds: string[]; createdAt: number; updatedAt: number; syncStatus: "synced" | "pending" | "conflict" }
export type SyncOp =
  | { opId: string; type: "playlist.upsert"; baseUpdatedAt: number | null; data: { clientId: string; title: string; duaIds: string[] } }
  | { opId: string; type: "playlist.delete"; clientId: string };
