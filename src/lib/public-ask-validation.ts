const MAX_QUESTION_LENGTH = 600;
const MAX_BODY_BYTES = 8_192;

export const SUPPORTED_LANGUAGES = [
  "es", "en", "pt", "fr", "de", "it", "zh-CN", "ja", "ko", "hi", "ar", "ru",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

type ValidationResult =
  | { ok: true; question: string; language: SupportedLanguage }
  | { ok: false; message: string; status: number };

export function validatePublicQuestion(
  contentType: string | null,
  rawBody: string,
): ValidationResult {
  const mediaType = (contentType ?? "").split(";", 1)[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    return { ok: false, message: "Content-Type debe ser application/json.", status: 415 };
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return { ok: false, message: "La solicitud supera el tamaño permitido.", status: 413 };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return { ok: false, message: "El cuerpo JSON no es válido.", status: 400 };
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("question" in payload) ||
    typeof payload.question !== "string"
  ) {
    return { ok: false, message: "Envía una propiedad question de tipo texto.", status: 400 };
  }

  const question = payload.question.trim();
  if (!question) {
    return { ok: false, message: "La pregunta no puede estar vacía.", status: 400 };
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return {
      ok: false,
      message: `La pregunta supera el máximo de ${MAX_QUESTION_LENGTH} caracteres.`,
      status: 413,
    };
  }

  const requestedLanguage: unknown = "language" in payload ? payload.language : "es";
  if (
    typeof requestedLanguage !== "string" ||
    !SUPPORTED_LANGUAGES.some((language) => language === requestedLanguage)
  ) {
    return {
      ok: false,
      message: "El idioma seleccionado no está admitido.",
      status: 400,
    };
  }

  return { ok: true, question, language: requestedLanguage as SupportedLanguage };
}
