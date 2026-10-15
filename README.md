# HAJ DUA'S MOBILE APP (OFFLINE)

A dedicated, offline-first Hajj & Umrah supplications progressive web application with high-fidelity Arabic recitations, multi-language translations (English, Urdu, Tamil), playlists, and bookmark sync.

---

## Project Structure

```
Hajj/
├── frontend/             # Frontend React 18 + Vite + Tailwind CSS + Dexie PWA
│   ├── public/           # Static assets, manifest, and offline audio recitations
│   ├── src/              # App components, offline IndexedDB sync, audio engine
│   ├── index.html        # Mobile-optimized entry HTML with PWA tags
│   ├── package.json      # Frontend package configuration
│   └── vite.config.ts    # Vite configuration with /api backend proxy
│
├── backend/              # Backend Express + TypeScript + MongoDB + JWT Auth
│   ├── src/              # API routes, models, auth controllers, and seed data
│   ├── storage/          # Persistent audio storage
│   ├── .env              # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── package.json      # Backend package configuration
│   └── tsconfig.json     # Backend TypeScript configuration
│
├── package.json          # Root workspace scripts to control both apps
└── README.md
```

---

## How to Run

### 1. Run Both Together (Root Folder)
From the project root:
```bash
npm run dev
```
*(Runs both backend on port `4000` and frontend on port `5174`/`5173` simultaneously)*

### 2. Run Separately

#### Run Backend:
```bash
cd backend
npm run dev
```
*(or from root: `npm run backend`)*

#### Run Frontend:
```bash
cd frontend
npm run dev
```
*(or from root: `npm run frontend`)*

---

## Database & Seeding

1. Ensure MongoDB service is running locally (`mongodb://127.0.0.1:27017/noor`).
2. To seed or re-populate the Duas collection:
   ```bash
   npm run seed
   ```
   *(or `cd backend && npm run seed`)*

---

## Production Build

```bash
# Build both
npm run build

# Or individually
npm run build:frontend
npm run build:backend
```
