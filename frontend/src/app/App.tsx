import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Bookmark,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Volume2,
  Copy,
  Check,
  Plus,
  Trash2,
  FolderPlus,
  Wifi,
  WifiOff,
  RefreshCw,
  User as UserIcon,
  LogIn,
  LogOut,
  X,
  Sparkles,
  ListMusic,
  Share2,
  BookOpen,
  ChevronRight,
  Info,
  Moon,
  Sun
} from "lucide-react";
import { api, SESSION_EXPIRED } from "../services/api/client";
import { repo, sync, player } from "../main";
import { db } from "../db/indexedDb";
import type { Lang, PlayerState, Playlist } from "../types";

export type TranslationLang = "en" | "ta" | "ur";

export interface DuaItem {
  _id: string;
  slug: string;
  title: string;
  titles?: Partial<Record<TranslationLang, string>>;
  category: string;
  kind: "quran" | "hadith" | "general" | "demo";
  arabicText: string;
  transliteration?: string;
  translations: Partial<Record<TranslationLang, string>>;
  source?: string;
  reference?: string;
  audioUrl?: string;
  verified?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
}

export default function App() {
  const [duas, setDuas] = useState<DuaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"explore" | "bookmarks" | "playlists">("explore");
  const [selectedLang, setSelectedLang] = useState<TranslationLang>("en");

  // Theme toggle — dark (Islamic midnight) / light (Islamic parchment)
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try { return (localStorage.getItem("hajj-theme") as "dark" | "light") || "dark"; }
    catch { return "dark"; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("hajj-theme", theme); } catch {}
  }, [theme]);

  function toggleTheme() {
    setTheme(t => t === "dark" ? "light" : "dark");
  }

  const isDark = theme === "dark";
  
  // Bookmarks & Playlists state
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [duaToAddToPlaylist, setDuaToAddToPlaylist] = useState<DuaItem | null>(null);

  // Auth state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Offline & Sync state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<string>("idle");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio Player state
  const [playerState, setPlayerState] = useState<PlayerState>(player.state);
  const [currentDua, setCurrentDua] = useState<DuaItem | null>(null);
  const [speakingDuaId, setSpeakingDuaId] = useState<string | null>(null);
  const [fontSizeLarge, setFontSizeLarge] = useState(false);

  // Real Audio Playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [cachedAudioIds, setCachedAudioIds] = useState<Set<string>>(new Set());
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const activeBlobUrlRef = React.useRef<string | null>(null);

  // Time format helper
  function formatTime(sec: number) {
    if (!isFinite(sec) || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (val / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setAudioCurrentTime(newTime);
      setAudioProgress(val);
    }
  }

  function skipAudio(seconds: number) {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds));
    }
  }

  // Pre-cache all audio files into IndexedDB as Blobs for 100% offline playback
  async function precacheAllOfflineAudios(items: DuaItem[]) {
    const cachedSet = new Set<string>();
    try {
      const existingRecords = await db.audio.toArray();
      existingRecords.forEach(r => cachedSet.add(r.duaId || r.id));
      if (cachedSet.size > 0) setCachedAudioIds(new Set(cachedSet));
    } catch (e) {
      console.warn("Error reading initial db.audio:", e);
    }

    for (const item of items) {
      if (!item.audioUrl) continue;
      try {
        const existing = await db.audio.get(item._id);
        if (existing?.audioBlob) {
          cachedSet.add(item._id);
        } else {
          // Fetch audio file and store as Blob in IndexedDB
          const targetUrl = encodeURI(item.audioUrl);
          const res = await fetch(targetUrl);
          if (res.ok) {
            const blob = await res.blob();
            await db.audio.put({
              id: item._id,
              duaId: item._id,
              language: "ar" as Lang,
              title: item.title,
              duration: 0,
              audioBlob: blob,
              downloadedAt: Date.now(),
              sizeBytes: blob.size,
            });
            cachedSet.add(item._id);
          }
        }
      } catch (err) {
        console.warn(`Could not cache offline audio for ${item.title}:`, err);
      }
    }
    setCachedAudioIds(new Set(cachedSet));
  }

  // Load Initial Data & Audio Event Listeners
  useEffect(() => {
    loadDuas();
    loadBookmarks();
    loadPlaylists();
    checkAuth();

    // Create and attach listeners to HTML Audio
    const audio = new Audio();
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.ondurationchange = () => {
      if (isFinite(audio.duration)) {
        setAudioDuration(audio.duration);
      }
    };
    audio.onended = () => {
      setPlayingAudioId(null);
      setAudioProgress(0);
      setAudioCurrentTime(0);
    };
    audio.onerror = () => {
      setPlayingAudioId(null);
    };

    // Listeners
    const unsubscribePlayer = player.subscribe(setPlayerState);
    const unsubscribeSync = sync.onStatus(s => setSyncStatus(s));

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const handleSessionExpired = () => {
      setUser(null);
    };
    window.addEventListener(SESSION_EXPIRED, handleSessionExpired);

    return () => {
      audio.pause();
      audio.src = "";
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }
      unsubscribePlayer();
      unsubscribeSync();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(SESSION_EXPIRED, handleSessionExpired);
    };
  }, []);

  // Fetch Duas (Online + Offline Cache)
  async function loadDuas() {
    setLoading(true);
    try {
      const res = await api<DuaItem[]>("/duas?limit=50");
      if (res && res.length > 0) {
        setDuas(res);
        // Pre-cache all audio blobs locally into IndexedDB in the background
        precacheAllOfflineAudios(res);
        // Persist to local IndexedDB for full offline use
        try {
          await db.duas.clear();
          await db.duas.bulkPut(
            res.map((d) => ({
              id: d._id,
              title: d.title,
              category: d.category,
              arabicText: d.arabicText,
              transliteration: d.transliteration,
              translations: d.translations,
              reference: d.reference,
              kind: d.kind,
              verified: !!d.verified,
              audioUrl: d.audioUrl,
              savedAt: Date.now(),
              searchText: [
                d.title,
                d.arabicText,
                d.translations?.en,
                d.translations?.ur,
                d.translations?.ta,
                d.reference,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase(),
            }))
          );
        } catch (dbErr) {
          console.warn("Could not save to IndexedDB:", dbErr);
        }
      }
    } catch (e) {
      console.warn("Network unavailable, loading offline from IndexedDB:", e);
      try {
        const cached = await db.duas.toArray();
        if (cached && cached.length > 0) {
          setDuas(
            cached.map((c) => ({
              _id: c.id,
              slug: c.id,
              title: c.title,
              category: c.category,
              kind: c.kind as any,
              arabicText: c.arabicText,
              transliteration: c.transliteration,
              translations: c.translations,
              reference: c.reference,
              audioUrl: c.audioUrl,
              verified: c.verified,
            }))
          );
          // Check cached audios in IndexedDB
          const audioRecords = await db.audio.toArray();
          setCachedAudioIds(new Set(audioRecords.map((a) => a.duaId)));
        }
      } catch (cacheErr) {
        console.error("Failed to read cached duas:", cacheErr);
      }
    } finally {
      setLoading(false);
    }
  }

  // Fetch Bookmarks
  async function loadBookmarks() {
    try {
      const res = await api<string[]>("/bookmarks");
      if (Array.isArray(res)) setBookmarks(new Set(res));
    } catch (e) {
      console.warn("Failed to load bookmarks:", e);
    }
  }

  // Load Playlists
  function loadPlaylists() {
    setPlaylists(repo.list());
  }

  // Check Current User Auth
  async function checkAuth() {
    try {
      const res = await api<UserProfile>("/auth/me");
      if (res?.email) setUser(res);
    } catch {
      setUser(null);
    }
  }

  // Toggle Bookmark
  async function toggleBookmark(duaId: string) {
    const next = new Set(bookmarks);
    const isBookmarked = next.has(duaId);
    if (isBookmarked) {
      next.delete(duaId);
      setBookmarks(next);
      try {
        await api(`/bookmarks/${duaId}`, { method: "DELETE" });
      } catch (e) {
        console.error(e);
      }
    } else {
      next.add(duaId);
      setBookmarks(next);
      try {
        await api(`/bookmarks/${duaId}`, { method: "PUT" });
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Create Playlist
  function handleCreatePlaylist(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;
    const p = repo.create(newPlaylistTitle.trim());
    setNewPlaylistTitle("");
    loadPlaylists();
    sync.run();
    if (duaToAddToPlaylist) {
      repo.add(p.id, duaToAddToPlaylist._id);
      setDuaToAddToPlaylist(null);
      loadPlaylists();
      sync.run();
    }
  }

  // Add Dua to Playlist
  function handleAddToPlaylist(playlistId: string) {
    if (!duaToAddToPlaylist) return;
    repo.add(playlistId, duaToAddToPlaylist._id);
    loadPlaylists();
    setDuaToAddToPlaylist(null);
    sync.run();
  }

  // Remove Dua from Playlist
  function handleRemoveFromPlaylist(playlistId: string, duaId: string) {
    repo.remove(playlistId, duaId);
    loadPlaylists();
    if (activePlaylist?.id === playlistId) {
      setActivePlaylist(repo.get(playlistId) || null);
    }
    sync.run();
  }

  // Delete Playlist
  function handleDeletePlaylist(id: string) {
    if (!confirm("Are you sure you want to delete this playlist?")) return;
    repo.delete(id);
    loadPlaylists();
    if (activePlaylist?.id === id) setActivePlaylist(null);
    sync.run();
  }

  // Handle Play Dua (Real Recorded Audio + Speech Fallback)
  async function handlePlayDua(dua: DuaItem) {
    setCurrentDua(dua);

    // If real recorded Arabic audio is available:
    if (dua.audioUrl) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setSpeakingDuaId(null);

      const audio = audioRef.current;
      if (!audio) return;

      if (playingAudioId === dua._id) {
        if (!audio.paused) {
          audio.pause();
          setPlayingAudioId(null);
        } else {
          audio.play().then(() => setPlayingAudioId(dua._id)).catch(console.error);
        }
        return;
      }

      // Check IndexedDB local blob first (100% offline without network!)
      try {
        const cached = await db.audio.get(dua._id);
        if (cached?.audioBlob) {
          if (activeBlobUrlRef.current) {
            URL.revokeObjectURL(activeBlobUrlRef.current);
          }
          const blobUrl = URL.createObjectURL(cached.audioBlob);
          activeBlobUrlRef.current = blobUrl;
          audio.src = blobUrl;
        } else {
          audio.src = dua.audioUrl;
        }
      } catch {
        audio.src = dua.audioUrl;
      }

      audio.currentTime = 0;
      audio.play().then(() => {
        setPlayingAudioId(dua._id);
      }).catch((err) => {
        console.error("Audio playback error:", err);
      });
      return;
    }

    // Fallback for duas without audio file:
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingAudioId(null);
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (speakingDuaId === dua._id) {
        setSpeakingDuaId(null);
        return;
      }
      setSpeakingDuaId(dua._id);
      const utter = new SpeechSynthesisUtterance(dua.arabicText);
      utter.lang = "ar-SA";
      utter.rate = 0.85;
      utter.onend = () => {
        setSpeakingDuaId(null);
        const transText = dua.translations?.[selectedLang] || dua.translations?.en;
        if (transText) {
          const transUtter = new SpeechSynthesisUtterance(transText);
          transUtter.lang = selectedLang === "ur" ? "ur-PK" : selectedLang === "ta" ? "ta-IN" : "en-US";
          transUtter.rate = 0.95;
          window.speechSynthesis.speak(transUtter);
        }
      };
      utter.onerror = () => setSpeakingDuaId(null);
      window.speechSynthesis.speak(utter);
    }
  }

  // Copy Dua to Clipboard
  function copyDua(dua: DuaItem) {
    const displayTitle = dua.titles?.[selectedLang] || dua.title;
    const text = `${displayTitle}\n\n${dua.arabicText}\n\n${dua.transliteration || ""}\n\nTranslation (${selectedLang.toUpperCase()}): ${
      dua.translations?.[selectedLang] || dua.translations?.en || ""
    }\n\nReference: ${dua.reference || dua.source || "Haj Duas"}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua._id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Share Dua
  function shareDua(dua: DuaItem) {
    const displayTitle = dua.titles?.[selectedLang] || dua.title;
    if (navigator.share) {
      navigator.share({
        title: displayTitle,
        text: `${displayTitle}\n\n${dua.arabicText}\n\n${dua.translations?.[selectedLang] || dua.translations?.en || ""}\n— ${dua.reference || "Haj Duas"}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      copyDua(dua);
    }
  }

  // Handle Auth
  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
      const body = authMode === "login"
        ? { email: authEmail, password: authPassword }
        : { email: authEmail, password: authPassword, name: authName };
      const res = await api<UserProfile>(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });
      setUser(res);
      setShowAuthModal(false);
      setAuthPassword("");
      await sync.pull();
      loadPlaylists();
      loadBookmarks();
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await api("/auth/logout", { method: "POST" });
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  }

  // Filter Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    duas.forEach((d) => d.category && set.add(d.category));
    return ["All", ...Array.from(set)];
  }, [duas]);

  // Filter Duas
  const filteredDuas = useMemo(() => {
    return duas.filter((d) => {
      // Tab filter
      if (activeTab === "bookmarks" && !bookmarks.has(d._id)) return false;
      if (activeTab === "playlists" && activePlaylist && !activePlaylist.duaIds.includes(d._id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "All" && d.category !== selectedCategory) return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = d.title.toLowerCase().includes(q);
        const matchTitles = Object.values(d.titles || {}).some((t) => t?.toLowerCase().includes(q));
        const matchArabic = d.arabicText.includes(q);
        const matchTrans = (d.transliteration || "").toLowerCase().includes(q);
        const matchEn = (d.translations?.en || "").toLowerCase().includes(q);
        const matchUr = (d.translations?.ur || "").toLowerCase().includes(q);
        const matchTa = (d.translations?.ta || "").toLowerCase().includes(q);
        const matchRef = (d.reference || "").toLowerCase().includes(q);
        return matchTitle || matchTitles || matchArabic || matchTrans || matchEn || matchUr || matchTa || matchRef;
      }
      return true;
    });
  }, [duas, activeTab, selectedCategory, search, bookmarks, activePlaylist]);

  return (
    <div className={`min-h-screen theme-fade ${currentDua ? "pb-56 sm:pb-36" : "pb-24 sm:pb-20"}`} style={{color:'var(--text-primary)', backgroundColor:'var(--bg-base)'}}>

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 glass-panel border-b border-[rgba(212,175,55,0.22)] px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0" onClick={() => { setActiveTab("explore"); setSelectedCategory("All"); }}>
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#7a5c0a] flex items-center justify-center shadow-md border border-[rgba(212,175,55,0.35)] flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#fde68a]" />
              {/* Subtle mobile connection dot badge */}
              <span
                className="sm:hidden absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[var(--bg-base)]"
                style={{ background: isOnline ? 'var(--teal-bright)' : 'var(--gold-bright)' }}
                title={isOnline ? "Online" : "Offline Ready"}
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-sm sm:text-lg whitespace-nowrap" style={{color:'var(--text-heading)', fontFamily:'"Cinzel", Georgia, serif'}}>
                  HAJ DUA'S
                </span>
                <span className="hidden md:inline-block text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-medium font-arabic flex-shrink-0" style={{background:'rgba(212,175,55,0.12)', color:'var(--text-heading)', border:'1px solid var(--border-gold-md)'}}>
                  دعاء الحج
                </span>
              </div>
              <p className="hidden sm:block text-[10px] sm:text-[11px] font-medium tracking-wide truncate" style={{color:'var(--text-subtle)'}}>
                Mobile App (Offline) • Hajj &amp; Umrah
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(212,175,55,0.55)]" />
            <input
              type="text"
              placeholder="Search by title, Arabic, translation, or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full islamic-input text-sm pl-10 pr-9 py-2 rounded-xl transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80" style={{color:'var(--text-muted)'}}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls & User Profile */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Desktop status pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs" style={{background:'var(--bg-input)', borderColor:'var(--border-gold)'}}>
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" style={{color:'var(--teal-bright)'}} />
                  <span className="font-medium" style={{color:'var(--teal-bright)'}}>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" style={{color:'var(--gold-light)'}} />
                  <span className="font-medium" style={{color:'var(--gold-light)'}}>Offline</span>
                </>
              )}
            </div>

            {/* Offline Audio Badge for desktop */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs shadow-sm" style={{background:'var(--bg-input)', borderColor:'var(--border-gold)', color:'var(--text-heading)'}} title="Stored locally on device for 100% offline listening">
              <Volume2 className="w-3.5 h-3.5" style={{color:'var(--gold-bright)'}} />
              <span className="font-medium">
                Offline: {cachedAudioIds.size > 0 ? `${cachedAudioIds.size}/4 Saved` : "4/4 Ready"}
              </span>
            </div>

            {/* Language Selector: Compact on mobile */}
            <div className="flex rounded-xl border p-0.5" style={{background:'var(--bg-deep)', borderColor:'var(--border-gold)'}}>
              {(["en", "ta", "ur"] as TranslationLang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLang(l)}
                  className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-bold uppercase transition text-[10px] sm:text-xs ${
                    selectedLang === l
                      ? "bg-[#d4af37] text-[#050c1a] shadow-sm"
                      : ""
                  }`}
                  style={selectedLang !== l ? {color:'var(--text-muted)'} : undefined}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition active:scale-95 flex-shrink-0"
              style={{background:'var(--bg-input)', borderColor:'var(--border-gold)'}}
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="w-3.5 h-3.5 text-[#d4af37]" /> : <Sun className="w-3.5 h-3.5 text-[#8a5e00]" />}
            </button>

            {/* Sync Now button */}
            <button
              onClick={() => sync.run()}
              title="Sync Playlists & Bookmarks"
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition active:scale-95 flex-shrink-0"
              style={{background:'var(--bg-input)', borderColor:'var(--border-gold)', color:'var(--gold-bright)'}}
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
            </button>

            {/* Auth Profile Button */}
            {user ? (
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="w-7 h-7 sm:w-auto sm:px-3 sm:py-1.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-xs text-red-300 transition flex items-center justify-center gap-1 flex-shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => { setShowAuthModal(true); setAuthError(null); }}
                title="Sign In / Register"
                className="btn-gold w-7 h-7 sm:w-auto sm:px-3 sm:py-1.5 rounded-xl text-xs transition active:scale-95 flex items-center justify-center gap-1 flex-shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2 md:hidden relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{color:'var(--text-subtle)'}} />
          <input
            type="text"
            placeholder="Search duas, Arabic, or translation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full islamic-input text-xs sm:text-sm pl-10 pr-9 py-2 rounded-xl transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80" style={{color:'var(--text-muted)'}}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Hero / Islamic Banner (Dynamic Light & Dark Theme) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6">
        <div className="islamic-hero-banner relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-7">
          <div
            className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, var(--hero-glow), transparent 70%)' }}
          />
          <div className="relative z-10 max-w-2xl">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 shadow-sm"
              style={{
                background: 'var(--hero-badge-bg)',
                border: '1px solid var(--hero-badge-border)',
                color: 'var(--hero-badge-text)'
              }}
            >
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span className="tracking-wide">HAJ DUA'S MOBILE APP (OFFLINE)</span>
            </div>
            <h1
              className="text-xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: 'var(--hero-title)', fontFamily: '"Cinzel", Georgia, serif' }}
            >
              Hajj &amp; Umrah Supplications
            </h1>
            <p
              className="mt-1.5 sm:mt-2 text-xs sm:text-base leading-relaxed"
              style={{ color: 'var(--hero-desc)' }}
            >
              Complete supplications for your sacred journey from leaving home to Makkah, Mina, and Arafah. Works 100% offline with Arabic text, transliteration, and English/Urdu translations.
            </p>

            <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => { setSelectedCategory("Hajj & Umrah"); setActiveTab("explore"); }}
                className="btn-gold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
              >
                🕋 Hajj &amp; Umrah Duas ({duas.length})
              </button>
              <button
                onClick={() => setFontSizeLarge(!fontSizeLarge)}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
                style={{
                  background: 'var(--hero-btn-font-bg)',
                  border: '1px solid var(--hero-btn-font-border)',
                  color: 'var(--hero-btn-font-text)'
                }}
              >
                Arabic Font: {fontSizeLarge ? "Large" : "Standard"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Explore / Bookmarks / Playlists) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-4 sm:mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[rgba(212,175,55,0.15)] pb-2.5 sm:pb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none max-w-full py-0.5">
            <button
              onClick={() => { setActiveTab("explore"); setActivePlaylist(null); }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === "explore"
                  ? "tab-active-teal"
                  : ""
              }`}
              style={activeTab !== "explore" ? {color:'var(--text-muted)'} : undefined}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>All Duas</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {duas.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("bookmarks"); setActivePlaylist(null); }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === "bookmarks"
                  ? "tab-active-gold"
                  : ""
              }`}
              style={activeTab !== "bookmarks" ? {color:'var(--text-muted)'} : undefined}
            >
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Favorites</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {bookmarks.size}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("playlists")}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === "playlists"
                  ? "tab-active-teal"
                  : ""
              }`}
              style={activeTab !== "playlists" ? {color:'var(--text-muted)'} : undefined}
            >
              <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>My Playlists</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {playlists.length}
              </span>
            </button>
          </div>

          {activeTab === "playlists" && (
            <button
              onClick={() => setShowPlaylistModal(true)}
              className="btn-teal flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Playlist</span>
            </button>
          )}
        </div>

        {/* Categories Bar */}
        {activeTab !== "playlists" && (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cat-chip ${isSelected ? 'active' : ''} px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-4 sm:mt-6">
        {/* Playlists View */}
        {activeTab === "playlists" && !activePlaylist && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.length === 0 ? (
              <div className="col-span-full py-16 text-center rounded-3xl glass-panel border border-[rgba(212,175,55,0.15)]">
                <ListMusic className="w-12 h-12 text-[rgba(212,175,55,0.40)] mx-auto mb-3" />
                <h3 className="text-lg font-bold" style={{color:'var(--gold-bright)'}}>No Playlists Yet</h3>
                <p className="text-sm mt-1 max-w-sm mx-auto" style={{color:'var(--text-muted)'}}>
                  Create custom playlists for your Hajj pilgrimage, morning routine, or personal memorization.
                </p>
                <button
                  onClick={() => setShowPlaylistModal(true)}
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
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'rgba(212,175,55,0.14)', border:'1px solid var(--border-gold)', color:'var(--gold-bright)'}}>
                          <ListMusic className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-base truncate max-w-[180px]" style={{color:'var(--text-primary)'}}>
                          {pl.title}
                        </h3>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{background:'rgba(212,175,55,0.10)', color:'var(--gold-bright)', border:'1px solid var(--border-gold)'}}>
                        {pl.duaIds.length} Duas
                      </span>
                    </div>
                    <p className="text-xs mt-3" style={{color:'var(--text-muted)'}}>
                      Sync: <span className="capitalize" style={{color:'var(--teal-bright)'}}>{pl.syncStatus}</span> • Created {new Date(pl.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-[rgba(212,175,55,0.10)]">
                    <button
                      onClick={() => setActivePlaylist(pl)}
                      className="text-xs font-bold flex items-center gap-1 transition"
                      style={{color:'var(--gold-bright)'}}
                    >
                      <span>View Duas</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePlaylist(pl.id)}
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

        {/* Selected Playlist Banner */}
        {activeTab === "playlists" && activePlaylist && (
          <div className="mb-6 p-5 rounded-2xl glass-panel flex items-center justify-between" style={{border:'1px solid var(--border-gold-md)'}}>
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePlaylist(null)}
                  className="text-xs hover:underline flex items-center gap-1 transition"
                  style={{color:'var(--gold-bright)'}}
                >
                  ← Back to All Playlists
                </button>
              </div>
              <h2 className="text-xl font-bold mt-1" style={{color:'var(--gold-bright)'}}>{activePlaylist.title}</h2>
              <p className="text-xs" style={{color:'var(--text-muted)'}}>{activePlaylist.duaIds.length} duas in this collection</p>
            </div>
            <button
              onClick={() => {
                if (filteredDuas.length > 0) handlePlayDua(filteredDuas[0]);
              }}
              className="btn-teal px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play All</span>
            </button>
          </div>
        )}

        {/* Dua Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="crescent-spinner mx-auto mb-4" />
            <p className="text-sm" style={{color:'var(--text-muted)'}}>Loading sacred supplications...</p>
          </div>
        ) : filteredDuas.length === 0 ? (
          <div className="py-20 text-center rounded-3xl glass-panel border border-[rgba(212,175,55,0.15)]">
            <BookOpen className="w-10 h-10 mx-auto mb-3" style={{color:'var(--border-gold-md)'}} />
            <h3 className="text-lg font-bold" style={{color:'var(--text-heading)'}}>No Supplications Found</h3>
            <p className="text-sm mt-1 max-w-sm mx-auto" style={{color:'var(--text-muted)'}}>
              {search
                ? `No results match "${search}". Try checking the spelling or searching in English/Arabic.`
                : activeTab === "bookmarks"
                ? "You haven't bookmarked any duas yet. Tap the star icon on any card to save it here."
                : "No duas found in this category."}
            </p>
            {(search || selectedCategory !== "All") && (
              <button
                onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                className="btn-teal mt-4 px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDuas.map((dua) => {
              const isBookmarked = bookmarks.has(dua._id);
              const isSpeaking = speakingDuaId === dua._id;
              const isPlayingAudio = playingAudioId === dua._id;
              const isPlaying = isPlayingAudio || isSpeaking;
              const translationText = dua.translations?.[selectedLang] || dua.translations?.en || "Translation pending";
              const displayTitle = dua.titles?.[selectedLang] || dua.title;

              return (
                <div
                  key={dua._id}
                  onClick={() => handlePlayDua(dua)}
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
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1" style={{background:'rgba(212,175,55,0.14)', border:'1px solid var(--border-gold)', color:'var(--gold-bright)'}}>
                            <Sparkles className="w-2.5 h-2.5" style={{color:'var(--gold-bright)'}} />
                            <span>Verified</span>
                          </span>
                        )}
                        {dua.audioUrl && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 transition"
                            style={{
                              background: isPlaying ? 'rgba(212,175,55,0.18)' : 'rgba(15,150,144,0.14)',
                              color: isPlaying ? 'var(--gold-bright)' : 'var(--teal-bright)',
                              borderColor: isPlaying ? 'var(--border-gold-md)' : 'rgba(20,196,187,0.35)'
                            }}>
                            <Volume2 className={`w-2.5 h-2.5 ${isPlaying ? "animate-pulse" : ""}`} style={{color: isPlaying ? 'var(--gold-bright)' : 'var(--teal-bright)'}} />
                            <span className="hidden sm:inline">{isPlaying ? "Playing Now" : "Arabic Audio • 💾 Offline Ready"}</span>
                            <span className="sm:hidden">{isPlaying ? "Playing" : "Audio 💾"}</span>
                          </span>
                        )}
                        <span className="text-[10px] uppercase font-bold" style={{color:'var(--text-subtle)'}}>
                          {dua.kind}
                        </span>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(dua._id);
                        }}
                        className="p-2 rounded-xl transition"
                        style={{
                          background: isBookmarked ? 'rgba(212,175,55,0.18)' : 'var(--bg-input)',
                          border: isBookmarked ? '1px solid var(--border-gold-md)' : '1px solid var(--border-gold)',
                          color: isBookmarked ? 'var(--gold-bright)' : 'var(--text-muted)'
                        }}
                        title={isBookmarked ? "Remove Bookmark" : "Add to Bookmarks"}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {/* Dua Title */}
                    <h3
                      className="mt-3 text-lg font-bold transition-colors"
                      style={{
                        color: isPlaying ? 'var(--gold-bright)' : 'var(--text-primary)'
                      }}
                    >
                      {displayTitle}
                    </h3>

                    {/* Arabic Text (The Star of the Card) */}
                    <div className={`arabic-block mt-4 transition-all ${
                      isPlaying
                        ? "border-[rgba(212,175,55,0.35)] shadow-inner" : ""
                    }`}>
                      <p
                        dir="rtl"
                        className={`font-arabic leading-relaxed text-right tracking-wide transition-all ${
                          fontSizeLarge ? "text-3xl leading-[2.2]" : "text-2xl leading-[2.0]"
                        }`}
                        style={{
                          fontFamily: "'Amiri', 'Scheherazade New', serif",
                          color: isPlaying ? 'var(--gold-bright)' : 'var(--text-primary)'
                        }}
                      >
                        {dua.arabicText}
                      </p>
                    </div>

                    {/* Transliteration */}
                    {dua.transliteration && (
                      <p className="mt-3 text-xs sm:text-sm italic font-sans leading-relaxed whitespace-pre-line" style={{color:'var(--teal-bright)'}}>
                        "{dua.transliteration}"
                      </p>
                    )}

                    {/* Translation */}
                    <div className="mt-2.5 text-sm font-sans leading-relaxed whitespace-pre-line space-y-1.5" style={{color:'var(--text-muted)'}}>
                      {translationText}
                    </div>

                    {/* Reference & Source */}
                    {(dua.reference || dua.source) && (
                      <div className="mt-3 flex items-center gap-2 text-xs" style={{color:'var(--text-subtle)'}}>
                        <Info className="w-3.5 h-3.5" style={{color:'var(--border-gold-md)'}} />
                        <span>
                          {dua.source ? `${dua.source} • ` : ""}
                          {dua.reference}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Toolbar */}
                  <div className="mt-5 pt-4 flex items-center justify-between gap-2" style={{borderTop:'1px solid rgba(212,175,55,0.12)'}}>
                    {/* Play / Recite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayDua(dua);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 ${
                        isPlaying
                          ? "gold-pulse"
                          : ""
                      } ${isPlaying ? "btn-gold" : "btn-teal"}`}
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
                          <span className="hidden sm:inline">{dua.audioUrl ? "Play Arabic Audio (Offline)" : "Listen & Recite"}</span>
                          <span className="sm:hidden">{dua.audioUrl ? "Play Audio" : "Listen"}</span>
                        </>
                      )}
                    </button>

                    {/* Secondary Actions */}
                    <div className="flex items-center gap-1.5">
                      {/* Add to Playlist button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDuaToAddToPlaylist(dua);
                        }}
                        title="Add to Playlist"
                        className="p-2 rounded-xl transition" style={{background:'var(--bg-input)', border:'1px solid var(--border-gold)', color:'var(--text-muted)'}}
                        onMouseEnter={e => (e.currentTarget.style.color='var(--gold-bright)')}
                        onMouseLeave={e => (e.currentTarget.style.color='var(--text-muted)')}
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {/* Copy button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyDua(dua);
                        }}
                        title="Copy to Clipboard"
                        className="p-2 rounded-xl transition" style={{background:'var(--bg-input)', border:'1px solid var(--border-gold)', color:'var(--text-muted)'}}
                        onMouseEnter={e => (e.currentTarget.style.color='var(--gold-bright)')}
                        onMouseLeave={e => (e.currentTarget.style.color=copiedId===dua._id?'var(--teal-bright)':'var(--text-muted)')}
                      >
                        {copiedId === dua._id ? (
                          <Check className="w-4 h-4" style={{color:'var(--teal-bright)'}} />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* Share button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareDua(dua);
                        }}
                        title="Share Dua"
                        className="p-2 rounded-xl transition" style={{background:'var(--bg-input)', border:'1px solid var(--border-gold)', color:'var(--text-muted)'}}
                        onMouseEnter={e => (e.currentTarget.style.color='var(--gold-bright)')}
                        onMouseLeave={e => (e.currentTarget.style.color='var(--text-muted)')}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {/* In Playlist: Remove option */}
                      {activeTab === "playlists" && activePlaylist && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromPlaylist(activePlaylist.id, dua._id);
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
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Audio Bar */}
      {currentDua && (
        <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel px-3 sm:px-4 py-2.5 sm:py-3 shadow-2xl backdrop-blur-xl pb-safe" style={{borderTop:'1px solid var(--border-gold-md)'}}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 md:gap-6">
            {/* Top row / Left meta */}
            <div className="flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'rgba(212,175,55,0.14)', border:'1px solid var(--border-gold)', color:'var(--gold-bright)'}}>
                  <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 ${playingAudioId || speakingDuaId ? "animate-pulse text-[#fde68a]" : ""}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm font-bold truncate max-w-[190px] sm:max-w-none" style={{color:'var(--gold-light)'}}>
                      {currentDua.titles?.[selectedLang] || currentDua.title}
                    </span>
                    <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-semibold flex items-center gap-1 flex-shrink-0" style={{background:'rgba(212,175,55,0.14)', color:'var(--gold-light)'}}>
                      {currentDua.audioUrl ? (
                        <>
                          <span>🎙️</span>
                          <span className="font-mono">100% OFFLINE</span>
                        </>
                      ) : (
                        "Voice"
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs truncate font-arabic font-medium" style={{color:'var(--text-muted)'}}>
                    {currentDua.arabicText}
                  </p>
                </div>
              </div>

              {/* Close Button on Mobile (visible top-right of player) */}
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                  setPlayingAudioId(null);
                  setSpeakingDuaId(null);
                  setCurrentDua(null);
                }}
                className="md:hidden p-1.5 rounded-lg transition"
                style={{color:'var(--text-muted)'}}
                title="Dismiss Player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber Progress Bar for Real Audio */}
            {currentDua.audioUrl && (
              <div className="w-full md:flex-1 md:max-w-md flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-[11px] font-mono w-8 sm:w-10 text-right" style={{color:'var(--text-muted)'}}>
                  {formatTime(audioCurrentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioProgress}
                  onChange={handleSeek}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-[#d4af37]" style={{background:'var(--bg-input)', border:'1px solid var(--border-gold)'}}
                />
                <span className="text-[10px] sm:text-[11px] font-mono w-8 sm:w-10" style={{color:'var(--text-muted)'}}>
                  {formatTime(audioDuration)}
                </span>
              </div>
            )}

            {/* Playback Controls */}
            <div className="flex items-center justify-center md:justify-end gap-3 sm:gap-4">
              {currentDua.audioUrl && (
                <button
                  onClick={() => skipAudio(-5)}
                  className="p-2 rounded-xl transition active:scale-95" style={{background:'var(--bg-input)', border:'1px solid var(--border-gold)', color:'var(--text-muted)'}}
                  title="Rewind 5s"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => handlePlayDua(currentDua)}
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition active:scale-95 gold-pulse text-slate-900 font-bold" style={{background:'linear-gradient(135deg, #b8860b, #d4af37)'}}
              >
                {playingAudioId === currentDua._id || speakingDuaId === currentDua._id ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {currentDua.audioUrl && (
                <button
                  onClick={() => skipAudio(5)}
                  className="p-2 rounded-xl transition active:scale-95" style={{background:'var(--bg-input)', border:'1px solid var(--border-gold)', color:'var(--text-muted)'}}
                  title="Forward 5s"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                  setPlayingAudioId(null);
                  setSpeakingDuaId(null);
                  setCurrentDua(null);
                }}
                className="hidden md:flex p-2 rounded-xl transition"
                style={{color:'var(--text-muted)'}}
                title="Dismiss Player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Native App Feel) */}
      {!currentDua && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel px-2 py-1.5 shadow-2xl backdrop-blur-xl pb-safe" style={{borderTop:'1px solid var(--border-gold-md)'}}>
          <div className="flex items-center justify-around">
            <button
              onClick={() => { setActiveTab("explore"); setActivePlaylist(null); }}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
                activeTab === "explore"
                  ? "font-bold"
                  : "hover:opacity-100"
              }`}
              style={{color: activeTab === "explore" ? 'var(--teal-bright)' : 'var(--text-muted)'}}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">All Duas</span>
            </button>

            <button
              onClick={() => { setActiveTab("bookmarks"); setActivePlaylist(null); }}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition relative ${
                activeTab === "bookmarks"
                  ? "font-bold"
                  : "hover:opacity-100"
              }`}
              style={{color: activeTab === "bookmarks" ? 'var(--gold-bright)' : 'var(--text-muted)'}}
            >
              <Bookmark className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Favorites</span>
              {bookmarks.size > 0 && (
                <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full text-slate-900 text-[9px] font-bold flex items-center justify-center" style={{background:'var(--gold-bright)'}}>
                  {bookmarks.size}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("playlists")}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
                activeTab === "playlists"
                  ? "font-bold"
                  : "hover:opacity-100"
              }`}
              style={{color: activeTab === "playlists" ? 'var(--teal-bright)' : 'var(--text-muted)'}}
            >
              <ListMusic className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Playlists</span>
            </button>

            <button
              onClick={() => setFontSizeLarge(!fontSizeLarge)}
              className="flex flex-col items-center py-1 px-3 rounded-xl transition"
              style={{color:'var(--text-muted)'}}
            >
              <span className="text-sm font-bold font-arabic leading-none h-5 flex items-center">ع</span>
              <span className="text-[10px] mt-0.5">{fontSizeLarge ? "Font: 32px" : "Font: 26px"}</span>
            </button>
          </div>
        </nav>
      )}

      {/* Playlist Selector Modal */}
      {duaToAddToPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-dropdown p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3" style={{borderBottom:'1px solid var(--border-gold)'}}>
              <h3 className="font-bold text-base" style={{color:'var(--gold-light)'}}>Add to Playlist</h3>
              <button onClick={() => setDuaToAddToPlaylist(null)} style={{color:'var(--text-muted)'}} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs mt-2 truncate" style={{color:'var(--text-muted)'}}>
              Adding: <strong style={{color:'var(--gold-bright)'}}>{duaToAddToPlaylist.title}</strong>
            </p>

            {/* Existing Playlists list */}
            <div className="mt-4 max-h-48 overflow-y-auto space-y-2">
              {playlists.length === 0 ? (
                <p className="text-xs py-2 text-center" style={{color:'var(--text-muted)'}}>No existing playlists.</p>
              ) : (
                playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleAddToPlaylist(pl.id)}
                    className="w-full text-left p-2.5 rounded-xl flex items-center justify-between group transition" style={{background:'var(--bg-input)', border:'1px solid var(--border-gold)'}}
                  >
                    <span className="text-sm font-semibold transition" style={{color:'var(--text-primary)'}}>{pl.title}</span>
                    <span className="text-xs" style={{color:'var(--text-muted)'}}>{pl.duaIds.length} Duas</span>
                  </button>
                ))
              )}
            </div>

            {/* Create new playlist inside modal */}
            <form onSubmit={handleCreatePlaylist} className="mt-4 pt-3" style={{borderTop:'1px solid var(--border-gold)'}}>
              <label className="text-xs font-semibold block mb-1.5" style={{color:'var(--text-muted)'}}>Or create new playlist</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Day 1: Mina & Arafat"
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  className="flex-1 islamic-input text-sm px-3 py-2 rounded-xl"
                />
                <button
                  type="submit"
                  className="btn-teal px-4 py-2 rounded-xl font-bold text-xs transition"
                >
                  Create & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standalone Create Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl glass-dropdown p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3" style={{borderBottom:'1px solid var(--border-gold)'}}>
              <h3 className="font-bold text-base" style={{color:'var(--gold-light)'}}>New Playlist</h3>
              <button onClick={() => setShowPlaylistModal(false)} style={{color:'var(--text-muted)'}} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => { handleCreatePlaylist(e); setShowPlaylistModal(false); }} className="mt-4">
              <label className="text-xs font-semibold block mb-1.5" style={{color:'var(--text-muted)'}}>Playlist Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Hajj Rituals & Tawaf"
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                className="w-full islamic-input text-sm px-3.5 py-2.5 rounded-xl"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPlaylistModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                  style={{color:'var(--text-muted)'}}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-teal px-4 py-2 rounded-xl font-bold text-xs transition"
                >
                  Create Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal (Sign In / Register) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-dropdown p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3" style={{borderBottom:'1px solid var(--border-gold)'}}>
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" style={{color:'var(--gold-bright)'}} />
                <h3 className="font-bold text-base" style={{color:'var(--gold-light)'}}>
                  {authMode === "login" ? "Sign In to Noor" : "Create Noor Account"}
                </h3>
              </div>
              <button onClick={() => setShowAuthModal(false)} style={{color:'var(--text-muted)'}} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode switch */}
            <div className="mt-4 flex rounded-xl p-1" style={{background:'var(--bg-input)', border:'1px solid var(--border-gold)'}}>
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setAuthError(null); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  authMode === "login" ? "btn-teal" : ""
                }`}
                style={{color: authMode === "login" ? undefined : 'var(--text-muted)'}}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("register"); setAuthError(null); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  authMode === "register" ? "btn-teal" : ""
                }`}
                style={{color: authMode === "register" ? undefined : 'var(--text-muted)'}}
              >
                Create Account
              </button>
            </div>

            {authError && (
              <div className="mt-3 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuth} className="mt-4 space-y-3">
              {authMode === "register" && (
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{color:'var(--text-muted)'}}>Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ibrahim"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full islamic-input text-sm px-3.5 py-2 rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold block mb-1" style={{color:'var(--text-muted)'}}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full islamic-input text-sm px-3.5 py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1" style={{color:'var(--text-muted)'}}>Password (8+ chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full islamic-input text-sm px-3.5 py-2 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn-gold w-full mt-2 py-2.5 rounded-xl font-bold text-sm transition active:scale-95 disabled:opacity-50"
              >
                {authLoading ? "Authenticating..." : authMode === "login" ? "Sign In" : "Register"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
