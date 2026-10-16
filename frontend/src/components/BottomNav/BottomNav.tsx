import React from "react";
import { Home as HomeIcon, BookOpen, Bookmark, ListMusic, Download } from "lucide-react";

export type NavTab = "home" | "explore" | "downloads" | "recitation" | "bookmarks" | "playlists";

export interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  bookmarksCount: number;
  downloadsCount?: number;
  fontSizeLarge: boolean;
  onToggleFontSize: () => void;
  hidden?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  bookmarksCount,
  downloadsCount = 0,
  fontSizeLarge,
  onToggleFontSize,
  hidden = false
}) => {
  if (hidden) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel px-2 py-1.5 shadow-2xl backdrop-blur-xl pb-safe"
      style={{ borderTop: "1px solid var(--border-gold-md)" }}
    >
      <div className="flex items-center justify-between gap-0.5 max-w-lg mx-auto">
        {/* Events / Home */}
        <button
          onClick={() => onTabChange("home")}
          className={`flex-1 min-w-0 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-95 ${
            activeTab === "home" ? "font-bold" : "hover:opacity-100"
          }`}
          style={{ color: activeTab === "home" ? "var(--gold-bright)" : "var(--text-muted)" }}
        >
          <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9.5px] sm:text-[10px] mt-0.5 truncate max-w-full tracking-tight">Home</span>
        </button>

        {/* Online Duas */}
        <button
          onClick={() => onTabChange("explore")}
          className={`flex-1 min-w-0 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-95 ${
            activeTab === "explore" ? "font-bold" : "hover:opacity-100"
          }`}
          style={{ color: activeTab === "explore" ? "var(--teal-bright)" : "var(--text-muted)" }}
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9.5px] sm:text-[10px] mt-0.5 truncate max-w-full tracking-tight">Duas</span>
        </button>

        {/* Offline Downloads */}
        <button
          onClick={() => onTabChange("downloads")}
          className={`flex-1 min-w-0 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-95 relative ${
            activeTab === "downloads" ? "font-bold" : "hover:opacity-100"
          }`}
          style={{ color: activeTab === "downloads" ? "#10b981" : "var(--text-muted)" }}
        >
          <div className="relative">
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            {downloadsCount > 0 && (
              <span
                className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full text-slate-950 text-[8px] font-bold flex items-center justify-center bg-[#10b981]"
              >
                {downloadsCount}
              </span>
            )}
          </div>
          <span className="text-[9.5px] sm:text-[10px] mt-0.5 truncate max-w-full tracking-tight">Offline</span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => onTabChange("bookmarks")}
          className={`flex-1 min-w-0 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-95 relative ${
            activeTab === "bookmarks" ? "font-bold" : "hover:opacity-100"
          }`}
          style={{ color: activeTab === "bookmarks" ? "var(--gold-bright)" : "var(--text-muted)" }}
        >
          <div className="relative">
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
            {bookmarksCount > 0 && (
              <span
                className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full text-slate-900 text-[8px] font-bold flex items-center justify-center"
                style={{ background: "var(--gold-bright)" }}
              >
                {bookmarksCount}
              </span>
            )}
          </div>
          <span className="text-[9.5px] sm:text-[10px] mt-0.5 truncate max-w-full tracking-tight">Saved</span>
        </button>

        {/* Playlists */}
        <button
          onClick={() => onTabChange("playlists")}
          className={`flex-1 min-w-0 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-95 ${
            activeTab === "playlists" ? "font-bold" : "hover:opacity-100"
          }`}
          style={{ color: activeTab === "playlists" ? "var(--teal-bright)" : "var(--text-muted)" }}
        >
          <ListMusic className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9.5px] sm:text-[10px] mt-0.5 truncate max-w-full tracking-tight">Lists</span>
        </button>

        {/* Arabic Font Size Toggle */}
        <button
          onClick={onToggleFontSize}
          className="flex-1 min-w-0 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-95"
          style={{ color: "var(--text-muted)" }}
          title="Toggle Arabic Font Size"
        >
          <span className="text-sm font-bold font-arabic leading-none h-4 sm:h-5 flex items-center">ع</span>
          <span className="text-[9.5px] sm:text-[10px] mt-0.5 font-mono">{fontSizeLarge ? "32px" : "26px"}</span>
        </button>
      </div>
    </nav>
  );
};
