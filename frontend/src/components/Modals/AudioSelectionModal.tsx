import React, { useState, useEffect } from "react";
import { X, Check, Volume2, BookOpen, Sparkles } from "lucide-react";
import type { AudioSelectionConfig, TranslationLang } from "../../types";

export interface AudioSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AudioSelectionConfig;
  onSaveConfig: (newConfig: AudioSelectionConfig) => void;
  selectedLang: TranslationLang;
  onSelectLang: (lang: TranslationLang) => void;
}

function getLangLabel(lang: TranslationLang): string {
  switch (lang) {
    case "ur":
      return "Urdu";
    case "ta":
      return "Tamil";
    case "en":
    default:
      return "English";
  }
}

export const AudioSelectionModal: React.FC<AudioSelectionModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  selectedLang,
  onSelectLang
}) => {
  const [tempConfig, setTempConfig] = useState<AudioSelectionConfig>(config);

  // Sync internal state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setTempConfig(config);
    }
  }, [isOpen, config]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleArabic = () => {
    setTempConfig((prev) => {
      const nextArabic = !prev.playArabic;
      const nextTranslation = prev.playTranslation;
      const nextOnlyRead = !nextArabic && !nextTranslation;
      return {
        playArabic: nextArabic,
        playTranslation: nextTranslation,
        onlyRead: nextOnlyRead
      };
    });
  };

  const toggleTranslation = () => {
    setTempConfig((prev) => {
      const nextArabic = prev.playArabic;
      const nextTranslation = !prev.playTranslation;
      const nextOnlyRead = !nextArabic && !nextTranslation;
      return {
        playArabic: nextArabic,
        playTranslation: nextTranslation,
        onlyRead: nextOnlyRead
      };
    });
  };

  const toggleOnlyRead = () => {
    setTempConfig((prev) => {
      const nextOnlyRead = !prev.onlyRead;
      if (nextOnlyRead) {
        return {
          playArabic: false,
          playTranslation: false,
          onlyRead: true
        };
      } else {
        return {
          playArabic: true,
          playTranslation: true,
          onlyRead: false
        };
      }
    });
  };

  const handleConfirm = () => {
    onSaveConfig(tempConfig);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-3xl glass-dropdown p-5 sm:p-6 shadow-2xl select-none transform transition-all border"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderColor: "var(--border-gold-md)",
          boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.7), 0 0 35px -5px rgba(212, 175, 55, 0.15)"
        }}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-xl border flex items-center justify-center transition active:scale-95"
          style={{
            background: "var(--bg-input)",
            borderColor: "var(--border-gold)",
            color: "var(--text-muted)"
          }}
          title="Close"
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-bright)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Header Badge & Title */}
        <div className="flex items-center gap-1.5 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(212,175,55,0.14)",
              border: "1px solid var(--border-gold)",
              color: "var(--gold-bright)"
            }}
          >
            <Volume2 className="w-4 h-4" />
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(212,175,55,0.12)",
              color: "var(--gold-bright)",
              border: "1px solid var(--border-gold)"
            }}
          >
            Audio Preferences
          </span>
        </div>

        <h2
          className="text-lg sm:text-xl font-bold tracking-wide mt-2"
          style={{
            color: "var(--text-heading)",
            fontFamily: '"Cinzel", Georgia, serif'
          }}
        >
          Audio Selection
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Choose vocal recitation and language voiceover
        </p>

        {/* Divider */}
        <div
          className="my-3.5 border-b"
          style={{ borderColor: "var(--border-gold)" }}
        />

        {/* Options List */}
        <div className="space-y-2.5">
          {/* Option 1: Arabic Recitation */}
          <div
            onClick={toggleArabic}
            className="p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
            style={{
              background: tempConfig.playArabic ? "rgba(212,175,55,0.10)" : "var(--bg-input)",
              borderColor: tempConfig.playArabic ? "var(--border-gold-hi)" : "var(--border-gold)"
            }}
          >
            <div className="min-w-0">
              <div
                className="font-bold text-sm sm:text-base leading-tight transition"
                style={{
                  color: tempConfig.playArabic ? "var(--gold-light)" : "var(--text-primary)"
                }}
              >
                Arabic Recitation
              </div>
              <div className="text-[11px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>
                عربی تلاوت • Mishary Alafasy
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                tempConfig.playArabic
                  ? "btn-gold border-transparent shadow-md text-slate-950"
                  : "bg-transparent"
              }`}
              style={
                !tempConfig.playArabic
                  ? { borderColor: "var(--border-gold-md)" }
                  : undefined
              }
            >
              {tempConfig.playArabic && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>

          {/* Option 2: [Language] Translation */}
          <div
            onClick={toggleTranslation}
            className="p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
            style={{
              background: tempConfig.playTranslation ? "rgba(212,175,55,0.10)" : "var(--bg-input)",
              borderColor: tempConfig.playTranslation ? "var(--border-gold-hi)" : "var(--border-gold)"
            }}
          >
            <div className="min-w-0">
              <div
                className="font-bold text-sm sm:text-base leading-tight transition"
                style={{
                  color: tempConfig.playTranslation ? "var(--gold-light)" : "var(--text-primary)"
                }}
              >
                {getLangLabel(selectedLang)} Translation
              </div>
              <div className="text-[11px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>
                {selectedLang === "ur" ? "اردو ترجمہ" : selectedLang === "ta" ? "தமிழ் விளக்கம்" : "English Meaning Voice"}
              </div>

              {/* Language Pills */}
              <div
                className="flex items-center gap-1.5 mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                {(["en", "ta", "ur"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onSelectLang(l)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase transition ${
                      selectedLang === l
                        ? "bg-gradient-to-r from-[#d4af37] to-[#aa8010] text-slate-950 shadow-sm"
                        : "border hover:opacity-100"
                    }`}
                    style={
                      selectedLang !== l
                        ? {
                            background: "var(--bg-card)",
                            borderColor: "var(--border-gold)",
                            color: "var(--text-muted)"
                          }
                        : undefined
                    }
                  >
                    {l === "en" ? "English" : l === "ta" ? "Tamil" : "Urdu"}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                tempConfig.playTranslation
                  ? "btn-gold border-transparent shadow-md text-slate-950"
                  : "bg-transparent"
              }`}
              style={
                !tempConfig.playTranslation
                  ? { borderColor: "var(--border-gold-md)" }
                  : undefined
              }
            >
              {tempConfig.playTranslation && (
                <Check className="w-4 h-4 stroke-[3]" />
              )}
            </div>
          </div>

          {/* Option 3: Only Read */}
          <div
            onClick={toggleOnlyRead}
            className="p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
            style={{
              background: tempConfig.onlyRead ? "rgba(20,196,187,0.12)" : "var(--bg-input)",
              borderColor: tempConfig.onlyRead ? "rgba(20,196,187,0.45)" : "var(--border-gold)"
            }}
          >
            <div className="min-w-0">
              <div
                className="font-bold text-sm sm:text-base leading-tight transition"
                style={{
                  color: tempConfig.onlyRead ? "var(--teal-bright)" : "var(--text-primary)"
                }}
              >
                Only Read
              </div>
              <div className="text-[11px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>
                Silent mode • Reading without audio
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                tempConfig.onlyRead
                  ? "bg-gradient-to-br from-[#14c4bb] to-[#0f9690] border-transparent shadow-md text-slate-950"
                  : "bg-transparent"
              }`}
              style={
                !tempConfig.onlyRead
                  ? { borderColor: "var(--border-gold-md)" }
                  : undefined
              }
            >
              {tempConfig.onlyRead && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div
          className="flex items-center justify-between pt-3.5 mt-3.5 border-t"
          style={{ borderColor: "var(--border-gold)" }}
        >
          <div className="text-[10px] sm:text-[11px]" style={{ color: "var(--text-muted)" }}>
            {tempConfig.onlyRead
              ? "📖 Silent reading"
              : tempConfig.playArabic && tempConfig.playTranslation
              ? "🕌 Recitation ➜ 🎙️ Meaning"
              : tempConfig.playArabic
              ? "🕌 Recitation only"
              : "🎙️ Meaning only"}
          </div>

          <button
            onClick={handleConfirm}
            className="btn-gold px-5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Confirm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
