import React from "react";
import {
  Bookmark,
  Sparkles,
  Volume2,
  Info,
  Play,
  Pause,
  Plus,
  Copy,
  Check,
  Share2,
  Trash2,
  Download,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal
} from "lucide-react";
import type { DuaItem, TranslationLang } from "../../types";

export interface DuaCardProps {
  dua: DuaItem & { verified?: boolean };
  selectedLang: TranslationLang;
  fontSizeLarge: boolean;
  isBookmarked: boolean;
  isPlaying: boolean;
  isPlayingAudio: boolean;
  audioDuration: number;
  audioCurrentTime: number;
  copiedId: string | null;
  isDownloaded?: boolean;
  isDownloading?: boolean;
  downloadProgress?: number;
  onPlay: (dua: DuaItem) => void;
  onToggleBookmark: (id: string) => void;
  onCopy: (dua: DuaItem) => void;
  onShare: (dua: DuaItem) => void;
  onAddToPlaylist: (dua: DuaItem) => void;
  onRemoveFromPlaylist?: (duaId: string) => void;
  onToggleDownload?: (dua: DuaItem) => void;
  onOpenAudioSelection?: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export const DuaCard: React.FC<DuaCardProps> = ({
  dua,
  selectedLang,
  fontSizeLarge,
  isBookmarked,
  isPlaying,
  isPlayingAudio,
  audioDuration,
  audioCurrentTime,
  copiedId,
  isDownloaded = false,
  isDownloading = false,
  downloadProgress = 0,
  onPlay,
  onToggleBookmark,
  onCopy,
  onShare,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  onToggleDownload,
  onOpenAudioSelection
}) => {
  const displayTitle = dua.titles?.[selectedLang] || dua.title;
  const translationText = dua.translations?.[selectedLang] || dua.translations?.en || "";

  // Transliteration display: Tamil when TA is selected, English when EN is selected
  let transliterationText = "";
  if (selectedLang === "ta") {
    transliterationText = dua.transliterations?.ta || "";
  } else if (selectedLang === "en") {
    transliterationText = dua.transliterations?.en || dua.transliteration || "";
  } else if (selectedLang === "ur") {
    transliterationText = dua.transliterations?.ur || "";
  }

  return (
    <div
      onClick={() => onPlay(dua)}
      className={`glass-card rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between relative group cursor-pointer ${
        isPlaying ? "playing-card" : ""
      }`}
      title="Click anywhere to play / pause audio"
    >
      {/* Top Metadata & Category */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="islamic-badge text-[11px] px-2.5 py-0.5 rounded-full">
              {dua.category}
            </span>

            {dua.verified && (
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--gold-bright)"
                }}
              >
                <Sparkles className="w-2.5 h-2.5" style={{ color: "var(--gold-bright)" }} />
                <span>Verified</span>
              </span>
            )}

            {/* Offline Downloaded Badge (Spotify/YouTube style) */}
            {isDownloaded ? (
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1"
                style={{
                  background: "rgba(16,185,129,0.18)",
                  color: "#10b981",
                  borderColor: "rgba(16,185,129,0.35)"
                }}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Downloaded ✓</span>
              </span>
            ) : dua.audioUrl ? (
              <span
                onClick={(e) => {
                  if (onOpenAudioSelection) {
                    e.stopPropagation();
                    onOpenAudioSelection();
                  }
                }}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 transition ${
                  onOpenAudioSelection ? "cursor-pointer hover:brightness-110 active:scale-95" : ""
                }`}
                style={{
                  background: isPlaying ? "rgba(20,196,187,0.22)" : "rgba(15,150,144,0.14)",
                  color: "var(--teal-bright)",
                  borderColor: isPlaying ? "rgba(20,196,187,0.5)" : "rgba(20,196,187,0.35)"
                }}
                title={onOpenAudioSelection ? "Configure Audio Selection (Recitation, Translation, Reading Mode)" : undefined}
              >
                <Volume2
                  className={`w-2.5 h-2.5 ${isPlaying ? "animate-pulse" : ""}`}
                  style={{ color: "var(--teal-bright)" }}
                />
                <span className="hidden sm:inline">
                  {isPlaying ? "Playing Now" : "Arabic Audio"}
                </span>
                <span className="sm:hidden">{isPlaying ? "Playing" : "Audio"}</span>
              </span>
            ) : null}

            <span className="text-[10px] uppercase font-bold" style={{ color: "var(--text-subtle)" }}>
              {dua.kind}
            </span>
          </div>

          {/* Top Right Actions: Download & Bookmark */}
          <div className="flex items-center gap-1.5">
            {/* Spotify-style Download Button */}
            {dua.audioUrl && onToggleDownload && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDownload(dua);
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition active:scale-90 shadow-sm ${
                  isDownloaded
                    ? "bg-[#10b981] text-slate-950 font-bold"
                    : isDownloading
                    ? "border border-emerald-500 text-emerald-500"
                    : "border hover:border-[#10b981] hover:text-[#10b981]"
                }`}
                style={
                  !isDownloaded && !isDownloading
                    ? {
                        background: "var(--bg-input)",
                        borderColor: "var(--border-gold)",
                        color: "var(--text-muted)"
                      }
                    : undefined
                }
                title={
                  isDownloaded
                    ? "Downloaded to offline storage (Click to delete)"
                    : isDownloading
                    ? `Downloading audio... ${downloadProgress}%`
                    : "Download for offline listening"
                }
              >
                {isDownloaded ? (
                  <Check className="w-5 h-5 stroke-[2.8]" />
                ) : isDownloading ? (
                  <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5 stroke-[2.2]" />
                )}
              </button>
            )}

            {/* Bookmark Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(dua._id);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition active:scale-90 shadow-sm"
              style={{
                background: isBookmarked ? "rgba(16,185,129,0.18)" : "var(--bg-input)",
                border: isBookmarked ? "1px solid var(--border-gold-md)" : "1px solid var(--border-gold)",
                color: isBookmarked ? "var(--gold-bright)" : "var(--text-muted)"
              }}
              title={isBookmarked ? "Remove Bookmark" : "Add to Bookmarks"}
            >
              <Bookmark className={`w-4.5 h-4.5 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Dua Title */}
        <h3
          className="mt-3 text-xl sm:text-2xl font-extrabold transition-colors leading-snug tracking-tight"
          style={{
            color: "var(--text-heading)",
            fontWeight: 800
          }}
        >
          {displayTitle}
        </h3>

        {/* Arabic Text (The Star of the Card - Bold & Extra Clear in Sunlight) */}
        <div className="arabic-block mt-4 transition-all">
          <p
            dir="rtl"
            className={`font-arabic font-bold text-right transition-all ${
              fontSizeLarge ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
            }`}
            style={{
              fontFamily: "'Amiri', 'Scheherazade New', serif",
              color: "var(--text-primary)",
              fontWeight: 700,
              lineHeight: fontSizeLarge ? 3.0 : 2.7,
              wordSpacing: "0.15em",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem"
            }}
          >
            {dua.arabicText}
          </p>
        </div>

        {/* Transliteration (shows Tamil when TA is selected, English when EN is selected - Bold) */}
        {transliterationText && (
          <p
            className="mt-4 text-base sm:text-lg italic font-sans font-bold leading-relaxed whitespace-pre-line tracking-wide"
            style={{
              color: "var(--translit-color, var(--teal-bright))",
              fontWeight: 700
            }}
          >
            "{transliterationText}"
          </p>
        )}

        {/* Translation (Semibold/Bold for high outdoor clarity) */}
        <div
          className="mt-3 text-base sm:text-lg font-sans font-semibold leading-[1.8] whitespace-pre-line space-y-1.5"
          style={{ color: "var(--text-primary)", fontWeight: 600 }}
        >
          {translationText}
        </div>

        {/* Reference & Source */}
        {(dua.reference || dua.source) && (
          <div className="mt-4 flex items-start gap-2 text-sm sm:text-base font-bold" style={{ color: "var(--text-muted)" }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 stroke-[2.5]" style={{ color: "var(--gold-bright)" }} />
            <span className="font-extrabold leading-snug" style={{ color: "var(--gold-light)", fontWeight: 700 }}>
              {dua.source ? `${dua.source} • ` : ""}
              {dua.reference}
            </span>
          </div>
        )}
      </div>

      {/* Actions Toolbar */}
      <div
        className="mt-5 pt-4 flex items-center justify-between gap-2"
        style={{ borderTop: "1px solid var(--border-gold)" }}
      >
        {/* Play / Recite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay(dua);
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 ${
            isPlaying ? "gold-pulse btn-gold" : isDownloaded ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md" : "btn-teal"
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">
                {isPlayingAudio
                  ? `Playing Audio ${audioDuration ? `(${formatTime(audioCurrentTime)})` : ""}`
                  : "Reciting..."}
              </span>
              <span className="sm:hidden">
                {isPlayingAudio
                  ? `Playing ${audioDuration ? `(${formatTime(audioCurrentTime)})` : ""}`
                  : "Reciting"}
              </span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">
                {isDownloaded
                  ? "Play Offline Audio 💾"
                  : dua.audioUrl
                  ? "Play Arabic Audio"
                  : "Listen & Recite"}
              </span>
              <span className="sm:hidden">{isDownloaded ? "Play Offline 💾" : dua.audioUrl ? "Play Audio" : "Listen"}</span>
            </>
          )}
        </button>

        {/* Secondary Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Audio Selection button */}
          {onOpenAudioSelection && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenAudioSelection();
              }}
              title="Audio & Translation Selection (Recitation, Voice Translation, Reading Mode)"
              className="p-1.5 sm:p-2 rounded-xl transition"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-gold)",
                color: "var(--text-muted)"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-bright)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Add to Playlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist(dua);
            }}
            title="Add to Playlist"
            className="p-1.5 sm:p-2 rounded-xl transition"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-gold)",
              color: "var(--text-muted)"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-bright)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Copy button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(dua);
            }}
            title="Copy to Clipboard"
            className="p-1.5 sm:p-2 rounded-xl transition"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-gold)",
              color: "var(--text-muted)"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-bright)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = copiedId === dua._id ? "var(--teal-bright)" : "var(--text-muted)")
            }
          >
            {copiedId === dua._id ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "var(--teal-bright)" }} />
            ) : (
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>

          {/* Share button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(dua);
            }}
            title="Share Dua"
            className="p-1.5 sm:p-2 rounded-xl transition"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-gold)",
              color: "var(--text-muted)"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-bright)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* In Playlist: Remove option */}
          {onRemoveFromPlaylist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromPlaylist(dua._id);
              }}
              title="Remove from this playlist"
              className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 text-red-400 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
