import React from "react";
import { X, LogIn } from "lucide-react";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  authEmail: string;
  setAuthEmail: (v: string) => void;
  authPassword: string;
  setAuthPassword: (v: string) => void;
  authName: string;
  setAuthName: (v: string) => void;
  authLoading: boolean;
  authError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authName,
  setAuthName,
  authLoading,
  authError,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-sm rounded-2xl glass-dropdown p-6 shadow-2xl relative border"
        style={{ borderColor: "var(--border-gold)" }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 hover:opacity-80 transition"
          style={{ color: "var(--text-muted)" }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(212,175,55,0.14)",
              border: "1px solid var(--border-gold)",
              color: "var(--gold-bright)"
            }}
          >
            <LogIn className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: "var(--text-heading)" }}>
              {authMode === "login" ? "Sign In to Haj Duas" : "Create Pilgrim Account"}
            </h3>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Sync favorites & playlists across your mobile devices
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl p-1 mb-4" style={{ background: "var(--bg-input)" }}>
          <button
            type="button"
            onClick={() => setAuthMode("login")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              authMode === "login"
                ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow"
                : ""
            }`}
            style={authMode !== "login" ? { color: "var(--text-muted)" } : undefined}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("register")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              authMode === "register"
                ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow"
                : ""
            }`}
            style={authMode !== "register" ? { color: "var(--text-muted)" } : undefined}
          >
            Register
          </button>
        </div>

        {authError && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
            {authError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          {authMode === "register" && (
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-muted)" }}>
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Pilgrim"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                className="w-full islamic-input text-sm px-3.5 py-2 rounded-xl"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-muted)" }}>
              Email Address
            </label>
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
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-muted)" }}>
              Password (8+ chars)
            </label>
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
  );
};
