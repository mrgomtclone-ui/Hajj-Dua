import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError } from "zod";
export const ok = (res: Response, data: unknown, meta?: object) => res.json({ ok: true, data, meta });
export const wrap = (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler => (req, res, next) => fn(req, res).catch(next);
export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
export const owner = (req: Request) => {
  const id = ((req as any).userId as string | undefined) || (req.headers["x-device-id"] as string | undefined);
  if (!id) throw new HttpError(401, "Sign in required");
  return id;
};
export function errorHandler(e: unknown, _q: Request, res: Response, _n: NextFunction) {
  if (e instanceof ZodError) return res.status(400).json({ ok: false, error: { code: "VALIDATION", issues: e.issues } });
  if (e instanceof HttpError) return res.status(e.status).json({ ok: false, error: { code: "HTTP", message: e.message } });
  console.error(e); res.status(500).json({ ok: false, error: { code: "INTERNAL", message: "Something went wrong" } });
}
