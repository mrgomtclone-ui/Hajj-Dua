import React from "react";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  Trash2,
  RefreshCw
} from "lucide-react";
import type { DuaItem, TranslationLang } from "../../types";
import { DuaCard } from "../../components/DuaCard";

export interface DownloadsPageProps {
  allDuas: DuaItem[];
  selectedLang: TranslationLang;
  fontSizeLarge: boolean;
  bookmarks: Set<string>;
  downloadedIds: Set<string>;
  downloadingIds: Set<string>;
  downloadProgress: Record<string, number>;
  playingAudioId: string | null;
  speakingDuaId: string | null;
  audioDuration: number;
  audioCurrentTime: number;
  copiedId: string | null;
  onPlayDua: (dua: DuaItem) => void;
  onToggleBookmark: (id: string) => void;
  onCopyDua: (dua: DuaItem) => void;
  onShareDua: (dua: DuaItem) => void;
  onAddToPlaylist: (dua: DuaItem) => void;
  onToggleDownload: (dua: DuaItem) => void;
  onDownloadAll: () => void;
  onRemoveAllDownloads: () => void;
  onBackToHome: () => void;
  onOpenAudioSelection?: () => void;
}

export const DownloadsPage: React.FC<DownloadsPageProps> = ({
  allDuas,
  selectedLang,
  fontSizeLarge,
  bookmarks,
  downloadedIds,
  downloadingIds,
  downloadProgress,
  playingAudioId,
  speakingDuaId,
  audioDuration,
  audioCurrentTime,
  copiedId,
  onPlayDua,
  onToggleBookmark,
  onCopyDua,
  onShareDua,
  onAddToPlaylist,
  onToggleDownload,
  onDownloadAll,
  onRemoveAllDownloads,
  onBackToHome,
  onOpenAudioSelection
}) => {
  const audioDuas = allDuas.filter((d) => Boolean(d.audioUrl || d.audioEnglishUrl || d.audioTamilUrl || d.audioUrduUrl));
  const downloadedDuas = audioDuas.filter((d) => downloadedIds.has(d._id));
  const displayedDuas = downloadedDuas;

  return (
    <div className="animate-fade-in">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6">
        <div
          className="flex items-center justify-between gap-2 p-2.5 sm:p-4 rounded-2xl shadow-sm border"
          style={{
            background: "var(--event-card-bg)",
            borderColor: "var(--event-border)"
          }}
        >
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 shadow-sm flex-shrink-0"
            style={{
              background: "var(--event-circle-bg)",
              border: "1px solid var(--event-border)",
              color: "var(--event-text)"
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <span
              className="text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm flex-shrink-0"
              style={{
                background: "var(--event-circle-bg)",
                border: "1px solid var(--event-border)",
                color: "var(--event-text)"
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">
                {selectedLang === "ur"
                  ? `${downloadedDuas.length} آف لائن دعائیں`
                  : selectedLang === "ta"
                  ? `${downloadedDuas.length} ஆஃப்லைன் துஆக்கள்`
                  : `${downloadedDuas.length} Offline Duas`}
              </span>
              <span className="sm:hidden">{downloadedDuas.length} Saved</span>
            </span>

            {downloadedDuas.length < audioDuas.length && (
              <button
                onClick={onDownloadAll}
                disabled={downloadingIds.size > 0}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold shadow-md transition active:scale-95 disabled:opacity-50 flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #b8860b, #d4af37)",
                  color: "#1f1500",
                  border: "1px solid var(--border-gold-hi)"
                }}
                title="Download all available duas for offline listening"
              >
                {downloadingIds.size > 0 ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span className="hidden sm:inline">Downloading...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download All</span>
                    <span className="sm:hidden">All</span>
                  </>
                )}
              </button>
            )}

            {downloadedDuas.length > 0 && (
              <button
                onClick={onRemoveAllDownloads}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 shadow-sm"
                style={{
                  background: "var(--event-circle-bg)",
                  border: "1px solid var(--event-border)",
                  color: "var(--event-text-sub)"
                }}
                title="Remove all downloaded audios to free storage"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500/80" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Body: Offline Duas Only */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-5">
        {displayedDuas.length === 0 ? (
          <div
            className="text-center py-16 px-4 rounded-2xl border shadow-sm"
            style={{
              background: "var(--event-card-bg)",
              borderColor: "var(--event-border)"
            }}
          >
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center shadow-sm"
              style={{
                background: "var(--event-circle-bg)",
                border: "1px solid var(--event-border)",
                color: "var(--gold-bright)"
              }}
            >
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: "var(--event-text)" }}>
              No Offline Downloads Yet
            </h3>
            <p className="text-xs sm:text-sm mt-1 max-w-sm mx-auto" style={{ color: "var(--event-text-sub)" }}>
              Tap "Download All" to save duas to your device for offline listening with zero internet.
            </p>
            <button
              onClick={onDownloadAll}
              className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md active:scale-95"
              style={{
                background: "linear-gradient(135deg, #b8860b, #d4af37)",
                color: "#1f1500",
                border: "1px solid var(--border-gold-hi)"
              }}
            >
              Download All for Offline
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {displayedDuas.map((dua) => {
              const isPlaying = playingAudioId === dua._id || speakingDuaId === dua._id;
              const isPlayingAudio = playingAudioId === dua._id;
              const isBookmarked = bookmarks.has(dua._id);
              const isDownloaded = downloadedIds.has(dua._id);
              const isDownloading = downloadingIds.has(dua._id);
              const progress = downloadProgress[dua._id] || 0;

              return (
                <DuaCard
                  key={dua._id}
                  dua={dua}
                  selectedLang={selectedLang}
                  fontSizeLarge={fontSizeLarge}
                  isBookmarked={isBookmarked}
                  isPlaying={isPlaying}
                  isPlayingAudio={isPlayingAudio}
                  audioDuration={audioDuration}
                  audioCurrentTime={audioCurrentTime}
                  copiedId={copiedId}
                  isDownloaded={isDownloaded}
                  isDownloading={isDownloading}
                  downloadProgress={progress}
                  onPlay={onPlayDua}
                  onToggleBookmark={onToggleBookmark}
                  onCopy={onCopyDua}
                  onShare={onShareDua}
                  onAddToPlaylist={onAddToPlaylist}
                  onToggleDownload={() => onToggleDownload(dua)}
                  onOpenAudioSelection={onOpenAudioSelection}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
