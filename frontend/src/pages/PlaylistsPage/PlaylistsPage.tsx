import React from "react";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  ListMusic,
  FolderPlus,
  Play,
  Trash2,
  ChevronRight
} from "lucide-react";
import type { DuaItem, TranslationLang, Playlist } from "../../types";
import { DuaCard } from "../../components/DuaCard";

export interface PlaylistsPageProps {
  playlists: Playlist[];
  activePlaylist: Playlist | null;
  playlistDuas: DuaItem[];
  allDuasCount: number;
  bookmarksCount: number;
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
  onRemoveFromPlaylist: (playlistId: string, duaId: string) => void;
  onSelectPlaylist: (playlist: Playlist | null) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onOpenNewPlaylistModal: () => void;
  onBackToHome: () => void;
  onNavigateToDuas: () => void;
  onNavigateToFavorites: () => void;
  onOpenAudioSelection?: () => void;
}

export const PlaylistsPage: React.FC<PlaylistsPageProps> = ({
  playlists,
  activePlaylist,
  playlistDuas,
  allDuasCount,
  bookmarksCount,
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
  onRemoveFromPlaylist,
  onSelectPlaylist,
  onDeletePlaylist,
  onOpenNewPlaylistModal,
  onBackToHome,
  onNavigateToDuas,
  onNavigateToFavorites,
  onOpenAudioSelection
}) => {
  return (
    <div className="animate-fade-in">
      {/* Top Breadcrumb & Back to Home */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6">
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
            <span className="text-xs sm:text-sm font-bold truncate" style={{ color: "var(--text-heading)" }}>
              {activePlaylist ? activePlaylist.title : "My Playlists"}
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0"
              style={{ background: "var(--event-circle-bg)", color: "var(--teal-bright)" }}
            >
              {activePlaylist ? `${playlistDuas.length} Duas` : `${playlists.length} Lists`}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Explore / Bookmarks / Playlists) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-3 sm:mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(212,175,55,0.15)] pb-2 sm:pb-3 overflow-x-auto scrollbar-none">
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
              onClick={onNavigateToFavorites}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Favorites</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {bookmarksCount}
              </span>
            </button>

            <button
              onClick={() => onSelectPlaylist(null)}
              className="tab-active-teal flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shadow-md transition flex-shrink-0"
            >
              <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Playlists</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {playlists.length}
              </span>
            </button>
          </div>

          {!activePlaylist && (
            <button
              onClick={onOpenNewPlaylistModal}
              className="btn-teal flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Playlist</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-4 sm:mt-6">
        {/* View 1: Single Playlist Detail View */}
        {activePlaylist ? (
          <div>
            <div
              className="mb-6 p-5 rounded-2xl glass-panel flex items-center justify-between border"
              style={{ borderColor: "var(--border-gold-md)" }}
            >
              <div>
                <button
                  onClick={() => onSelectPlaylist(null)}
                  className="text-xs hover:underline flex items-center gap-1 transition"
                  style={{ color: "var(--gold-bright)" }}
                >
                  ← Back to All Playlists
                </button>
                <h2 className="text-xl font-bold mt-1" style={{ color: "var(--text-primary)" }}>
                  {activePlaylist.title}
                </h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {playlistDuas.length} duas in this collection
                </p>
              </div>

              {playlistDuas.length > 0 && (
                <button
                  onClick={() => onPlayDua(playlistDuas[0])}
                  className="btn-teal px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play All</span>
                </button>
              )}
            </div>

            {playlistDuas.length === 0 ? (
              <div className="text-center py-16 rounded-3xl glass-panel border border-[rgba(212,175,55,0.15)]">
                <ListMusic className="w-12 h-12 text-[rgba(212,175,55,0.40)] mx-auto mb-3" />
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  No Duas in This Playlist
                </h3>
                <p className="text-sm mt-1 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                  Browse All Duas and tap the "+" icon to add supplications to this collection.
                </p>
                <button
                  onClick={onNavigateToDuas}
                  className="btn-teal mt-4 px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  Browse Duas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {playlistDuas.map((dua) => {
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
                      onRemoveFromPlaylist={(duaId) => onRemoveFromPlaylist(activePlaylist.id, duaId)}
                      onOpenAudioSelection={onOpenAudioSelection}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* View 2: Playlists Collection Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.length === 0 ? (
              <div className="col-span-full py-16 text-center rounded-3xl glass-panel border border-[rgba(212,175,55,0.15)]">
                <ListMusic className="w-12 h-12 text-[rgba(212,175,55,0.40)] mx-auto mb-3" />
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  No Playlists Yet
                </h3>
                <p className="text-sm mt-1 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                  Create custom playlists for your Hajj pilgrimage, morning routine, or personal memorization.
                </p>
                <button
                  onClick={onOpenNewPlaylistModal}
                  className="btn-teal mt-4 px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  + Create Your First Playlist
                </button>
              </div>
            ) : (
              playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="glass-card rounded-2xl p-5 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            background: "rgba(212,175,55,0.14)",
                            border: "1px solid var(--border-gold)",
                            color: "var(--gold-bright)"
                          }}
                        >
                          <ListMusic className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-base truncate max-w-[180px]" style={{ color: "var(--text-primary)" }}>
                          {pl.title}
                        </h3>
                      </div>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(212,175,55,0.10)",
                          color: "var(--gold-bright)",
                          border: "1px solid var(--border-gold)"
                        }}
                      >
                        {pl.duaIds.length} Duas
                      </span>
                    </div>
                    <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
                      Sync: <span className="capitalize" style={{ color: "var(--teal-bright)" }}>{pl.syncStatus}</span> • Created {new Date(pl.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-[rgba(212,175,55,0.10)]">
                    <button
                      onClick={() => onSelectPlaylist(pl)}
                      className="text-xs font-bold flex items-center gap-1 transition"
                      style={{ color: "var(--gold-bright)" }}
                    >
                      <span>View Duas</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeletePlaylist(pl.id)}
                      className="text-xs text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-950/40 transition"
                      title="Delete Playlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};
