import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distServer = path.join(__dirname, "dist", "server.js");

if (!fs.existsSync(distServer)) {
  console.error("dist/server.js not found. Please run 'npm run build' first or use 'npm run dev' to run TypeScript directly.");
  process.exit(1);
}

await import("./dist/server.js");
