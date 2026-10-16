import { Router } from "express";
import fs from "node:fs"; import path from "node:path";
import { Dua, AudioTrack, Playlist, Bookmark, SyncOp } from "../models/index.js";
import { listQuery, playlistInput, syncBody } from "../validators/index.js";
import { ok, wrap, owner, HttpError } from "../utils/http.js";
import { env } from "../config/env.js";
import { seedDatabase } from "../seed/seed.js";
export const api = Router();
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const norm = (s: string) => s.normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g, "");

api.get("/health", (_q, r) => ok(r, { status: "up" }));
api.get("/seed", wrap(async (_q, r) => ok(r, { seeded: await seedDatabase(true), message: "Database seeded successfully" })));
api.get("/categories", wrap(async (_q, r) => ok(r, await Dua.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { _id: 1 } }]))));

api.get("/duas", wrap(async (req, res) => {
  const { q, category, lang, page, limit } = listQuery.parse(req.query);
  const f: Record<string, unknown> = {};
  if (category) f.category = category;
  if (q) { const rx = new RegExp(esc(q), "i"); f.$or = [{ title: rx }, { "translations.en": rx }, { "translations.ta": rx }, { "translations.ur": rx }, { transliteration: rx }, { "transliterations.ta": rx }, { reference: rx }, { arabicNorm: new RegExp(esc(norm(q))) }]; }
  if (lang) f._id = { $in: await AudioTrack.distinct("dua", { language: lang }) };
  const [items, total] = await Promise.all([Dua.find(f).sort({ order: 1, createdAt: 1 }).skip((page - 1) * limit).limit(limit).lean(), Dua.countDocuments(f)]);
  ok(res, items, { page, limit, total });
}));
api.get("/duas/:id", wrap(async (req, res) => {
  const id = req.params.id;
  const d = await Dua.findOne({ $or: [{ slug: id }, ...(/^[a-f\d]{24}$/i.test(id) ? [{ _id: id }] : [])] }).lean();
  if (!d) throw new HttpError(404, "Dua not found"); ok(res, d);
}));
api.get("/duas/:id/audio", wrap(async (req, res) => ok(res, await AudioTrack.find({ dua: req.params.id }).select("-storageKey").lean())));

// Streaming with HTTP Range (local disk; swap the read stream for S3/R2 later)
api.get("/audio/:id/stream", wrap(async (req, res) => {
  const t = await AudioTrack.findById(req.params.id).lean(); if (!t) throw new HttpError(404, "Track not found");
  const file = path.resolve(env.AUDIO_DIR, path.basename(t.storageKey));
  if (!fs.existsSync(file)) throw new HttpError(404, "Audio file not uploaded yet");
  const size = fs.statSync(file).size; const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? "");
  res.setHeader("Accept-Ranges", "bytes"); res.setHeader("Content-Type", t.mimeType ?? "audio/mpeg");
  if (!m) { res.setHeader("Content-Length", size); return void fs.createReadStream(file).pipe(res); }
  const start = m[1] ? +m[1] : 0, end = m[2] ? Math.min(+m[2], size - 1) : size - 1;
  if (start > end || start >= size) { res.status(416).setHeader("Content-Range", `bytes */${size}`); return void res.end(); }
  res.status(206).set({ "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) });
  fs.createReadStream(file, { start, end }).pipe(res);
}));

const pl = (p: any) => ({ id: p.clientId, title: p.title, duaIds: p.items.map((i: any) => i.duaId), updatedAt: new Date(p.updatedAt).getTime() });
const toItems = (ids: string[]) => ids.map((duaId, position) => ({ duaId, position }));
api.get("/playlists", wrap(async (req, res) => ok(res, (await Playlist.find({ owner: owner(req), deleted: false }).lean()).map(pl))));
api.post("/playlists", wrap(async (req, res) => { // idempotent upsert on clientId
  const b = playlistInput.parse(req.body);
  const p = await Playlist.findOneAndUpdate({ owner: owner(req), clientId: b.clientId }, { title: b.title, deleted: false, items: toItems(b.duaIds) }, { upsert: true, new: true });
  res.status(201); ok(res, pl(p));
}));
api.get("/playlists/:id", wrap(async (req, res) => { const p = await Playlist.findOne({ owner: owner(req), clientId: req.params.id, deleted: false }).lean(); if (!p) throw new HttpError(404, "Playlist not found"); ok(res, pl(p)); }));
api.patch("/playlists/:id", wrap(async (req, res) => {
  const b = playlistInput.partial().parse(req.body); const u: any = {};
  if (b.title) u.title = b.title; if (b.duaIds) u.items = toItems(b.duaIds);
  const p = await Playlist.findOneAndUpdate({ owner: owner(req), clientId: req.params.id, deleted: false }, u, { new: true });
  if (!p) throw new HttpError(404, "Playlist not found"); ok(res, pl(p));
}));
api.delete("/playlists/:id", wrap(async (req, res) => { await Playlist.updateOne({ owner: owner(req), clientId: req.params.id }, { deleted: true }); res.status(204).end(); }));
api.post("/playlists/:id/items", wrap(async (req, res) => {
  const duaId = String(req.body?.duaId ?? ""); if (!duaId) throw new HttpError(400, "duaId required");
  const o = owner(req);
  const p = await Playlist.findOneAndUpdate({ owner: o, clientId: req.params.id, "items.duaId": { $ne: duaId } }, { $push: { items: { duaId } } }, { new: true })
    ?? await Playlist.findOne({ owner: o, clientId: req.params.id }); // already present => idempotent
  if (!p) throw new HttpError(404, "Playlist not found"); ok(res, pl(p));
}));
api.delete("/playlists/:id/items/:duaId", wrap(async (req, res) => {
  const p = await Playlist.findOneAndUpdate({ owner: owner(req), clientId: req.params.id }, { $pull: { items: { duaId: req.params.duaId } } }, { new: true });
  if (!p) throw new HttpError(404, "Playlist not found"); ok(res, pl(p));
}));

api.get("/bookmarks", wrap(async (req, res) => ok(res, (await Bookmark.find({ owner: owner(req) }).lean()).map(b => b.duaId))));
api.put("/bookmarks/:duaId", wrap(async (req, res) => { await Bookmark.updateOne({ owner: owner(req), duaId: req.params.duaId }, {}, { upsert: true }); res.status(204).end(); }));
api.delete("/bookmarks/:duaId", wrap(async (req, res) => { await Bookmark.deleteOne({ owner: owner(req), duaId: req.params.duaId }); res.status(204).end(); }));

// Offline sync: each op applies once (opId); stale edits come back as conflicts for the client to resolve
api.put("/sync", wrap(async (req, res) => {
  const o = owner(req), { ops } = syncBody.parse(req.body), results: object[] = [];
  for (const op of ops) {
    try { await SyncOp.create({ opId: op.opId, owner: o }); } catch { results.push({ opId: op.opId, status: "duplicate" }); continue; }
    if (op.type === "playlist.delete") { await Playlist.updateOne({ owner: o, clientId: op.clientId }, { deleted: true }); results.push({ opId: op.opId, status: "applied" }); continue; }
    const cur = await Playlist.findOne({ owner: o, clientId: op.data.clientId });
    if (cur && op.baseUpdatedAt !== null && new Date((cur as any).updatedAt).getTime() > op.baseUpdatedAt) { results.push({ opId: op.opId, status: "conflict", server: pl(cur) }); continue; }
    const p = await Playlist.findOneAndUpdate({ owner: o, clientId: op.data.clientId }, { title: op.data.title, deleted: false, items: toItems(op.data.duaIds) }, { upsert: true, new: true });
    results.push({ opId: op.opId, status: "applied", server: pl(p) });
  }
  ok(res, results);
}));
