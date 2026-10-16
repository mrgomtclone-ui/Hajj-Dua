import React from "react";
import { Info, Heart, Bookmark, Download, Globe } from "lucide-react";
import type { TranslationLang, EventInfo } from "../../types";

export interface HomePageProps {
  duasCount: number;
  downloadedCount?: number;
  selectedLang: TranslationLang;
  bookmarksCount: number;
  playlistsCount: number;
  onNavigateToDuas: () => void;
  onNavigateToRecitation: () => void;
  onNavigateToFavorites: () => void;
  onNavigateToPlaylists: () => void;
  onOpenEventInfo: (info: EventInfo) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  duasCount,
  downloadedCount = 0,
  selectedLang,
  bookmarksCount,
  playlistsCount,
  onNavigateToDuas,
  onNavigateToRecitation,
  onNavigateToFavorites,
  onNavigateToPlaylists,
  onOpenEventInfo
}) => {
  return (
    <section className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 pt-5 sm:pt-8 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 px-1">
        <h2
          className="text-xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2"
          style={{ color: "var(--text-heading)" }}
        >
          {selectedLang === "ur" ? "ہوم / صفحہ اول" : selectedLang === "ta" ? "முகப்பு (Home)" : "Home"}
        </h2>
        <span
          className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full border font-semibold shadow-sm flex items-center gap-1 sm:gap-1.5 flex-shrink-0"
          style={{
            background: "var(--event-circle-bg)",
            borderColor: "var(--event-border)",
            color: "var(--gold-bright)"
          }}
        >
          <span>
            {selectedLang === "ur"
              ? `${duasCount} دعائیں`
              : selectedLang === "ta"
              ? `${duasCount} துஆக்கள்`
              : `${duasCount} Duas`}
          </span>
          {downloadedCount > 0 && (
            <span className="text-[#10b981] font-semibold flex items-center gap-1">
              •{" "}
              {selectedLang === "ur" ? (
                <>
                  <span className="hidden sm:inline">{downloadedCount} آف لائن</span>
                  <span className="sm:hidden">{downloadedCount} 💾</span>
                </>
              ) : selectedLang === "ta" ? (
                <>
                  <span className="hidden sm:inline">{downloadedCount} ஆஃப்லைன்</span>
                  <span className="sm:hidden">{downloadedCount} 💾</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">{downloadedCount} Offline Ready</span>
                  <span className="sm:hidden">{downloadedCount} Offline</span>
                </>
              )}
            </span>
          )}
        </span>
      </div>

      {/* Stack of Main Event Cards */}
      <div className="space-y-3.5 sm:space-y-4">
        {/* Card 1: Online Duas (Hajj & Umrah) */}
        <div
          onClick={onNavigateToDuas}
          className="glass-card group relative rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl active:scale-[0.99] border select-none"
          style={{
            background: "var(--event-card-bg)",
            borderColor: "var(--event-border)"
          }}
        >
          {/* Center Content */}
          <div className="text-center pr-12 pl-4 sm:px-14">
            <h3
              className="text-base sm:text-lg font-bold tracking-wide transition-colors"
              style={{ color: "var(--event-text)" }}
            >
              {selectedLang === "ur"
                ? "آن لائن دعائیں (حج و عمرہ)"
                : selectedLang === "ta"
                ? "ஆன்லைன் துஆக்கள் (Hajj & Umrah)"
                : "Online Duas (Hajj & Umrah Translation)"}
            </h3>
            <p
              dir={selectedLang === "ur" ? "rtl" : "ltr"}
              className={`${
                selectedLang === "ur"
                  ? "font-urdu text-xl sm:text-2xl"
                  : selectedLang === "ta"
                  ? "font-sans text-sm sm:text-base font-semibold"
                  : "font-sans text-xs sm:text-sm font-medium"
              } mt-1.5 sm:mt-2 leading-relaxed tracking-wide`}
              style={{ color: "var(--event-text-sub)" }}
            >
              {selectedLang === "ur"
                ? "(Online • حج اور عمرہ کی دعائیں)"
                : selectedLang === "ta"
                ? "(முழுமையான ஆன்லைன் துஆக்கள் - Online)"
                : "(Authentic Supplications • Online)"}
            </p>
          </div>

          {/* (i) Info Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenEventInfo({
                title: "Online Duas (Hajj & Umrah)",
                subtitle:
                  selectedLang === "ur"
                    ? "(Online • حج اور عمرہ کی دعائیں)"
                    : selectedLang === "ta"
                    ? "(முழுமையான ஆன்லைன் துஆக்கள் - Online)"
                    : "(Authentic Supplications • Online)",
                details:
                  "Complete authentic supplications for pilgrims embarking on Hajj & Umrah, accessible online with fast search, Arabic text, and clear translations.",
                points: [
                  "Comprehensive Quran & Sunnah supplications collection",
                  "Authentic Hadith & Quranic sources verified with chapter & verse",
                  "English, Tamil & Urdu transliterations and clear translations",
                  "Instant search across Arabic, English, and Tamil keywords"
                ],
                actionLabel: "Explore Online Duas",
                onAction: onNavigateToDuas
              });
            }}
            className="absolute right-3.5 sm:right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm"
            style={{
              background: "var(--event-circle-bg)",
              borderColor: "var(--event-border)",
              color: "var(--gold-bright)"
            }}
            title="More Information"
            aria-label="More Information"
          >
            <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>

        {/* Card 2: Offline Duas (Audio Downloads & Recitation) */}
        <div
          onClick={onNavigateToRecitation}
          className="glass-card group relative rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl active:scale-[0.99] border select-none"
          style={{
            background: "var(--event-card-bg)",
            borderColor: "var(--event-border)"
          }}
        >
          {/* Center Content */}
          <div className="text-center pr-12 pl-4 sm:px-14">
            <div
              className="inline-flex items-center gap-1.5 mb-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                background: "rgba(16,185,129,0.18)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.35)"
              }}
            >
              <Download className="w-3 h-3" />
              <span>Offline Audio Downloads</span>
              {downloadedCount > 0 && <span>• {downloadedCount} Saved</span>}
            </div>

            <h3
              className="text-base sm:text-lg font-bold tracking-wide transition-colors"
              style={{ color: "var(--event-text)" }}
            >
              {selectedLang === "ur"
                ? "آف لائن دعائیں (آڈیو ڈاؤنلوڈز و تلاوت)"
                : selectedLang === "ta"
                ? "ஆஃப்லைன் துஆக்கள் (ஆடியோ பதிவிறக்கங்கள்)"
                : "Offline Duas (Audio Downloads & Recitation)"}
            </h3>
            <p
              dir={selectedLang === "ur" ? "rtl" : "ltr"}
              className={`${
                selectedLang === "ur"
                  ? "font-urdu text-xl sm:text-2xl"
                  : selectedLang === "ta"
                  ? "font-sans text-sm sm:text-base font-semibold"
                  : "font-sans text-xs sm:text-sm font-medium"
              } mt-1.5 sm:mt-2 leading-relaxed tracking-wide`}
              style={{ color: "var(--event-text-sub)" }}
            >
              {selectedLang === "ur"
                ? "(Offline • عربی آڈیو ڈاؤنلوڈز • بغیر انٹرنیٹ سنیں)"
                : selectedLang === "ta"
                ? "(முழுமையான ஆஃப்லைன் ஆடியோ - Offline)"
                : "(Zero Internet Required • Device Storage Offline)"}
            </p>
          </div>

          {/* (i) Info Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenEventInfo({
                title: "Offline Duas (Audio Downloads & Recitation)",
                subtitle:
                  selectedLang === "ur"
                    ? "(Offline • عربی آڈیو ڈاؤنلوڈز • بغیر انٹرنیٹ سنیں)"
                    : selectedLang === "ta"
                    ? "(முழுமையான ஆஃப்லைன் ஆடியோ - Offline)"
                    : "(Offline Audio Recitations)",
                details:
                  "Download sacred audio recitations directly into your device storage. Guaranteed to play without any Wi-Fi or cellular network during pilgrimage.",
                points: [
                  "One-click 'Download All' for complete offline pilgrimage preparation",
                  "Individual track download buttons on every Dua card",
                  "Storage management: see exact MB used and clear downloads anytime",
                  "High-definition crystal clear Arabic vocal recitation"
                ],
                actionLabel: "Open Downloads Section",
                onAction: onNavigateToRecitation
              });
            }}
            className="absolute right-3.5 sm:right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm"
            style={{
              background: "var(--event-circle-bg)",
              borderColor: "var(--event-border)",
              color: "var(--gold-bright)"
            }}
            title="More Information"
            aria-label="More Information"
          >
            <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>

      {/* 2-Column Action Grid: Favorite Duas & Dua Bookmarks */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 mt-3.5 sm:mt-4">
        {/* Action 1: Favorite Duas (Heart Icon) */}
        <button
          onClick={onNavigateToFavorites}
          className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 border group select-none"
          style={{
            background: "var(--event-card-bg)",
            borderColor: "var(--event-border)"
          }}
        >
          <div
            className="w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2 sm:mb-2.5 shadow-inner transition-transform group-hover:scale-105"
            style={{
              background: "var(--event-circle-bg)",
              color: bookmarksCount > 0 ? "#ef4444" : "var(--gold-bright)",
              border: "1px solid var(--event-border)"
            }}
          >
            <Heart className={`w-6 h-6 sm:w-7 sm:h-7 ${bookmarksCount > 0 ? "fill-current text-red-500" : ""}`} />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-wide" style={{ color: "var(--event-text)" }}>
            {selectedLang === "ur" ? "پسندیدہ دعائیں" : selectedLang === "ta" ? "விருப்பமானவை" : "Favorite Duas"}
          </span>
          <span className="text-[10px] sm:text-xs mt-0.5 font-medium" style={{ color: "var(--event-text-sub)" }}>
            {bookmarksCount} saved
          </span>
        </button>

        {/* Action 2: Dua Bookmarks (Bookmark Icon) */}
        <button
          onClick={onNavigateToPlaylists}
          className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 border group select-none"
          style={{
            background: "var(--event-card-bg)",
            borderColor: "var(--event-border)"
          }}
        >
          <div
            className="w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2 sm:mb-2.5 shadow-inner transition-transform group-hover:scale-105"
            style={{
              background: "var(--event-circle-bg)",
              color: playlistsCount > 0 ? "var(--teal-bright)" : "var(--gold-bright)",
              border: "1px solid var(--event-border)"
            }}
          >
            <Bookmark className={`w-6 h-6 sm:w-7 sm:h-7 ${playlistsCount > 0 ? "fill-current text-[#14c4bb]" : ""}`} />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-wide" style={{ color: "var(--event-text)" }}>
            {selectedLang === "ur" ? "دعا بک مارکس" : selectedLang === "ta" ? "புக்மார்க்குகள்" : "Dua Bookmarks"}
          </span>
          <span className="text-[10px] sm:text-xs mt-0.5 font-medium" style={{ color: "var(--event-text-sub)" }}>
            {playlistsCount} {playlistsCount === 1 ? "playlist" : "playlists"}
          </span>
        </button>
      </div>
    </section>
  );
};
