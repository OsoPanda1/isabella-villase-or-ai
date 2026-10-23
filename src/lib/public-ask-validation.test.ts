import { describe, expect, it } from "vitest";
import { validatePublicQuestion } from "./public-ask-validation";

describe("validatePublicQuestion", () => {
  it("accepts a non-empty JSON question and trims whitespace", () => {
    expect(
      validatePublicQuestion("application/json", JSON.stringify({ question: "  Hola Isabella  " })),
    ).toEqual({ ok: true, question: "Hola Isabella" });
  });

  it("rejects unsupported content types", () => {
    const result = validatePublicQuestion("text/plain", JSON.stringify({ question: "Hola" }));
    expect(result).toMatchObject({ ok: false, status: 415 });
  });

  it("rejects malformed JSON", () => {
    const result = validatePublicQuestion("application/json", "{");
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects missing or non-string questions", () => {
    for (const body of [{}, { question: 42 }, null]) {
      const result = validatePublicQuestion("application/json", JSON.stringify(body));
      expect(result).toMatchObject({ ok: false, status: 400 });
    }
  });

  it("rejects empty questions", () => {
    const result = validatePublicQuestion("application/json", JSON.stringify({ question: "  " }));
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects questions longer than 600 characters", () => {
    const result = validatePublicQuestion(
      "application/json",
      JSON.stringify({ question: "a".repeat(601) }),
    );
    expect(result).toMatchObject({ ok: false, status: 413 });
  });

  it("rejects bodies larger than 8 KiB by UTF-8 byte length", () => {
    const result = validatePublicQuestion(
      "application/json",
      JSON.stringify({ question: "á".repeat(5_000) }),
    );
    expect(result).toMatchObject({ ok: false, status: 413 });
  });
});
