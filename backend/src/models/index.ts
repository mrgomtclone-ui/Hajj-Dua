import { Schema, model, Types } from "mongoose";
const LANGS = ["ar", "en", "ta", "ur"] as const;
const opts = { timestamps: true } as const;

const duaSchema = new Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  titles: { en: String, ta: String, ur: String },
  category: { type: String, required: true, index: true },
  kind: { type: String, enum: ["quran", "hadith", "general", "demo"], required: true },
  arabicText: { type: String, required: true },
  arabicNorm: { type: String, index: true }, // diacritics-stripped, for search
  transliteration: String,
  transliterations: { en: String, ta: String, ur: String },
  translations: { en: String, ta: String, ur: String },
  source: String, reference: String, grading: String, repetitions: Number,
  order: { type: Number, default: 0 },
  audioUrl: String,
  audioEnglishUrl: String,
  audioTamilUrl: String,
  audioUrduUrl: String,
  audioTitleEnglishUrl: String,
  audioTitleTamilUrl: String,
  audioTitleUrduUrl: String,
  verified: { type: Boolean, default: false }, // false => UI shows a "demo" label
}, opts);
duaSchema.index({ title: "text", "translations.en": "text", reference: "text" });
export const Dua = model("Dua", duaSchema);

const trackSchema = new Schema({
  dua: { type: Types.ObjectId, ref: "Dua", required: true, index: true },
  language: { type: String, enum: LANGS, required: true },
  speaker: String, durationSec: { type: Number, required: true },
  storageKey: { type: String, required: true }, // file/object key; never the binary
  mimeType: { type: String, default: "audio/mpeg" },
  sizeBytes: Number, checksum: String, licence: { type: String, required: true },
}, opts);
trackSchema.index({ dua: 1, language: 1, speaker: 1 }, { unique: true });
export const AudioTrack = model("AudioTrack", trackSchema);

const playlistSchema = new Schema({
  clientId: { type: String, required: true }, // id created offline on the device
  owner: { type: String, required: true, index: true }, // deviceId until Phase 5 auth
  title: { type: String, required: true, maxlength: 80 },
  items: [{ _id: false, duaId: { type: String, required: true }, position: Number }],
  deleted: { type: Boolean, default: false },
}, opts);
playlistSchema.index({ owner: 1, clientId: 1 }, { unique: true });
export const Playlist = model("Playlist", playlistSchema);

const bookmarkSchema = new Schema({ owner: { type: String, required: true }, duaId: { type: String, required: true } }, opts);
bookmarkSchema.index({ owner: 1, duaId: 1 }, { unique: true });
export const Bookmark = model("Bookmark", bookmarkSchema);

const opSchema = new Schema({ opId: { type: String, required: true }, owner: { type: String, required: true } }, opts);
opSchema.index({ owner: 1, opId: 1 }, { unique: true }); // duplicate-operation protection
export const SyncOp = model("SyncOp", opSchema);

const userSchema = new Schema({ email: { type: String, required: true, unique: true, lowercase: true, trim: true }, passwordHash: { type: String, required: true }, name: String, preferences: { type: Schema.Types.Mixed, default: {} } }, opts);
export const User = model("User", userSchema);
