import { Router, type RequestHandler, type Response } from "express";
import bcrypt from "bcryptjs"; import jwt from "jsonwebtoken"; import { z } from "zod";
import { User } from "../models/index.js"; import { ok, wrap, HttpError } from "../utils/http.js"; import { env } from "../config/env.js";
const creds = z.object({ email: z.string().email(), password: z.string().min(8).max(128), name: z.string().max(60).optional() });
const COOKIE = "noor_session", DAYS = 14;
const issue = (res: Response, id: string) => res.cookie(COOKIE, jwt.sign({ sub: id }, env.JWT_SECRET, { expiresIn: `${DAYS}d` }),
  { httpOnly: true, sameSite: "lax", secure: env.COOKIE_SECURE, maxAge: DAYS * 864e5, path: "/" }); // token is unreadable by JS
// Non-blocking: sets req.userId when a valid cookie exists; routes that need a user call owner(), which returns 401.
export const auth: RequestHandler = (req, _res, next) => {
  const t = req.cookies?.[COOKIE]; if (t) { try { (req as any).userId = String((jwt.verify(t, env.JWT_SECRET) as any).sub); } catch { /* expired: treated as signed out */ } } next();
};
export const authRouter = Router();
authRouter.post("/register", wrap(async (req, res) => {
  const b = creds.parse(req.body);
  if (await User.exists({ email: b.email.toLowerCase() })) throw new HttpError(409, "An account with this email already exists");
  const u = await User.create({ email: b.email, name: b.name, passwordHash: await bcrypt.hash(b.password, 12) });
  issue(res, u.id); res.status(201); ok(res, { id: u.id, email: u.email, name: u.name });
}));
authRouter.post("/login", wrap(async (req, res) => {
  const b = creds.pick({ email: true, password: true }).parse(req.body); const u = await User.findOne({ email: b.email.toLowerCase() });
  if (!u || !(await bcrypt.compare(b.password, u.passwordHash))) throw new HttpError(401, "Email or password is incorrect"); // same message for both
  issue(res, u.id); ok(res, { id: u.id, email: u.email, name: u.name });
}));
authRouter.post("/logout", (_q, res) => { res.clearCookie(COOKIE, { path: "/" }); res.status(204).end(); });
authRouter.get("/me", auth, wrap(async (req, res) => {
  const id = (req as any).userId; const u = id && await User.findById(id).lean(); if (!u) throw new HttpError(401, "Not signed in");
  ok(res, { id: u._id, email: u.email, name: u.name, preferences: u.preferences });
}));
authRouter.put("/preferences", auth, wrap(async (req, res) => {
  const id = (req as any).userId; if (!id) throw new HttpError(401, "Not signed in");
  const prefs = z.record(z.unknown()).parse(req.body); await User.updateOne({ _id: id }, { preferences: prefs }); ok(res, prefs);
}));
