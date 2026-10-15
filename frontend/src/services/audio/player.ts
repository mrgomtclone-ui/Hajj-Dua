import type { Lang, PlayerState, QueueItem, RepeatMode, TrackRef } from "../../types";
// Phase 4 swaps this resolver to return a local Blob URL when the track is downloaded.
export type UrlResolver = (t: TrackRef) => Promise<{ url: string; revoke?: () => void }>;
const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export class AudioPlayer {
  private el = new Audio(); private subs = new Set<(s: PlayerState) => void>();
  private revoke?: () => void; private order: number[] = []; private token = 0;
  state: PlayerState = { queue: [], index: -1, lang: "ar", playing: false, loading: false, currentTime: 0, duration: 0, speed: 1, repeat: "off", shuffle: false, error: null };
  constructor(private resolve: UrlResolver = async t => ({ url: t.url })) {
    const e = this.el; e.preload = "metadata";
    e.ontimeupdate = () => this.set({ currentTime: e.currentTime });
    e.ondurationchange = () => isFinite(e.duration) && this.set({ duration: e.duration });
    e.onplaying = () => this.set({ playing: true, loading: false, error: null });
    e.onpause = () => this.set({ playing: false });
    e.onwaiting = () => this.set({ loading: true });
    e.onerror = () => this.set({ playing: false, loading: false, error: navigator.onLine ? "This audio could not be played." : "You are offline. Download this audio to play it without a connection." });
    e.onended = () => this.advance(true);
    this.setupMediaSession();
  }
  subscribe(fn: (s: PlayerState) => void) { this.subs.add(fn); fn(this.state); return () => this.subs.delete(fn); }
  private set(p: Partial<PlayerState>) { this.state = { ...this.state, ...p }; this.subs.forEach(f => f(this.state)); }

  get current(): QueueItem | undefined { return this.state.queue[this.state.index]; }
  async playQueue(queue: QueueItem[], start = 0) { this.set({ queue }); this.rebuildOrder(start); await this.load(start); }
  async load(index: number) {
    const item = this.state.queue[index]; if (!item) return;
    const track = this.pick(item); const my = ++this.token;
    this.set({ index, currentTime: 0, duration: track?.duration ?? 0 });
    if (!track) { this.set({ playing: false, error: `No audio available for "${item.title}".` }); return; } // never assume all 4 tracks exist
    this.set({ loading: true, error: null });
    try {
      const r = await this.resolve(track); if (my !== this.token) return r.revoke?.();
      this.revoke?.(); this.revoke = r.revoke; this.el.src = r.url; this.el.playbackRate = this.state.speed;
      await this.el.play(); this.updateMeta(item);
    } catch { if (my === this.token) this.set({ loading: false, playing: false, error: "Playback was blocked or the file is unavailable." }); }
  }
  // Chosen language first, then Arabic, so a missing track degrades gracefully (UI should show which language is playing)
  private pick(i: QueueItem) { return i.tracks[this.state.lang] ?? i.tracks.ar; }
  hasLang(l: Lang) { return !!this.current?.tracks[l]; }

  play() { return this.el.play(); } pause() { this.el.pause(); }
  toggle() { return this.state.playing ? this.pause() : this.play(); }
  seek(sec: number) { this.el.currentTime = Math.max(0, Math.min(sec, this.state.duration || sec)); }
  setSpeed(s: number) { if (!SPEEDS.includes(s)) return; this.el.playbackRate = s; this.set({ speed: s }); }
  setRepeat(r: RepeatMode) { this.set({ repeat: r }); }
  toggleShuffle() { this.set({ shuffle: !this.state.shuffle }); this.rebuildOrder(this.state.index); }
  async setLang(l: Lang) { // keep the same dua and resume near the same position
    const t = this.el.currentTime, was = this.state.playing; this.set({ lang: l });
    if (this.state.index >= 0) { await this.load(this.state.index); if (this.current?.tracks[l]) { this.seek(t); if (!was) this.pause(); } }
  }
  next() { return this.advance(false); } prev() {
    if (this.el.currentTime > 3) return this.seek(0);
    const pos = this.order.indexOf(this.state.index); const p = pos > 0 ? pos - 1 : this.state.repeat === "all" ? this.order.length - 1 : -1;
    if (p >= 0) return this.load(this.order[p]); this.seek(0);
  }
  private async advance(auto: boolean) {
    if (auto && this.state.repeat === "one") { this.seek(0); return void this.el.play(); }
    const pos = this.order.indexOf(this.state.index);
    if (pos < this.order.length - 1) return this.load(this.order[pos + 1]);
    if (this.state.repeat === "all" && this.order.length) return this.load(this.order[0]);
    this.set({ playing: false }); // end of queue
  }
  // Queue management
  enqueue(item: QueueItem) { this.set({ queue: [...this.state.queue, item] }); this.rebuildOrder(this.state.index); }
  removeAt(i: number) {
    const q = this.state.queue.filter((_, k) => k !== i); let idx = this.state.index;
    if (i < idx) idx--; else if (i === idx) { this.pause(); idx = Math.min(idx, q.length - 1); }
    this.set({ queue: q, index: idx }); this.rebuildOrder(idx);
  }
  move(from: number, to: number) {
    const q = [...this.state.queue]; const [m] = q.splice(from, 1); q.splice(to, 0, m);
    const cur = this.current; this.set({ queue: q, index: cur ? q.indexOf(cur) : -1 }); this.rebuildOrder(this.state.index);
  }
  private rebuildOrder(first: number) {
    const idx = this.state.queue.map((_, i) => i);
    if (!this.state.shuffle) { this.order = idx; return; }
    const rest = idx.filter(i => i !== first).sort(() => Math.random() - 0.5); this.order = first >= 0 ? [first, ...rest] : rest;
  }
  private updateMeta(item: QueueItem) {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: item.title, artist: "Noor", album: this.state.lang.toUpperCase() });
  }
  private setupMediaSession() {
    if (!("mediaSession" in navigator)) return; const m = navigator.mediaSession;
    m.setActionHandler("play", () => this.play()); m.setActionHandler("pause", () => this.pause());
    m.setActionHandler("previoustrack", () => this.prev()); m.setActionHandler("nexttrack", () => this.next());
    m.setActionHandler("seekto", d => d.seekTime != null && this.seek(d.seekTime));
  }
}
