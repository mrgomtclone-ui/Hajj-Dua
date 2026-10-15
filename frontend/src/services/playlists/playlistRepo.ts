import type { Playlist, SyncOp } from "../../types";
// Local-first playlist repository. Phase 3 persists to localStorage behind this interface;
// Phase 4 replaces `Store` with Dexie/IndexedDB without touching callers.
export interface Store { load(): { playlists: Playlist[]; queue: SyncOp[] }; save(s: { playlists: Playlist[]; queue: SyncOp[] }): void }
export const localStorageStore = (key = "noor-playlists"): Store => ({
  load() { try { return JSON.parse(localStorage.getItem(key) ?? "") } catch { return { playlists: [], queue: [] } } },
  save(s) { try { localStorage.setItem(key, JSON.stringify(s)) } catch { /* quota: surface in Phase 4 storage UI */ } },
});
const uid = () => crypto.randomUUID();

export class PlaylistRepo {
  private s; constructor(private store: Store = localStorageStore(), private now = () => Date.now()) { this.s = store.load(); }
  list() { return [...this.s.playlists].sort((a, b) => b.updatedAt - a.updatedAt); }
  get(id: string) { return this.s.playlists.find(p => p.id === id); }
  create(title: string) { const t = this.now(); const p: Playlist = { id: uid(), title: title.trim() || "Untitled", duaIds: [], createdAt: t, updatedAt: t, syncStatus: "pending" }; this.s.playlists.push(p); this.touch(p, null); return p; }
  rename(id: string, title: string) { return this.edit(id, p => { p.title = title.trim() || p.title; }); }
  add(id: string, duaId: string) { return this.edit(id, p => { if (!p.duaIds.includes(duaId)) p.duaIds.push(duaId); }); } // no duplicates
  remove(id: string, duaId: string) { return this.edit(id, p => { p.duaIds = p.duaIds.filter(d => d !== duaId); }); }
  reorder(id: string, from: number, to: number) { return this.edit(id, p => { const [m] = p.duaIds.splice(from, 1); if (m) p.duaIds.splice(to, 0, m); }); }
  delete(id: string) {
    this.s.playlists = this.s.playlists.filter(p => p.id !== id);
    this.s.queue = this.s.queue.filter(o => !(o.type === "playlist.upsert" && o.data.clientId === id)); // drop obsolete upserts
    this.s.queue.push({ opId: uid(), type: "playlist.delete", clientId: id }); this.store.save(this.s);
  }
  pendingOps() { return [...this.s.queue]; }
  // Called by the Phase 5 sync service after PUT /api/sync
  applyResults(results: { opId: string; status: "applied" | "duplicate" | "conflict"; server?: { id: string; title: string; duaIds: string[]; updatedAt: number } }[]) {
    for (const r of results) {
      const op = this.s.queue.find(o => o.opId === r.opId); if (!op) continue;
      const p = op.type === "playlist.upsert" ? this.get(op.data.clientId) : undefined;
      if (r.status === "conflict") { if (p) p.syncStatus = "conflict"; continue; } // keep op + local copy until the user resolves it
      this.s.queue = this.s.queue.filter(o => o.opId !== r.opId);
      if (p && !this.s.queue.some(o => o.type === "playlist.upsert" && o.data.clientId === p.id)) p.syncStatus = "synced";
    }
    this.store.save(this.s);
  }
  private edit(id: string, fn: (p: Playlist) => void) { const p = this.get(id); if (!p) return undefined; const base = p.syncStatus === "synced" ? p.updatedAt : this.baseOf(id); fn(p); p.updatedAt = this.now(); this.touch(p, base); return p; }
  private baseOf(id: string) { const o = this.s.queue.find(o => o.type === "playlist.upsert" && o.data.clientId === id); return o && o.type === "playlist.upsert" ? o.baseUpdatedAt : null; }
  private touch(p: Playlist, base: number | null) {
    p.syncStatus = "pending";
    this.s.queue = this.s.queue.filter(o => !(o.type === "playlist.upsert" && o.data.clientId === p.id)); // coalesce: latest state wins
    this.s.queue.push({ opId: uid(), type: "playlist.upsert", baseUpdatedAt: base, data: { clientId: p.id, title: p.title, duaIds: [...p.duaIds] } });
    this.store.save(this.s);
  }
}

// --- Phase 5 additions (declared on the class prototype to keep the Phase 3 file diff small) ---
declare module "./playlistRepo" { interface PlaylistRepo { importSynced(p: Playlist): void; requeue(id: string, serverUpdatedAt: number): void } }
PlaylistRepo.prototype.importSynced = function (this: any, p: Playlist) {
  this.s.playlists = [...this.s.playlists.filter((x: Playlist) => x.id !== p.id), p];
  this.s.queue = this.s.queue.filter((o: SyncOp) => !(o.type === "playlist.upsert" && o.data.clientId === p.id)); this.store.save(this.s);
};
PlaylistRepo.prototype.requeue = function (this: any, id: string, base: number) { const p = this.get(id); if (p) this.touch(p, base); };
