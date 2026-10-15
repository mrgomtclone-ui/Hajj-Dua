import { api, ApiError, OfflineError } from "../api/client"; import type { PlaylistRepo } from "../playlists/playlistRepo";
type Result = Parameters<PlaylistRepo["applyResults"]>[0];
export type SyncStatus = "idle" | "syncing" | "offline" | "signed-out" | "error";
export class SyncService {
  status: SyncStatus = "idle"; private running = false; private fails = 0; private timer?: number; private subs = new Set<(s: SyncStatus) => void>();
  constructor(private repo: PlaylistRepo) {}
  onStatus(f: (s: SyncStatus) => void) { this.subs.add(f); return () => this.subs.delete(f); }
  private set(s: SyncStatus) { this.status = s; this.subs.forEach(f => f(s)); }
  // Triggers: app startup, connectivity returns, user taps "Sync now". Background Sync is deliberately not relied on.
  start() { void this.run(); addEventListener("online", () => void this.run()); }
  async run() {
    if (this.running) return; const ops = this.repo.pendingOps(); if (!ops.length) return this.set("idle");
    if (!navigator.onLine) return this.set("offline");
    this.running = true; this.set("syncing");
    try {
      for (let i = 0; i < ops.length; i += 100) this.repo.applyResults(await api<Result>("/sync", { method: "PUT", body: JSON.stringify({ ops: ops.slice(i, i + 100) }) })); // opIds make a retry safe
      this.fails = 0; this.set("idle");
    } catch (e) {
      if (e instanceof OfflineError) this.set("offline");
      else if (e instanceof ApiError && e.status === 401) this.set("signed-out"); // keep local changes; resume after login
      else { this.set("error"); this.timer = window.setTimeout(() => void this.run(), Math.min(60_000, 2 ** ++this.fails * 1000)); } // exponential backoff
    } finally { this.running = false; }
  }
  // Pull server playlists we don't have yet (first sign-in on a new device)
  async pull() {
    const remote = await api<{ id: string; title: string; duaIds: string[]; updatedAt: number }[]>("/playlists");
    for (const r of remote) if (!this.repo.get(r.id)) this.repo.importSynced({ id: r.id, title: r.title, duaIds: r.duaIds, createdAt: r.updatedAt, updatedAt: r.updatedAt, syncStatus: "synced" });
  }
  // Conflict choices: keep the device copy (re-queued against the server's version) or take the server copy
  resolve(id: string, keep: "mine" | "server", server: { title: string; duaIds: string[]; updatedAt: number }) {
    if (keep === "server") this.repo.importSynced({ id, createdAt: server.updatedAt, syncStatus: "synced", ...server }); else this.repo.requeue(id, server.updatedAt);
    void this.run();
  }
}
