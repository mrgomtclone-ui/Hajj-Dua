import React from "react";
import { ArrowLeft, Volume2, Play, SlidersHorizontal } from "lucide-react";
import type { DuaItem, TranslationLang } from "../../types";
import { DuaCard } from "../../components/DuaCard";

export interface RecitationPageProps {
  audioDuas: DuaItem[];
  selectedLang: TranslationLang;
  fontSizeLarge: boolean;
  bookmarks: Set<string>;
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
  onBackToHome: () => void;
  onOpenAudioSelection?: () => void;
}

export const RecitationPage: React.FC<RecitationPageProps> = ({
  audioDuas,
  selectedLang,
  fontSizeLarge,
  bookmarks,
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
  onBackToHome,
  onOpenAudioSelection
}) => {
  return (
    <div className="animate-fade-in">
      {/* Top Breadcrumb & Back to Home */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6">
        <div
          className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl glass-panel border"
          style={{ borderColor: "var(--border-gold-md)" }}
        >
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 shadow-sm"
            style={{
              background: "var(--event-card-bg)",
              border: "1px solid var(--event-border)",
              color: "var(--gold-bright)"
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-extrabold" style={{ color: "var(--text-heading)", fontWeight: 800 }}>
              Arabic Audio Recitation
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ background: "var(--event-circle-bg)", color: "var(--gold-bright)" }}
            >
              {audioDuas.length} Available
            </span>
          </div>
        </div>
      </div>

      {/* Recitation Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-4 sm:mt-6">
        <div
          className="p-5 sm:p-6 rounded-2xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4 border"
          style={{ borderColor: "var(--border-gold-md)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(20,196,187,0.15)",
                  border: "1px solid rgba(20,196,187,0.3)",
                  color: "var(--teal-bright)"
                }}
              >
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold" style={{ color: "var(--text-heading)", fontWeight: 800 }}>
                Arabic Audio Recitation
              </h2>
            </div>
            <p dir="rtl" className="font-urdu text-lg sm:text-xl mt-1 leading-relaxed font-bold" style={{ color: "var(--gold-light)", fontWeight: 700 }}>
              (عربی آڈیو میں مسنون دعائیں (Online / Offline
            </p>
            <p className="text-xs sm:text-sm mt-1 max-w-xl font-bold" style={{ color: "var(--text-muted)", fontWeight: 700 }}>
              Vocal recitations cached in your browser storage for full offline playback in Mecca & Medina.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onOpenAudioSelection && (
              <button
                onClick={onOpenAudioSelection}
                className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition active:scale-95 shadow-sm"
                style={{
                  background: "var(--bg-input)",
                  borderColor: "var(--border-gold)",
                  color: "var(--gold-bright)"
                }}
                title="Configure Audio Selection (Arabic Recitation, Voice Translation, Reading Mode)"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Audio Selection</span>
              </button>
            )}

            {audioDuas.length > 0 && (
              <button
                onClick={() => onPlayDua(audioDuas[0])}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Recitation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-4 sm:mt-6">
        {audioDuas.length === 0 ? (
          <div className="text-center py-20 rounded-3xl glass-panel border border-[rgba(212,175,55,0.15)]">
            <Volume2 className="w-12 h-12 text-[rgba(212,175,55,0.40)] mx-auto mb-3" />
            <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              No Audio Duas Available
            </h3>
            <p className="text-sm mt-1 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
              Audio tracks are automatically synced when you are connected to the network.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {audioDuas.map((dua) => {
              const isPlaying = playingAudioId === dua._id || speakingDuaId === dua._id;
              const isPlayingAudio = playingAudioId === dua._id;
              const isBookmarked = bookmarks.has(dua._id);

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
                  onPlay={onPlayDua}
                  onToggleBookmark={onToggleBookmark}
                  onCopy={onCopyDua}
                  onShare={onShareDua}
                  onAddToPlaylist={onAddToPlaylist}
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
