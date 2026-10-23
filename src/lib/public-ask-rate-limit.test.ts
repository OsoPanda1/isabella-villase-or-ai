import { afterEach, describe, expect, it, vi } from "vitest";
import { enforcePublicAskRateLimit } from "./public-ask-rate-limit";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("enforcePublicAskRateLimit", () => {
  it("fails closed in production when Redis is not configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");

    await expect(
      enforcePublicAskRateLimit(new Request("https://example.test/api/public/ask")),
    ).resolves.toEqual({ allowed: false, unavailable: true });
  });

  it("allows a request when the atomic Redis counter is under the limit", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.test");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ result: [1, 55_000, 1] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await enforcePublicAskRateLimit(
      new Request("https://example.test/api/public/ask", {
        headers: { "cf-connecting-ip": "203.0.113.7" },
      }),
    );

    expect(result).toEqual({ allowed: true, remaining: 9 });
    expect(fetchMock).toHaveBeenCalledOnce();
    const requestBody = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body)) as unknown[];
    expect(requestBody[0]).toBe("EVAL");
    expect(String(requestBody[3])).not.toContain("203.0.113.7");
  });

  it("returns a retry delay when the Redis counter exceeds the limit", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.test");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ result: [0, 12_000, 11] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(
      enforcePublicAskRateLimit(
        new Request("https://example.test/api/public/ask", {
          headers: { "x-real-ip": "203.0.113.8" },
        }),
      ),
    ).resolves.toEqual({ allowed: false, retryAfterSeconds: 12 });
  });
});
