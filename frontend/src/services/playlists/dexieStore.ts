import { db } from "../../db/indexedDb"; import type { Store } from "./playlistRepo";
// Hydrate once at startup, then serve sync reads from memory and write through to IndexedDB.
export async function createDexieStore(): Promise<Store> {
  let s = { playlists: await db.playlists.toArray(), queue: await db.queue.toArray() };
  return { load: () => s, save(next) { s = next;
    void db.transaction("rw", db.playlists, db.queue, async () => { await db.playlists.clear(); await db.playlists.bulkPut(next.playlists); await db.queue.clear(); await db.queue.bulkPut(next.queue); }); } };
}
