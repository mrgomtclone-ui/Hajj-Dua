import { StrictMode } from "react"; import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createDexieStore } from "./services/playlists/dexieStore"; import { PlaylistRepo } from "./services/playlists/playlistRepo";
import { SyncService } from "./services/sync/sync"; import { AudioPlayer } from "./services/audio/player"; import { offlineResolver } from "./services/offline/downloads";
import { SESSION_EXPIRED } from "./services/api/client";
const qc = new QueryClient({ defaultOptions: { queries: { networkMode: "offlineFirst", staleTime: 60_000, retry: 1 } } });
const store = await createDexieStore();
export const repo = new PlaylistRepo(store), sync = new SyncService(repo), player = new AudioPlayer(offlineResolver);
sync.start();
addEventListener(SESSION_EXPIRED, () => console.info("Session expired: show sign-in prompt; local data is kept"));
if ("serviceWorker" in navigator) {
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      for (const r of regs) r.unregister();
    });
  } else {
    navigator.serviceWorker.register("/service-worker.js").catch(err => console.warn("SW error:", err));
  }
}
import "./index.css";
import App from "./app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
