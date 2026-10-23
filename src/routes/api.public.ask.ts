import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createFileRoute } from "@tanstack/react-router";

const MAX_QUESTION_LENGTH = 600;
const MAX_BODY_BYTES = 8_192;
const SYSTEM_PROMPT = `Eres Isabella Villaseñor AI, asistente informativa de la presentación pública del proyecto. Responde en español, con precisión y tono profesional. Distingue explícitamente entre capacidades implementadas, propuestas arquitectónicas y objetivos futuros. No afirmes que una función está certificada, desplegada, auditada o probada si no existe evidencia en el contexto. Si no conoces un dato, dilo y no lo inventes. No solicites contraseñas, claves privadas ni datos personales sensibles.`;

function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

export const Route = createFileRoute("/api/public/ask")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.toLowerCase().includes("application/json")) {
          return jsonError("Content-Type debe ser application/json.", 415);
        }

        const declaredLength = Number(request.headers.get("content-length") ?? "0");
        if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
          return jsonError("La solicitud supera el tamaño permitido.", 413);
        }

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return jsonError("El cuerpo JSON no es válido.", 400);
        }

        if (
          typeof payload !== "object" ||
          payload === null ||
          !("question" in payload) ||
          typeof payload.question !== "string"
        ) {
          return jsonError("Envía una propiedad question de tipo texto.", 400);
        }

        const question = payload.question.trim();
        if (!question) return jsonError("La pregunta no puede estar vacía.", 400);
        if (question.length > MAX_QUESTION_LENGTH) {
          return jsonError(`La pregunta supera el máximo de ${MAX_QUESTION_LENGTH} caracteres.`, 413);
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          return jsonError("El servicio de consulta no está configurado. Define OPENAI_API_KEY en el entorno del servidor.", 503);
        }

        const model = process.env.ISABELLA_PUBLIC_MODEL || "gpt-4.1-mini";
        try {
          const openai = createOpenAI({ apiKey });
          const result = streamText({
            model: openai(model),
            system: SYSTEM_PROMPT,
            prompt: question,
            abortSignal: request.signal,
            maxOutputTokens: 700,
            temperature: 0.2,
          });

          return result.toTextStreamResponse({
            headers: {
              "Cache-Control": "no-store",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch (error) {
          console.error("Isabella public ask failed", error);
          return jsonError("No fue posible iniciar la consulta en este momento.", 502);
        }
      },
    },
  },
});
