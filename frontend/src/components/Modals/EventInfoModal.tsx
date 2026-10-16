import React from "react";
import { X } from "lucide-react";
import type { EventInfo } from "../../types";

export interface EventInfoModalProps {
  eventInfo: EventInfo | null;
  onClose: () => void;
}

export const EventInfoModal: React.FC<EventInfoModalProps> = ({ eventInfo, onClose }) => {
  if (!eventInfo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl glass-dropdown p-6 shadow-2xl relative border"
        style={{ borderColor: "var(--border-gold-md)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl border hover:opacity-80 transition"
          style={{ background: "var(--bg-input)", borderColor: "var(--border-gold)", color: "var(--text-muted)" }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase"
            style={{ background: "rgba(212,175,55,0.15)", color: "var(--gold-bright)" }}
          >
            Feature Details
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold pr-6" style={{ color: "var(--text-heading)" }}>
          {eventInfo.title}
        </h3>
        {eventInfo.subtitle && (
          <p dir="rtl" className="font-urdu text-lg sm:text-xl mt-1 leading-relaxed" style={{ color: "var(--gold-light)" }}>
            {eventInfo.subtitle}
          </p>
        )}

        <p className="text-xs sm:text-sm mt-3 leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {eventInfo.details}
        </p>

        <ul className="mt-4 space-y-2">
          {eventInfo.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
              <span className="text-[#14c4bb] font-bold">✓</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-[rgba(212,175,55,0.15)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border transition"
            style={{ background: "var(--bg-input)", borderColor: "var(--border-gold)", color: "var(--text-muted)" }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={eventInfo.onAction}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold transition shadow-md"
          >
            {eventInfo.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
