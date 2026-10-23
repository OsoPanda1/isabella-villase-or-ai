const MAX_QUESTION_LENGTH = 600;
const MAX_BODY_BYTES = 8_192;

type ValidationResult =
  | { ok: true; question: string }
  | { ok: false; message: string; status: number };

export function validatePublicQuestion(
  contentType: string | null,
  rawBody: string,
): ValidationResult {
  if (!(contentType ?? "").toLowerCase().includes("application/json")) {
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

  return { ok: true, question };
}

