import express from "express"; import helmet from "helmet"; import cors from "cors"; import morgan from "morgan"; import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser"; import { auth, authRouter } from "./routes/auth.js"; import { api } from "./routes/index.js"; import { errorHandler } from "./utils/http.js"; import { env } from "./config/env.js";
export const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.CORS_ORIGIN.split(","), credentials: true, allowedHeaders: ["Content-Type", "x-device-id", "Range"] }));
app.use(express.json({ limit: "256kb" })); app.use(morgan("tiny"));
app.use(cookieParser());
app.use("/api/auth", rateLimit({ windowMs: 15 * 60_000, limit: 30 }), authRouter); // strict limit on credential endpoints
app.use("/api", rateLimit({ windowMs: 60_000, limit: 300 }), auth, api);
app.use(errorHandler);
