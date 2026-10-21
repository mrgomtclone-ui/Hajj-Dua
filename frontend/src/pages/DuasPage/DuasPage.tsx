import React from "react";
import { ArrowLeft, BookOpen, Bookmark, ListMusic } from "lucide-react";
import type { DuaItem, TranslationLang, Playlist } from "../../types";
import { DuaCard } from "../../components/DuaCard";

export interface DuasPageProps {
  filteredDuas: DuaItem[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedLang: TranslationLang;
  fontSizeLarge: boolean;
  bookmarks: Set<string>;
  playlists: Playlist[];
  downloadedIds?: Set<string>;
  downloadingIds?: Set<string>;
  downloadProgress?: Record<string, number>;
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
  onToggleDownload?: (dua: DuaItem) => void;
  onBackToHome: () => void;
  onNavigateToFavorites: () => void;
  onNavigateToPlaylists: () => void;
  onOpenAudioSelection?: () => void;
}

export const DuasPage: React.FC<DuasPageProps> = ({
  filteredDuas,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedLang,
  fontSizeLarge,
  bookmarks,
  playlists,
  downloadedIds = new Set(),
  downloadingIds = new Set(),
  downloadProgress = {},
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
  onBackToHome,
  onNavigateToFavorites,
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
              {selectedCategory !== "All" ? `${selectedCategory} Duas` : "All Sacred Duas"}
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0"
              style={{ background: "var(--event-circle-bg)", color: "var(--gold-bright)" }}
            >
              {filteredDuas.length}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Explore / Bookmarks / Playlists) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-3 sm:mt-6">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border-gold)] pb-2 sm:pb-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap py-0.5">
            <button
              className="tab-active-gold flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap shadow-md transition flex-shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>All Duas</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {filteredDuas.length}
              </span>
            </button>

            <button
              onClick={onNavigateToFavorites}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Favorites</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {bookmarks.size}
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

        {/* Categories Bar */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`cat-chip ${isSelected ? "active" : ""} px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-4 sm:mt-6">
        {filteredDuas.length === 0 ? (
          <div className="text-center py-20 rounded-3xl glass-panel border border-[rgba(212,175,55,0.15)]">
            <BookOpen className="w-12 h-12 text-[rgba(212,175,55,0.40)] mx-auto mb-3" />
            <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              No Duas Found
            </h3>
            <p className="text-sm mt-1 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
              Try adjusting your search terms or selecting another category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredDuas.map((dua) => {
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
                  onToggleDownload={onToggleDownload}
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
