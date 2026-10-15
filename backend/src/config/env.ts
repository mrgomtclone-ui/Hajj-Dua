import { z } from "zod";
try { process.loadEnvFile(); } catch {}
try { process.loadEnvFile(new URL("../../.env", import.meta.url)); } catch {}
const schema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().min(1),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(32), COOKIE_SECURE: z.coerce.boolean().default(false),
  AUDIO_DIR: z.string().default("./storage/audio"),
});
export const env = schema.parse(process.env); // fails fast; secrets never reach the client
