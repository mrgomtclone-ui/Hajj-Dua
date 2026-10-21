import React, { useState, useEffect, useMemo, useRef } from "react";
import { api, SESSION_EXPIRED } from "../services/api/client";
import { repo, sync } from "../main";
import { db } from "../db/indexedDb";
import { downloadManager, DownloadState } from "../services/offline/downloadManager";
import type {
  DuaItem,
  TranslationLang,
  UserProfile,
  EventInfo,
  Playlist,
  AudioSelectionConfig
} from "../types";
import { FALLBACK_DUAS } from "../data/fallbackDuas";
export type { DuaItem, TranslationLang };

// Modular Page Folders
import { HomePage } from "../pages/HomePage";
import { DuasPage } from "../pages/DuasPage";
import { DownloadsPage } from "../pages/DownloadsPage";
import { FavoritesPage } from "../pages/FavoritesPage";
import { PlaylistsPage } from "../pages/PlaylistsPage";

// Shared Components
import { Header } from "../components/Header";
import { BottomNav, NavTab } from "../components/BottomNav";
import { AudioPlayerBar } from "../components/AudioPlayer";
import {
  AuthModal,
  PlaylistSelectorModal,
  CreatePlaylistModal,
  EventInfoModal,
  AudioSelectionModal
} from "../components/Modals";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>("home");

  // Core Data States
  const [duas, setDuas] = useState<DuaItem[]>(FALLBACK_DUAS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLang, setSelectedLang] = useState<TranslationLang>("en");
  const [search, setSearch] = useState("");
  const [fontSizeLarge, setFontSizeLarge] = useState<boolean>(false);

  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("theme") !== "light";
  });

  // User & Sync States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");

  // PWA Installation Prompt State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice?.outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  // Offline Downloads State (Spotify & YouTube Style)
  const [downloadState, setDownloadState] = useState<DownloadState>(() => downloadManager.getState());

  useEffect(() => {
    return downloadManager.subscribe(setDownloadState);
  }, []);

  // Filtered active downloads count matching active duas catalog
  const activeDownloadedCount = useMemo(() => {
    return duas.filter((d) => downloadState.downloadedIds.has(d._id)).length;
  }, [duas, downloadState.downloadedIds]);

  // Automatically prune orphaned IndexedDB audio records from previous test seeds
  useEffect(() => {
    if (duas && duas.length > 0) {
      downloadManager.pruneOrphans(duas);
    }
  }, [duas]);

  // Bookmarks & Playlists
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [duaToAddToPlaylist, setDuaToAddToPlaylist] = useState<DuaItem | null>(null);
  const [activeEventInfo, setActiveEventInfo] = useState<EventInfo | null>(null);
  const [showAudioSelectionModal, setShowAudioSelectionModal] = useState(false);

  // Audio Selection Config (Heading, Arabic Recitation, Translation Meaning, Only Read)
  const [audioConfig, setAudioConfig] = useState<AudioSelectionConfig>(() => {
    try {
      const saved = localStorage.getItem("haj_audio_selection_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          playHeading: parsed.playHeading !== undefined ? parsed.playHeading : true,
          playArabic: parsed.playArabic !== undefined ? parsed.playArabic : true,
          playTranslation: parsed.playTranslation !== undefined ? parsed.playTranslation : true,
          onlyRead: !!parsed.onlyRead
        };
      }
    } catch (e) {
      console.warn("Failed to read audio config from storage:", e);
    }
    return {
      playHeading: true,
      playArabic: true,
      playTranslation: true,
      onlyRead: false
    };
  });
  const audioConfigRef = useRef<AudioSelectionConfig>(audioConfig);

  useEffect(() => {
    audioConfigRef.current = audioConfig;
  }, [audioConfig]);

  const handleSaveAudioConfig = (newConfig: AudioSelectionConfig) => {
    setAudioConfig(newConfig);
    try {
      localStorage.setItem("haj_audio_selection_config", JSON.stringify(newConfig));
    } catch (e) {
      console.warn("Failed to save audio config:", e);
    }
  };

  // Audio Playback Engine
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentDua, setCurrentDua] = useState<DuaItem | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [speakingDuaId, setSpeakingDuaId] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);

  // Interaction feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Playback Phase State (Heading -> Arabic Recitation -> Translation Meaning)
  const [audioPhase, setAudioPhase] = useState<"idle" | "heading" | "arabic" | "meaning">("idle");
  const audioPhaseRef = useRef<"idle" | "heading" | "arabic" | "meaning">("idle");
  const currentDuaRef = useRef<DuaItem | null>(null);
  const selectedLangRef = useRef<TranslationLang>(selectedLang);

  useEffect(() => {
    selectedLangRef.current = selectedLang;
  }, [selectedLang]);

  useEffect(() => {
    currentDuaRef.current = currentDua;
  }, [currentDua]);

  const updateAudioPhase = (phase: "idle" | "heading" | "arabic" | "meaning") => {
    audioPhaseRef.current = phase;
    setAudioPhase(phase);
  };

  // Initialize Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      sync.run();
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch Duas & Cache in IndexedDB (enriching with fallback title audio tracks)
  useEffect(() => {
    async function loadDuas() {
      try {
        const cached = await db.duas.toArray();
        if (cached && cached.length > 0) {
          const enrichedCached = (cached as unknown as DuaItem[]).map((d) => {
            const fb = FALLBACK_DUAS.find((f) => f.slug === d.slug || f.title === d.title || f._id === d._id);
            return fb
              ? {
                  ...fb,
                  ...d,
                  audioTitleEnglishUrl: d.audioTitleEnglishUrl || fb.audioTitleEnglishUrl,
                  audioTitleTamilUrl: d.audioTitleTamilUrl || fb.audioTitleTamilUrl,
                  audioTitleUrduUrl: d.audioTitleUrduUrl || fb.audioTitleUrduUrl
                }
              : d;
          });
          setDuas(enrichedCached);
        }

        const res = await api<any>("/duas?limit=50");
        const items: DuaItem[] = Array.isArray(res) ? res : res?.items || [];
        if (items && items.length > 0) {
          const enriched = items.map((d) => {
            const fb = FALLBACK_DUAS.find((f) => f.slug === d.slug || f.title === d.title || f._id === d._id);
            return fb
              ? {
                  ...fb,
                  ...d,
                  audioTitleEnglishUrl: d.audioTitleEnglishUrl || fb.audioTitleEnglishUrl,
                  audioTitleTamilUrl: d.audioTitleTamilUrl || fb.audioTitleTamilUrl,
                  audioTitleUrduUrl: d.audioTitleUrduUrl || fb.audioTitleUrduUrl
                }
              : d;
          });
          setDuas(enriched);
          await db.duas.bulkPut(enriched as any);
        }
      } catch {
        // Network unavailable: fallback data in place
      }
    }
    loadDuas();
  }, []);

  // Sync Listeners & Playlists Loader
  async function loadPlaylists() {
    try {
      const all = await repo.list();
      setPlaylists(all);
    } catch (err) {
      console.warn("Could not load playlists", err);
    }
  }

  async function loadBookmarks() {
    try {
      const res = await api<string[]>("/bookmarks");
      if (res) {
        setBookmarks(new Set(res));
      }
    } catch {
      // offline
    }
  }

  useEffect(() => {
    loadPlaylists();
    loadBookmarks();

    const unsubSync = sync.onStatus((state) => {
      setSyncStatus(state === "signed-out" || state === "offline" ? "idle" : state);
      if (state === "idle") {
        loadPlaylists();
      }
    });

    const handleSessionExpired = () => {
      setUser(null);
      setShowAuthModal(true);
    };
    window.addEventListener(SESSION_EXPIRED, handleSessionExpired);

    return () => {
      unsubSync();
      window.removeEventListener(SESSION_EXPIRED, handleSessionExpired);
    };
  }, []);

  // Audio Engine Lifecycle
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setAudioCurrentTime(audio.currentTime);
      if (audio.duration > 0) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      setAudioDuration(audio.duration || 0);
    };

    const onEnded = () => {
      const currentPhase = audioPhaseRef.current;
      const dua = currentDuaRef.current;
      const lang = selectedLangRef.current;
      const config = audioConfigRef.current;

      if (!dua) {
        updateAudioPhase("idle");
        setPlayingAudioId(null);
        return;
      }

      // 1. Heading just finished -> Transition to Arabic Recitation (if enabled) or Meaning
      if (currentPhase === "heading") {
        playNextAfterHeading(dua, audio, config, lang);
        return;
      }

      // 2. Arabic Recitation just finished -> Transition to Meaning (if enabled)
      if (currentPhase === "arabic") {
        playNextAfterArabic(dua, audio, config, lang);
        return;
      }

      // 3. Meaning just finished -> Sequence complete!
      updateAudioPhase("idle");
      setPlayingAudioId(null);
      setAudioProgress(0);
      setAudioCurrentTime(0);
    };

    const onError = () => {
      updateAudioPhase("idle");
      setPlayingAudioId(null);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function getHeadingTrackUrl(dua: DuaItem, lang: TranslationLang): string | undefined {
    let url: string | undefined;
    if (lang === "ta") url = dua.audioTitleTamilUrl;
    else if (lang === "ur") url = dua.audioTitleUrduUrl;
    else url = dua.audioTitleEnglishUrl;

    if (url) return url;

    const match = FALLBACK_DUAS.find((f) => f.slug === dua.slug || f._id === dua._id || f.title === dua.title);
    if (match) {
      if (lang === "ta") return match.audioTitleTamilUrl;
      if (lang === "ur") return match.audioTitleUrduUrl;
      return match.audioTitleEnglishUrl;
    }
    return undefined;
  }

  function getMeaningTrackUrl(dua: DuaItem, lang: TranslationLang): string | undefined {
    let url: string | undefined;
    if (lang === "ta") url = dua.audioTamilUrl;
    else if (lang === "ur") url = dua.audioUrduUrl;
    else url = dua.audioEnglishUrl;

    if (url) return url;

    const match = FALLBACK_DUAS.find((f) => f.slug === dua.slug || f._id === dua._id || f.title === dua.title);
    if (match) {
      if (lang === "ta") return match.audioTamilUrl;
      if (lang === "ur") return match.audioUrduUrl;
      return match.audioEnglishUrl;
    }
    return undefined;
  }

  function playNextAfterHeading(dua: DuaItem, audio: HTMLAudioElement, config: AudioSelectionConfig, lang: TranslationLang) {
    if (config.playArabic && dua.audioUrl) {
      updateAudioPhase("arabic");
      audio.src = downloadManager.getAudioUrl(dua);
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setPlayingAudioId(dua._id))
        .catch((err) => {
          console.warn("Arabic playback failed after heading:", err);
          playNextAfterArabic(dua, audio, config, lang);
        });
      return;
    }
    playNextAfterArabic(dua, audio, config, lang);
  }

  function playNextAfterArabic(dua: DuaItem, audio: HTMLAudioElement, config: AudioSelectionConfig, lang: TranslationLang) {
    if (config.playTranslation) {
      const meaningUrl = getMeaningTrackUrl(dua, lang);
      if (meaningUrl) {
        updateAudioPhase("meaning");
        audio.src = meaningUrl;
        audio.currentTime = 0;
        audio
          .play()
          .then(() => setPlayingAudioId(dua._id))
          .catch((err) => {
            console.warn("Meaning playback failed after arabic:", err);
            updateAudioPhase("idle");
            setPlayingAudioId(null);
          });
        return;
      }
    }
    updateAudioPhase("idle");
    setPlayingAudioId(null);
    setAudioProgress(0);
    setAudioCurrentTime(0);
  }

  // Audio Controller (Heading 1st along with Translation -> Arabic Recitation 2nd -> Meaning 3rd!)
  function handlePlayDua(dua: DuaItem) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    const audio = audioRef.current;
    if (!audio) return;

    if (playingAudioId === dua._id) {
      audio.pause();
      setPlayingAudioId(null);
      return;
    }

    if (speakingDuaId === dua._id) {
      setSpeakingDuaId(null);
      return;
    }

    setCurrentDua(dua);
    currentDuaRef.current = dua;

    const config = audioConfigRef.current;
    const lang = selectedLang;

    // Mode 1: Only Read (silent reading mode)
    if (config.onlyRead || (!config.playArabic && !config.playTranslation)) {
      audio.pause();
      updateAudioPhase("idle");
      setPlayingAudioId(null);
      return;
    }

    setSpeakingDuaId(null);

    // Sequence Step 1: Heading Title (automatically plays if Translation is enabled)
    if (config.playTranslation) {
      const headingUrl = getHeadingTrackUrl(dua, lang);
      if (headingUrl) {
        updateAudioPhase("heading");
        audio.src = headingUrl;
        audio.currentTime = 0;
        audio
          .play()
          .then(() => {
            setPlayingAudioId(dua._id);
          })
          .catch((err) => {
            console.warn("Heading audio play failed, skipping to next:", err);
            playNextAfterHeading(dua, audio, config, lang);
          });
        return;
      }
    }

    // Sequence Step 2: Arabic Recitation (if Translation is off or heading unavailable)
    if (config.playArabic && dua.audioUrl) {
      updateAudioPhase("arabic");
      audio.src = downloadManager.getAudioUrl(dua);
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          setPlayingAudioId(dua._id);
        })
        .catch((err) => {
          console.warn("Arabic audio play failed, skipping to meaning:", err);
          playNextAfterArabic(dua, audio, config, lang);
        });
      return;
    }

    // Sequence Step 3: Translation meaning only (if Arabic is disabled and no heading)
    if (config.playTranslation) {
      playMeaningDirectly(dua);
      return;
    }

    // Fallback: None selected
    updateAudioPhase("idle");
    setPlayingAudioId(null);
  }


  function playMeaningDirectly(dua: DuaItem) {
    const audio = audioRef.current;
    if (!audio) return;
    const meaningUrl = getMeaningTrackUrl(dua, selectedLang);

    if (meaningUrl) {
      setSpeakingDuaId(null);
      updateAudioPhase("meaning");
      audio.src = meaningUrl;
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          setPlayingAudioId(dua._id);
        })
        .catch(() => {
          updateAudioPhase("idle");
          setPlayingAudioId(null);
          speakArabicText(dua);
        });
    } else {
      audio.pause();
      updateAudioPhase("idle");
      setPlayingAudioId(null);
      speakArabicText(dua);
    }
  }

  function speakArabicText(dua: DuaItem) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(dua.arabicText);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;

    utterance.onstart = () => {
      setSpeakingDuaId(dua._id);
    };
    utterance.onend = () => {
      setSpeakingDuaId(null);
      // After speech synthesis, play the meaning audio if available
      const meaningUrl =
        selectedLang === "en" ? dua.audioEnglishUrl :
        selectedLang === "ta" ? dua.audioTamilUrl :
        selectedLang === "ur" ? dua.audioUrduUrl :
        undefined;
      if (meaningUrl && audioRef.current) {
        updateAudioPhase("meaning");
        audioRef.current.src = meaningUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => setPlayingAudioId(dua._id)).catch(() => {});
      }
    };
    utterance.onerror = () => {
      setSpeakingDuaId(null);
    };

    window.speechSynthesis.speak(utterance);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const newPercent = parseFloat(e.target.value);
    const newTime = (newPercent / 100) * audio.duration;
    audio.currentTime = newTime;
    setAudioProgress(newPercent);
    setAudioCurrentTime(newTime);
  }

  function skipAudio(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, audio.duration || 0));
  }

  function dismissPlayer() {
    if (audioRef.current) audioRef.current.pause();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    updateAudioPhase("idle");
    setPlayingAudioId(null);
    setSpeakingDuaId(null);
    setCurrentDua(null);
  }

  // Spotify / YouTube Style Download Handlers
  async function handleToggleDownload(dua: DuaItem) {
    if (downloadManager.isDownloaded(dua._id)) {
      await downloadManager.remove(dua._id, dua.audioUrl);
    } else {
      await downloadManager.download(dua);
    }
  }

  async function handleDownloadAll() {
    await downloadManager.downloadAll(duas);
  }

  async function handleRemoveAllDownloads() {
    if (confirm("Remove all downloaded offline audio to free up device storage?")) {
      await downloadManager.removeAll(duas);
    }
  }

  // Bookmarking
  async function toggleBookmark(id: string) {
    const next = new Set(bookmarks);
    const willAdd = !next.has(id);
    if (willAdd) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setBookmarks(next);

    try {
      await api(`/bookmarks/${id}`, { method: willAdd ? "POST" : "DELETE" });
    } catch {
      // offline optimistic
    }
  }

  // Playlists Operations
  async function handleCreatePlaylist(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;

    try {
      const pl = await repo.create(newPlaylistTitle.trim());
      setPlaylists((prev) => [pl, ...prev]);
      setNewPlaylistTitle("");
      if (duaToAddToPlaylist) {
        await handleAddToPlaylist(pl.id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddToPlaylist(playlistId: string) {
    if (!duaToAddToPlaylist) return;
    try {
      await repo.add(playlistId, duaToAddToPlaylist._id);
      await loadPlaylists();
      setDuaToAddToPlaylist(null);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemoveFromPlaylist(playlistId: string, duaId: string) {
    try {
      await repo.remove(playlistId, duaId);
      await loadPlaylists();
      if (activePlaylist && activePlaylist.id === playlistId) {
        setActivePlaylist({
          ...activePlaylist,
          duaIds: activePlaylist.duaIds.filter((id) => id !== duaId)
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeletePlaylist(playlistId: string) {
    if (!confirm("Delete this playlist?")) return;
    try {
      await repo.delete(playlistId);
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      if (activePlaylist?.id === playlistId) {
        setActivePlaylist(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Copy & Share
  function copyDua(dua: DuaItem) {
    const displayTitle = dua.titles?.[selectedLang] || dua.title;
    let translit = "";
    if (selectedLang === "ta") translit = dua.transliterations?.ta || "";
    else if (selectedLang === "en") translit = dua.transliterations?.en || dua.transliteration || "";
    else if (selectedLang === "ur") translit = dua.transliterations?.ur || "";

    const text = `${displayTitle}\n\n${dua.arabicText}\n\n${translit ? `"${translit}"\n\n` : ""}${
      dua.translations?.[selectedLang] || dua.translations?.en || ""
    }\n\nReference: ${dua.reference || dua.source || "Haj Duas"}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua._id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function shareDua(dua: DuaItem) {
    const displayTitle = dua.titles?.[selectedLang] || dua.title;
    if (navigator.share) {
      navigator
        .share({
          title: displayTitle,
          text: `${displayTitle}\n\n${dua.arabicText}\n\n${
            dua.translations?.[selectedLang] || dua.translations?.en || ""
          }\n— ${dua.reference || "Haj Duas"}`,
          url: window.location.href
        })
        .catch(() => {});
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
      const body =
        authMode === "login"
          ? { email: authEmail, password: authPassword }
          : { email: authEmail, password: authPassword, name: authName };
      const res = await api<UserProfile>(endpoint, {
        method: "POST",
        body: JSON.stringify(body)
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

  // Categories Calculation
  const categories = useMemo(() => {
    const set = new Set<string>();
    duas.forEach((d) => d.category && set.add(d.category));
    return ["All", ...Array.from(set)];
  }, [duas]);

  // Search Matcher Helper
  function matchesSearch(d: DuaItem, query: string): boolean {
    if (!query) return true;
    const q = query.toLowerCase();
    const matchTitle = d.title.toLowerCase().includes(q);
    const matchTitles = Object.values(d.titles || {}).some((t) => t?.toLowerCase().includes(q));
    const matchArabic = d.arabicText.includes(q);
    const matchTrans =
      (d.transliteration || "").toLowerCase().includes(q) ||
      Object.values(d.transliterations || {}).some((t) => t?.toLowerCase().includes(q));
    const matchEn = (d.translations?.en || "").toLowerCase().includes(q);
    const matchUr = (d.translations?.ur || "").toLowerCase().includes(q);
    const matchTa = (d.translations?.ta || "").toLowerCase().includes(q);
    const matchRef = (d.reference || "").toLowerCase().includes(q);
    return matchTitle || matchTitles || matchArabic || matchTrans || matchEn || matchUr || matchTa || matchRef;
  }

  // Filtered Lists for Each Page
  const filteredDuas = useMemo(() => {
    return duas.filter((d) => {
      if (selectedCategory !== "All" && d.category !== selectedCategory) return false;
      return matchesSearch(d, search.trim());
    });
  }, [duas, selectedCategory, search]);

  const favoriteDuas = useMemo(() => {
    return duas.filter((d) => bookmarks.has(d._id) && matchesSearch(d, search.trim()));
  }, [duas, bookmarks, search]);

  const playlistDuas = useMemo(() => {
    if (!activePlaylist) return [];
    return duas.filter((d) => activePlaylist.duaIds.includes(d._id) && matchesSearch(d, search.trim()));
  }, [duas, activePlaylist, search]);

  return (
    <div
      className={`min-h-screen theme-fade ${currentDua ? "pb-56 sm:pb-36" : "pb-24 sm:pb-20"}`}
      style={{ color: "var(--text-primary)", backgroundColor: "var(--bg-base)" }}
    >
      {/* Top Header */}
      <Header
        isOnline={isOnline}
        search={search}
        onSearchChange={setSearch}
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
        fontSizeLarge={fontSizeLarge}
        onToggleFontSize={() => setFontSizeLarge(!fontSizeLarge)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        syncStatus={syncStatus}
        onSync={() => sync.run()}
        user={user}
        onOpenAuth={() => {
          setShowAuthModal(true);
          setAuthError(null);
        }}
        onLogout={handleLogout}
        canInstall={Boolean(installPrompt)}
        onInstall={handleInstallPWA}
        onOpenAudioSelection={() => setShowAudioSelectionModal(true)}
        onNavigateHome={() => {
          setActiveTab("home");
          setSelectedCategory("All");
          setActivePlaylist(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Page Routing */}
      {activeTab === "home" && (
        <HomePage
          duasCount={duas.length}
          downloadedCount={activeDownloadedCount}
          selectedLang={selectedLang}
          bookmarksCount={bookmarks.size}
          playlistsCount={playlists.length}
          onNavigateToDuas={() => {
            setSelectedCategory("Hajj & Umrah");
            setActiveTab("explore");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onNavigateToRecitation={() => {
            setActiveTab("downloads");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onNavigateToFavorites={() => {
            setActiveTab("bookmarks");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onNavigateToPlaylists={() => {
            setActiveTab("playlists");
            setActivePlaylist(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onOpenEventInfo={setActiveEventInfo}
        />
      )}

      {activeTab === "explore" && (
        <DuasPage
          filteredDuas={filteredDuas}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedLang={selectedLang}
          fontSizeLarge={fontSizeLarge}
          bookmarks={bookmarks}
          playlists={playlists}
          downloadedIds={downloadState.downloadedIds}
          downloadingIds={downloadState.downloadingIds}
          downloadProgress={downloadState.progress}
          playingAudioId={playingAudioId}
          speakingDuaId={speakingDuaId}
          audioDuration={audioDuration}
          audioCurrentTime={audioCurrentTime}
          copiedId={copiedId}
          onPlayDua={handlePlayDua}
          onToggleBookmark={toggleBookmark}
          onCopyDua={copyDua}
          onShareDua={shareDua}
          onAddToPlaylist={setDuaToAddToPlaylist}
          onToggleDownload={handleToggleDownload}
          onOpenAudioSelection={() => setShowAudioSelectionModal(true)}
          onBackToHome={() => {
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onNavigateToFavorites={() => {
            setActiveTab("bookmarks");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onNavigateToPlaylists={() => {
            setActiveTab("playlists");
            setActivePlaylist(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {(activeTab === "downloads" || activeTab === "recitation") && (
        <DownloadsPage
          allDuas={duas}
          selectedLang={selectedLang}
          fontSizeLarge={fontSizeLarge}
          bookmarks={bookmarks}
          downloadedIds={downloadState.downloadedIds}
          downloadingIds={downloadState.downloadingIds}
          downloadProgress={downloadState.progress}
          playingAudioId={playingAudioId}
          speakingDuaId={speakingDuaId}
          audioDuration={audioDuration}
          audioCurrentTime={audioCurrentTime}
          copiedId={copiedId}
          onPlayDua={handlePlayDua}
          onToggleBookmark={toggleBookmark}
          onCopyDua={copyDua}
          onShareDua={shareDua}
          onAddToPlaylist={setDuaToAddToPlaylist}
          onToggleDownload={handleToggleDownload}
          onDownloadAll={handleDownloadAll}
          onRemoveAllDownloads={handleRemoveAllDownloads}
          onOpenAudioSelection={() => setShowAudioSelectionModal(true)}
          onBackToHome={() => {
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {activeTab === "bookmarks" && (
        <FavoritesPage
          favoriteDuas={favoriteDuas}
          allDuasCount={duas.length}
          playlists={playlists}
          selectedLang={selectedLang}
          fontSizeLarge={fontSizeLarge}
          bookmarks={bookmarks}
          playingAudioId={playingAudioId}
          speakingDuaId={speakingDuaId}
          audioDuration={audioDuration}
          audioCurrentTime={audioCurrentTime}
          copiedId={copiedId}
          onPlayDua={handlePlayDua}
          onToggleBookmark={toggleBookmark}
          onCopyDua={copyDua}
          onShareDua={shareDua}
          onAddToPlaylist={setDuaToAddToPlaylist}
          onOpenAudioSelection={() => setShowAudioSelectionModal(true)}
          onBackToHome={() => {
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onNavigateToDuas={() => {
            setActiveTab("explore");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onNavigateToPlaylists={() => {
            setActiveTab("playlists");
            setActivePlaylist(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {activeTab === "playlists" && (
        <PlaylistsPage
          playlists={playlists}
          activePlaylist={activePlaylist}
          playlistDuas={playlistDuas}
          allDuasCount={duas.length}
          bookmarksCount={bookmarks.size}
          selectedLang={selectedLang}
          fontSizeLarge={fontSizeLarge}
          bookmarks={bookmarks}
          playingAudioId={playingAudioId}
          speakingDuaId={speakingDuaId}
          audioDuration={audioDuration}
          audioCurrentTime={audioCurrentTime}
          copiedId={copiedId}
          onPlayDua={handlePlayDua}
          onToggleBookmark={toggleBookmark}
          onCopyDua={copyDua}
          onShareDua={shareDua}
          onAddToPlaylist={setDuaToAddToPlaylist}
          onRemoveFromPlaylist={handleRemoveFromPlaylist}
          onSelectPlaylist={setActivePlaylist}
          onDeletePlaylist={handleDeletePlaylist}
          onOpenNewPlaylistModal={() => setShowPlaylistModal(true)}
          onOpenAudioSelection={() => setShowAudioSelectionModal(true)}
          onBackToHome={() => {
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onNavigateToDuas={() => {
            setActiveTab("explore");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onNavigateToFavorites={() => {
            setActiveTab("bookmarks");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {/* Floating Bottom Audio Player (with Spotify download status & Phase indicator) */}
      <AudioPlayerBar
        currentDua={currentDua}
        selectedLang={selectedLang}
        audioPhase={audioPhase}
        isPlaying={Boolean(
          currentDua && (playingAudioId === currentDua._id || speakingDuaId === currentDua._id)
        )}
        audioDuration={audioDuration}
        audioCurrentTime={audioCurrentTime}
        audioProgress={audioProgress}
        isDownloaded={Boolean(currentDua && downloadState.downloadedIds.has(currentDua._id))}
        isDownloading={Boolean(currentDua && downloadState.downloadingIds.has(currentDua._id))}
        onSeek={handleSeek}
        onSkip={skipAudio}
        onTogglePlay={handlePlayDua}
        onToggleDownload={handleToggleDownload}
        onOpenAudioSelection={() => setShowAudioSelectionModal(true)}
        onDismiss={dismissPlayer}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "playlists") setActivePlaylist(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        bookmarksCount={bookmarks.size}
        downloadsCount={activeDownloadedCount}
        fontSizeLarge={fontSizeLarge}
        onToggleFontSize={() => setFontSizeLarge(!fontSizeLarge)}
        hidden={Boolean(currentDua)}
      />

      {/* Modals */}
      <PlaylistSelectorModal
        dua={duaToAddToPlaylist}
        playlists={playlists}
        newPlaylistTitle={newPlaylistTitle}
        setNewPlaylistTitle={setNewPlaylistTitle}
        onClose={() => setDuaToAddToPlaylist(null)}
        onAddToPlaylist={handleAddToPlaylist}
        onCreateAndAdd={handleCreatePlaylist}
      />

      <CreatePlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        newPlaylistTitle={newPlaylistTitle}
        setNewPlaylistTitle={setNewPlaylistTitle}
        onCreate={handleCreatePlaylist}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authName={authName}
        setAuthName={setAuthName}
        authLoading={authLoading}
        authError={authError}
        onSubmit={handleAuth}
      />

      <EventInfoModal
        eventInfo={activeEventInfo}
        onClose={() => setActiveEventInfo(null)}
      />

      {/* Audio Selection Modal (matching reference design) */}
      <AudioSelectionModal
        isOpen={showAudioSelectionModal}
        onClose={() => setShowAudioSelectionModal(false)}
        config={audioConfig}
        onSaveConfig={handleSaveAudioConfig}
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
      />
    </div>
  );
}
