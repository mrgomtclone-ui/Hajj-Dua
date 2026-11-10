import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import fs from "node:fs";
import path from "node:path";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ROOT_DIR = process.cwd();
const DUAS_DIR = path.resolve(ROOT_DIR, "frontend/public/Duas");
const MAP_FILE = path.resolve(ROOT_DIR, "backend/src/scripts/cloudinary-audio-map.json");
const FALLBACK_DUAS_PATH = path.resolve(ROOT_DIR, "frontend/src/data/fallbackDuas.ts");
const SEED_PATH = path.resolve(ROOT_DIR, "backend/src/seed/seed.ts");

// Load existing mapping if any
let urlMap: Record<string, string> = {};
if (fs.existsSync(MAP_FILE)) {
  try {
    urlMap = JSON.parse(fs.readFileSync(MAP_FILE, "utf-8"));
    console.log(`Loaded ${Object.keys(urlMap).length} existing mapped files.`);
  } catch (e) {
    console.warn("Could not read map file, starting fresh.");
  }
}

function saveMap() {
  fs.writeFileSync(MAP_FILE, JSON.stringify(urlMap, null, 2), "utf-8");
}

async function uploadFile(filename: string): Promise<string> {
  const localKey = `/Duas/${filename}`;
  if (urlMap[localKey]) {
    return urlMap[localKey];
  }

  const filePath = path.join(DUAS_DIR, filename);
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);

  // Cloudinary upload options for audio
  const res = await cloudinary.uploader.upload(filePath, {
    resource_type: "video",
    folder: "hajj-duas",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  });

  urlMap[localKey] = res.secure_url;
  saveMap();
  return res.secure_url;
}

// Concurrency pool helper
async function runPool<T>(items: T[], limit: number, iteratorFn: (item: T, idx: number) => Promise<void>) {
  const executing: Promise<void>[] = [];
  let idx = 0;
  for (const item of items) {
    const i = ++idx;
    const p = Promise.resolve().then(() => iteratorFn(item, i));
    executing.push(p);
    const clean = () => {
      const pos = executing.indexOf(p);
      if (pos >= 0) executing.splice(pos, 1);
    };
    p.then(clean).catch(clean);
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
}

async function main() {
  console.log("=== Step 1: Scanning Audio Files ===");
  if (!fs.existsSync(DUAS_DIR)) {
    console.error("Audio directory not found:", DUAS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(DUAS_DIR).filter(f => f.endsWith(".mp3") || f.endsWith(".ogg") || f.endsWith(".wav"));
  console.log(`Found ${files.length} audio files to process.`);

  console.log("\n=== Step 2: Uploading to Cloudinary (Concurrency: 4) ===");
  let completed = 0;
  await runPool(files, 4, async (file, currentIdx) => {
    try {
      const isAlreadyDone = Boolean(urlMap[`/Duas/${file}`]);
      const url = await uploadFile(file);
      completed++;
      if (isAlreadyDone) {
        console.log(`[${completed}/${files.length}] Already uploaded: ${file}`);
      } else {
        console.log(`[${completed}/${files.length}] Uploaded: ${file} -> ${url}`);
      }
    } catch (err: any) {
      console.error(`[FAILED] ${file}:`, err?.message || err);
      throw err;
    }
  });

  console.log(`\nAll ${Object.keys(urlMap).length} files are recorded in map.`);

  console.log("\n=== Step 3: Updating Code Files ===");
  // Update fallbackDuas.ts
  let fallbackContent = fs.readFileSync(FALLBACK_DUAS_PATH, "utf-8");
  let fallbackReplacements = 0;
  for (const [localPath, cloudUrl] of Object.entries(urlMap)) {
    const quoted = `"${localPath}"`;
    const newQuoted = `"${cloudUrl}"`;
    if (fallbackContent.includes(quoted)) {
      fallbackContent = fallbackContent.replaceAll(quoted, newQuoted);
      fallbackReplacements++;
    }
  }
  fs.writeFileSync(FALLBACK_DUAS_PATH, fallbackContent, "utf-8");
  console.log(`Updated fallbackDuas.ts with ${fallbackReplacements} Cloudinary URLs.`);

  // Update seed.ts
  let seedContent = fs.readFileSync(SEED_PATH, "utf-8");
  let seedReplacements = 0;
  for (const [localPath, cloudUrl] of Object.entries(urlMap)) {
    const quoted = `"${localPath}"`;
    const newQuoted = `"${cloudUrl}"`;
    if (seedContent.includes(quoted)) {
      seedContent = seedContent.replaceAll(quoted, newQuoted);
      seedReplacements++;
    }
  }
  fs.writeFileSync(SEED_PATH, seedContent, "utf-8");
  console.log(`Updated seed.ts with ${seedReplacements} Cloudinary URLs.`);

  console.log("\n=== Step 4: Verification ===");
  const checkFallback = fallbackContent.match(/"\/Duas\/[^"]+"/g);
  const checkSeed = seedContent.match(/"\/Duas\/[^"]+"/g);
  console.log(`Remaining /Duas/ paths in fallbackDuas.ts: ${checkFallback ? checkFallback.length : 0}`);
  console.log(`Remaining /Duas/ paths in seed.ts: ${checkSeed ? checkSeed.length : 0}`);

  console.log("\nMigration completed successfully! 🎉");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

