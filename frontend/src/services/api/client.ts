export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
export class OfflineError extends Error { constructor() { super("You are offline"); } }
export const SESSION_EXPIRED = "noor:session-expired";
export function getDeviceId(): string {
  let id = localStorage.getItem("noor:device-id");
  if (!id) {
    id = "dev_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
    localStorage.setItem("noor:device-id", id);
  }
  return id;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  const deviceId = typeof window !== "undefined" ? getDeviceId() : "unknown";
  try {
    res = await fetch(`/api${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-device-id": deviceId,
        ...init.headers
      }
    });
  }
  catch { throw new OfflineError(); } // network failure, not a server error
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (res.status === 401 && !path.startsWith("/auth/login")) dispatchEvent(new Event(SESSION_EXPIRED)); // UI prompts re-login; local data is untouched
  if (!res.ok) throw new ApiError(res.status, body?.error?.message ?? "Request failed");
  return body.data as T;
}
