import React from "react";
import { X } from "lucide-react";
import type { DuaItem, Playlist } from "../../types";

export interface PlaylistSelectorModalProps {
  dua: DuaItem | null;
  playlists: Playlist[];
  newPlaylistTitle: string;
  setNewPlaylistTitle: (v: string) => void;
  onClose: () => void;
  onAddToPlaylist: (playlistId: string) => void;
  onCreateAndAdd: (e: React.FormEvent) => void;
}

export const PlaylistSelectorModal: React.FC<PlaylistSelectorModalProps> = ({
  dua,
  playlists,
  newPlaylistTitle,
  setNewPlaylistTitle,
  onClose,
  onAddToPlaylist,
  onCreateAndAdd
}) => {
  if (!dua) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl glass-dropdown p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid var(--border-gold)" }}>
          <h3 className="font-bold text-base" style={{ color: "var(--gold-light)" }}>
            Add to Playlist
          </h3>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }} className="hover:opacity-80">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs mt-2 truncate" style={{ color: "var(--text-muted)" }}>
          Adding: <strong style={{ color: "var(--gold-bright)" }}>{dua.title}</strong>
        </p>

        {/* Existing Playlists list */}
        <div className="mt-4 max-h-48 overflow-y-auto space-y-2">
          {playlists.length === 0 ? (
            <p className="text-xs py-2 text-center" style={{ color: "var(--text-muted)" }}>
              No existing playlists.
            </p>
          ) : (
            playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => onAddToPlaylist(pl.id)}
                className="w-full text-left p-2.5 rounded-xl flex items-center justify-between group transition"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border-gold)" }}
              >
                <span className="text-sm font-semibold transition" style={{ color: "var(--text-primary)" }}>
                  {pl.title}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {pl.duaIds.length} Duas
                </span>
              </button>
            ))
          )}
        </div>

        {/* Create new playlist inside modal */}
        <form onSubmit={onCreateAndAdd} className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border-gold)" }}>
          <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-muted)" }}>
            Or create new playlist
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Day 1: Mina & Arafat"
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              className="flex-1 islamic-input text-sm px-3 py-2 rounded-xl"
            />
            <button type="submit" className="btn-teal px-4 py-2 rounded-xl font-bold text-xs transition">
              Create & Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPlaylistTitle: string;
  setNewPlaylistTitle: (v: string) => void;
  onCreate: (e: React.FormEvent) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  newPlaylistTitle,
  setNewPlaylistTitle,
  onCreate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl glass-dropdown p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid var(--border-gold)" }}>
          <h3 className="font-bold text-base" style={{ color: "var(--gold-light)" }}>
            New Playlist
          </h3>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }} className="hover:opacity-80">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            onCreate(e);
            onClose();
          }}
          className="mt-4"
        >
          <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-muted)" }}>
            Playlist Name
          </label>
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
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold transition"
              style={{ color: "var(--text-muted)" }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-teal px-4 py-2 rounded-xl font-bold text-xs transition">
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
