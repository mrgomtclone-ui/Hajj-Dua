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

export type TranslationLang = "en" | "ta" | "ur";

export interface AudioSelectionConfig {
  playArabic: boolean;
  playTranslation: boolean;
  onlyRead: boolean;
}

export interface DuaItem {
  _id: string;
  slug: string;
  title: string;
  titles?: Partial<Record<TranslationLang, string>>;
  category: string;
  kind: "quran" | "hadith" | "general" | "demo";
  arabicText: string;
  transliteration?: string;
  transliterations?: Partial<Record<TranslationLang, string>>;
  translations: {
    en?: string;
    ur?: string;
    ta?: string;
  };
  reference?: string;
  source?: string;
  order?: number;
  tags?: string[];
  verified?: boolean;
  audioUrl?: string;
  audioEnglishUrl?: string;
  audioTamilUrl?: string;
  audioUrduUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
}

export interface EventInfo {
  title: string;
  subtitle?: string;
  details: string;
  points: string[];
  actionLabel: string;
  onAction: () => void;
}
