const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number }
  | { allowed: false; unavailable: true };

const FIXED_WINDOW_SCRIPT = [
  "local count = redis.call('INCR', KEYS[1])",
  "if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end",
  "local ttl = redis.call('PTTL', KEYS[1])",
  "if count > tonumber(ARGV[2]) then return {0, ttl, count} end",
  "return {1, ttl, count}",
].join("\n");

function getTrustedClientIp(request: Request): string | null {
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cloudflareIp) return cloudflareIp;

  const proxyIp = request.headers.get("x-real-ip")?.trim();
  return proxyIp || null;
}

async function hashIp(ip: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(ip));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Uses an atomic Redis fixed-window counter through Upstash REST.
 * In production, missing or failing Redis configuration fails closed.
 * Local development can run without Redis to keep setup straightforward.
 */
export async function enforcePublicAskRateLimit(request: Request): Promise<RateLimitResult> {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!baseUrl || !token) {
    return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
      ? { allowed: true, remaining: MAX_REQUESTS }
      : { allowed: false, unavailable: true };
  }

  const ip = getTrustedClientIp(request);
  if (!ip) return { allowed: false, unavailable: true };

  try {
    const ipHash = await hashIp(ip, token);
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        FIXED_WINDOW_SCRIPT,
        "1",
        `isabella:public-ask:${ipHash}`,
        String(WINDOW_MS),
        String(MAX_REQUESTS),
      ]),
      signal: request.signal,
    });

    if (!response.ok) return { allowed: false, unavailable: true };

    const payload: unknown = await response.json();
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("result" in payload) ||
      !Array.isArray(payload.result) ||
      typeof payload.result[0] !== "number" ||
      typeof payload.result[1] !== "number" ||
      typeof payload.result[2] !== "number"
    ) {
      return { allowed: false, unavailable: true };
    }

    const [allowed, ttl, count] = payload.result;
    if (allowed !== 1) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil(ttl / 1000)),
      };
    }

    return { allowed: true, remaining: Math.max(0, MAX_REQUESTS - count) };
  } catch {
    return { allowed: false, unavailable: true };
  }
}
