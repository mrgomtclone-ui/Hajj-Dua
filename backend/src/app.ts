import express from "express"; import helmet from "helmet"; import cors from "cors"; import morgan from "morgan"; import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
import { auth, authRouter } from "./routes/auth.js"; import { api } from "./routes/index.js"; import { errorHandler } from "./utils/http.js"; import { env } from "./config/env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, "../../frontend/dist");

export const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" }, contentSecurityPolicy: false }));
app.use(cors({ origin: env.CORS_ORIGIN.split(","), credentials: true, allowedHeaders: ["Content-Type", "x-device-id", "Range"] }));
app.use(express.json({ limit: "256kb" })); app.use(morgan("tiny"));
app.use(cookieParser());
app.use("/api/auth", rateLimit({ windowMs: 15 * 60_000, limit: 30 }), authRouter); // strict limit on credential endpoints
app.use("/api", rateLimit({ windowMs: 60_000, limit: 300 }), auth, api);

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use(errorHandler);

