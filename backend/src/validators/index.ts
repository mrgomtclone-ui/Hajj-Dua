import { z } from "zod";
export const listQuery = z.object({
  q: z.string().trim().max(100).optional(), category: z.string().optional(),
  lang: z.enum(["ar", "en", "ta", "ur"]).optional(),
  page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(200).default(20),
});
export const playlistInput = z.object({
  clientId: z.string().min(1).max(64), title: z.string().trim().min(1).max(80),
  duaIds: z.array(z.string()).max(500).default([]),
});
export const syncBody = z.object({ ops: z.array(z.discriminatedUnion("type", [
  z.object({ opId: z.string(), type: z.literal("playlist.upsert"), baseUpdatedAt: z.number().nullable(), data: playlistInput }),
  z.object({ opId: z.string(), type: z.literal("playlist.delete"), clientId: z.string() }),
])).max(100) });
