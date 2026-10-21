import {
  Sparkles,
  Search,
  X,
  Moon,
  Sun,
  RefreshCw,
  LogOut,
  LogIn,
  DownloadCloud,
  SlidersHorizontal
} from "lucide-react";
import type { TranslationLang, UserProfile } from "../../types";

export interface HeaderProps {
  isOnline: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  selectedLang?: TranslationLang;
  onSelectLang?: (l: TranslationLang) => void;
  fontSizeLarge: boolean;
  onToggleFontSize: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  syncStatus: "idle" | "syncing" | "synced" | "error";
  onSync: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
  onOpenAudioSelection?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isOnline,
  search,
  onSearchChange,
  selectedLang: _selectedLang,
  onSelectLang: _onSelectLang,
  fontSizeLarge,
  onToggleFontSize,
  isDark,
  onToggleTheme,
  syncStatus,
  onSync,
  user,
  onOpenAuth,
  onLogout,
  onNavigateHome,
  canInstall,
  onInstall,
  onOpenAudioSelection
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-[var(--border-gold)] px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Logo & Identity */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0"
          onClick={onNavigateHome}
          title="Return to Home"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shadow-md border border-emerald-400/30 flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-100" />
            <span
              className="sm:hidden absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[var(--bg-base)]"
              style={{ background: isOnline ? "var(--teal-bright)" : "var(--gold-bright)" }}
              title={isOnline ? "Online" : "Offline Ready"}
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span
                className="font-extrabold tracking-wider text-sm sm:text-lg whitespace-nowrap"
                style={{ color: "var(--text-heading)", fontFamily: '"Cinzel", Georgia, serif' }}
              >
                HAJ DUA'S
              </span>
              <span
                className="hidden md:inline-block text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-medium font-arabic flex-shrink-0"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  color: "var(--text-heading)",
                  border: "1px solid var(--border-gold-md)"
                }}
              >
                دعاء الحج
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] leading-none" style={{ color: "var(--text-muted)" }}>
              <span>Offline Ready</span>
              <span>•</span>
              <span className="capitalize" style={{ color: isOnline ? "var(--teal-bright)" : "var(--gold-bright)" }}>
                {isOnline ? "Connected" : "Saved to Device"}
              </span>
            </div>
          </div>
        </div>

        {/* Search Input (Desktop) */}
        <div className="relative flex-1 max-w-md hidden md:block mx-2">
          <Search
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-subtle)" }}
          />
          <input
            type="text"
            placeholder="Search duas, Arabic, or translation..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full islamic-input text-sm pl-10 pr-9 py-2 rounded-xl transition"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controls: Language, Font, Theme, Sync, Auth */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

          {/* Audio & Translation Selection Trigger */}
          {onOpenAudioSelection && (
            <button
              onClick={onOpenAudioSelection}
              title="Audio & Translation Selection (Recitation, Voice Translation, Reading Mode)"
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold transition active:scale-95 shadow-sm flex items-center justify-center gap-1.5 flex-shrink-0"
              style={{
                background: "var(--bg-input)",
                borderColor: "var(--border-gold)",
                color: "var(--gold-bright)"
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="font-semibold text-xs sm:text-sm">Audio</span>
            </button>
          )}

          {/* Arabic Font Size Toggle (Desktop only) */}
          <button
            onClick={onToggleFontSize}
            title={fontSizeLarge ? "Decrease font size (32px -> 26px)" : "Increase font size (26px -> 32px)"}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 flex-shrink-0"
            style={{ background: "var(--bg-input)", borderColor: "var(--border-gold)", color: "var(--text-heading)" }}
          >
            <span className="font-arabic text-sm leading-none">ع</span>
            <span className="text-[11px] font-mono">{fontSizeLarge ? "32px" : "26px"}</span>
          </button>

          {/* Install PWA Button (Hidden on small mobile to prevent header overflow) */}
          {canInstall && (
            <button
              onClick={onInstall}
              title="Install Haj Duas App (Offline Mode)"
              className="hidden sm:flex px-2.5 py-1.5 rounded-xl border items-center justify-center gap-1.5 transition active:scale-95 flex-shrink-0 shadow-sm animate-pulse"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(16,185,129,0.15))",
                borderColor: "rgba(212,175,55,0.45)",
                color: "var(--gold-bright)"
              }}
            >
              <DownloadCloud className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-[11px] font-bold">Install</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={isDark ? "Switch to Sunlight Clear Mode (Outdoor High Contrast)" : "Switch to Night Mode"}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition active:scale-95 flex-shrink-0"
            style={{ background: "var(--bg-input)", borderColor: "var(--border-gold)" }}
            aria-label="Toggle theme"
          >
            {isDark ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-emerald-700" />}
          </button>

          {/* Sync Button (Hidden on small mobile screens to keep header clean) */}
          <button
            onClick={onSync}
            title="Sync Playlists & Bookmarks"
            className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-xl border items-center justify-center transition active:scale-95 flex-shrink-0"
            style={{ background: "var(--bg-input)", borderColor: "var(--border-gold)", color: "var(--gold-bright)" }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
          </button>

          {/* Auth Profile Button */}
          {user ? (
            <button
              onClick={onLogout}
              title="Sign Out"
              className="w-8 h-8 sm:w-auto sm:px-3 sm:py-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-xs text-red-300 transition flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Sign In / Register"
              className="btn-gold w-8 h-8 sm:w-auto sm:px-3 sm:py-2 rounded-xl text-xs transition active:scale-95 flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="mt-2 md:hidden relative">
        <Search
          className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-subtle)" }}
        />
        <input
          type="text"
          placeholder="Search duas, Arabic, or translation..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full islamic-input text-xs sm:text-sm pl-10 pr-9 py-2 rounded-xl transition"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
