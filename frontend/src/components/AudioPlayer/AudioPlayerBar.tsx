import React from "react";
import {
  Volume2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Download,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal
} from "lucide-react";
import type { DuaItem, TranslationLang } from "../../types";

export interface AudioPlayerBarProps {
  currentDua: DuaItem | null;
  selectedLang: TranslationLang;
  isPlaying: boolean;
  audioDuration: number;
  audioCurrentTime: number;
  audioProgress: number;
  audioPhase?: "idle" | "arabic" | "meaning";
  isDownloaded?: boolean;
  isDownloading?: boolean;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkip: (seconds: number) => void;
  onTogglePlay: (dua: DuaItem) => void;
  onToggleDownload?: (dua: DuaItem) => void;
  onOpenAudioSelection?: () => void;
  onDismiss: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentDua,
  selectedLang,
  isPlaying,
  audioDuration,
  audioCurrentTime,
  audioProgress,
  audioPhase = "idle",
  isDownloaded = false,
  isDownloading = false,
  onSeek,
  onSkip,
  onTogglePlay,
  onToggleDownload,
  onOpenAudioSelection,
  onDismiss
}) => {
  if (!currentDua) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 glass-panel px-3 sm:px-4 py-2.5 sm:py-3 shadow-2xl backdrop-blur-xl pb-safe"
      style={{ borderTop: "1px solid var(--border-gold-md)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 md:gap-6">
        {/* Top row / Left metadata */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(212,175,55,0.14)",
                border: "1px solid var(--border-gold)",
                color: "var(--gold-bright)"
              }}
            >
              <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isPlaying ? "animate-pulse text-[#fde68a]" : ""}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-bold truncate max-w-[190px] sm:max-w-none" style={{ color: "var(--text-primary)" }}>
                  {currentDua.titles?.[selectedLang] || currentDua.title}
                </span>

                {/* Audio Phase Indicator Badge (Arabic Recitation -> Meaning) */}
                {audioPhase === "arabic" ? (
                  <span
                    className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 flex-shrink-0 animate-pulse"
                    style={{ background: "rgba(16,185,129,0.22)", color: "#34d399", border: "1px solid rgba(16,185,129,0.4)" }}
                  >
                    <span>🕌 Arabic Recitation</span>
                  </span>
                ) : audioPhase === "meaning" ? (
                  <span
                    className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 flex-shrink-0 animate-pulse"
                    style={{ background: "rgba(245,158,11,0.22)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.4)" }}
                  >
                    <span>🎙️ {selectedLang === "ta" ? "தமிழ் விளக்கம்" : selectedLang === "ur" ? "اردو ترجمہ" : "English Meaning"}</span>
                  </span>
                ) : isDownloaded ? (
                  <span
                    className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-bold flex items-center gap-1 flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.2)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>OFFLINE 💾</span>
                  </span>
                ) : (
                  <span
                    className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-semibold flex items-center gap-1 flex-shrink-0"
                    style={{ background: "rgba(212,175,55,0.14)", color: "var(--gold-light)" }}
                  >
                    {currentDua.audioUrl ? "Audio Ready" : "Voice"}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs truncate font-arabic font-medium" style={{ color: "var(--text-muted)" }}>
                {currentDua.arabicText}
              </p>
            </div>
          </div>

          {/* Close Button on Mobile (visible top-right of player) */}
          <button
            onClick={onDismiss}
            className="md:hidden p-1.5 rounded-lg transition"
            style={{ color: "var(--text-muted)" }}
            title="Dismiss Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrubber Progress Bar for Real Audio */}
        {currentDua.audioUrl && (
          <div className="w-full md:flex-1 md:max-w-md flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-[11px] font-mono w-8 sm:w-10 text-right" style={{ color: "var(--text-muted)" }}>
              {formatTime(audioCurrentTime)}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={audioProgress}
              onChange={onSeek}
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-gold)" }}
            />
            <span className="text-[10px] sm:text-[11px] font-mono w-8 sm:w-10" style={{ color: "var(--text-muted)" }}>
              {formatTime(audioDuration)}
            </span>
          </div>
        )}

        {/* Playback Controls & Spotify-style Download */}
        <div className="flex items-center justify-center md:justify-end gap-2.5 sm:gap-3">
          {/* Download Button in Audio Bar */}
          {currentDua.audioUrl && onToggleDownload && (
            <button
              onClick={() => onToggleDownload(currentDua)}
              className={`p-2 rounded-xl transition active:scale-95 border ${
                isDownloaded
                  ? "bg-[#10b981]/20 border-[#10b981] text-[#10b981]"
                  : isDownloading
                  ? "border-amber-400 text-amber-400"
                  : "border-[var(--border-gold)] text-[var(--text-muted)] hover:text-[#10b981] hover:border-[#10b981]"
              }`}
              style={!isDownloaded && !isDownloading ? { background: "var(--bg-input)" } : undefined}
              title={
                isDownloaded
                  ? "Downloaded for offline listening • Click to remove"
                  : isDownloading
                  ? "Downloading audio..."
                  : "Download for offline listening"
              }
            >
              {isDownloaded ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : isDownloading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          )}

          {currentDua.audioUrl && (
            <button
              onClick={() => onSkip(-5)}
              className="p-2 rounded-xl transition active:scale-95"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-gold)", color: "var(--text-muted)" }}
              title="Rewind 5s"
            >
              <SkipBack className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onTogglePlay(currentDua)}
            className="w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition active:scale-95 gold-pulse text-slate-900 font-bold"
            style={{ background: "linear-gradient(135deg, #b8860b, #d4af37)" }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {currentDua.audioUrl && (
            <button
              onClick={() => onSkip(5)}
              className="p-2 rounded-xl transition active:scale-95"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-gold)", color: "var(--text-muted)" }}
              title="Forward 5s"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}

          {/* Audio Selection Settings Trigger */}
          {onOpenAudioSelection && (
            <button
              onClick={onOpenAudioSelection}
              className="p-2 rounded-xl transition active:scale-95"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-gold)",
                color: "var(--gold-bright)"
              }}
              title="Audio Selection Preferences"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onDismiss}
            className="hidden md:flex p-2 rounded-xl transition"
            style={{ color: "var(--text-muted)" }}
            title="Dismiss Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
