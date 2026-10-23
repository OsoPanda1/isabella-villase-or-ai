import { describe, expect, it } from "vitest";
import { validatePublicQuestion } from "./public-ask-validation";

describe("validatePublicQuestion", () => {
  it("accepts a non-empty JSON question and defaults language to Spanish", () => {
    expect(
      validatePublicQuestion("application/json", JSON.stringify({ question: "  Hola Isabella  " })),
    ).toEqual({ ok: true, question: "Hola Isabella", language: "es" });
  });

  it("accepts supported languages and JSON charset parameters", () => {
    expect(
      validatePublicQuestion(
        "application/json; charset=utf-8",
        JSON.stringify({ question: "Hello", language: "en" }),
      ),
    ).toEqual({ ok: true, question: "Hello", language: "en" });
  });

  it("rejects unsupported content types, including substring lookalikes", () => {
    for (const contentType of ["text/plain", "text/application/json", "application/jsonp"]) {
      const result = validatePublicQuestion(contentType, JSON.stringify({ question: "Hola" }));
      expect(result).toMatchObject({ ok: false, status: 415 });
    }
  });

  it("rejects malformed JSON", () => {
    expect(validatePublicQuestion("application/json", "{")).toMatchObject({
      ok: false,
      status: 400,
    });
  });

  it("rejects missing or non-string questions", () => {
    for (const body of [{}, { question: 42 }, null]) {
      expect(
        validatePublicQuestion("application/json", JSON.stringify(body)),
      ).toMatchObject({ ok: false, status: 400 });
    }
  });

  it("rejects empty questions", () => {
    expect(
      validatePublicQuestion("application/json", JSON.stringify({ question: "  " })),
    ).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects questions longer than 600 characters", () => {
    expect(
      validatePublicQuestion("application/json", JSON.stringify({ question: "a".repeat(601) })),
    ).toMatchObject({ ok: false, status: 413 });
  });

  it("rejects bodies larger than 8 KiB by UTF-8 byte length", () => {
    expect(
      validatePublicQuestion("application/json", JSON.stringify({ question: "á".repeat(5_000) })),
    ).toMatchObject({ ok: false, status: 413 });
  });

  it("rejects unsupported response languages", () => {
    expect(
      validatePublicQuestion(
        "application/json",
        JSON.stringify({ question: "Hello", language: "xx" }),
      ),
    ).toMatchObject({ ok: false, status: 400 });
  });
});
