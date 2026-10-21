import React from "react";
import { ArrowLeft, BookOpen, Bookmark, ListMusic, Heart } from "lucide-react";
import type { DuaItem, TranslationLang, Playlist } from "../../types";
import { DuaCard } from "../../components/DuaCard";

export interface FavoritesPageProps {
  favoriteDuas: DuaItem[];
  allDuasCount: number;
  playlists: Playlist[];
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
  onNavigateToDuas: () => void;
  onNavigateToPlaylists: () => void;
  onOpenAudioSelection?: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favoriteDuas,
  allDuasCount,
  playlists,
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
  onNavigateToDuas,
  onNavigateToPlaylists,
  onOpenAudioSelection
}) => {
  return (
    <div className="animate-fade-in">
      {/* Top Breadcrumb & Back to Home */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-3 sm:pt-6">
        <div
          className="flex items-center justify-between gap-2 p-2.5 sm:p-4 rounded-2xl glass-panel border"
          style={{ borderColor: "var(--border-gold-md)" }}
        >
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 shadow-sm flex-shrink-0"
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

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-sm sm:text-base font-extrabold truncate" style={{ color: "var(--text-heading)", fontWeight: 800 }}>
              Favorite Duas
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0"
              style={{ background: "var(--event-circle-bg)", color: "#ef4444" }}
            >
              {favoriteDuas.length} Saved
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Explore / Bookmarks / Playlists) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-3 sm:mt-6">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border-gold)] pb-2 sm:pb-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap py-0.5">
            <button
              onClick={onNavigateToDuas}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>All Duas</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {allDuasCount}
              </span>
            </button>

            <button
              className="tab-active-gold flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shadow-md transition flex-shrink-0"
            >
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Favorites</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {favoriteDuas.length}
              </span>
            </button>

            <button
              onClick={onNavigateToPlaylists}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Playlists</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {playlists.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-4 sm:mt-6">
        {favoriteDuas.length === 0 ? (
          <div className="text-center py-20 rounded-3xl glass-panel border border-[rgba(212,175,55,0.15)]">
            <Heart className="w-12 h-12 text-red-500/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              No Favorites Saved Yet
            </h3>
            <p className="text-sm mt-1 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
              Tap the bookmark icon on any sacred dua to save it here for fast offline reference.
            </p>
            <button
              onClick={onNavigateToDuas}
              className="btn-gold mt-4 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md"
            >
              Browse All Duas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {favoriteDuas.map((dua) => {
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
