import { z } from "zod";
try { process.loadEnvFile(); } catch {}
try { process.loadEnvFile(new URL("../../.env", import.meta.url)); } catch {}
const schema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required. Please provide a MongoDB connection string in Render Environment variables."),
  CORS_ORIGIN: z.string().default("*"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters."),
  COOKIE_SECURE: z.coerce.boolean().default(false),
  AUDIO_DIR: z.string().default("./storage/audio"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("\n❌ Environment configuration error:");
  for (const issue of parsed.error.issues) {
    console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
  }
  console.error("\nPlease add these variables in your Render Dashboard (Settings > Environment).\n");
  process.exit(1);
}

export const env = parsed.data;
