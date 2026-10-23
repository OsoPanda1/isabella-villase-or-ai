import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import doc from "@/content/isabella.md?raw";

const SYSTEM = `Eres el asistente oficial de la Presentación Mundial de Isabella Villaseñor AI™.
Responde en el idioma del visitante, con tono académico, preciso y conciso (máx. ~180 palabras).
Usa EXCLUSIVAMENTE la información del documento siguiente. Si la pregunta no está cubierta, dilo claramente.
Temas principales: principios, CLEI, agentes, arquitectura, seguridad y certificación.

=== DOCUMENTO ===
${doc}`;

export const Route = createFileRoute("/api/public/ask")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Servicio no configurado.", { status: 500 });
        let question = "";
        try {
          const body = (await request.json()) as { question?: unknown };
          question = typeof body.question === "string" ? body.question.trim().slice(0, 600) : "";
        } catch {
          /* empty */
        }
        if (!question) return new Response("Pregunta vacía.", { status: 400 });

        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          instructions: SYSTEM,
          messages: [{ role: "user", content: question }],
          abortSignal: request.signal,
          maxRetries: 0,
          providerOptions: {
            openai: {
              store: false,
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            },
          },
          onError: ({ error }) => console.error("ask error", error),
        });
        return result.toTextStreamResponse({
          headers: { "Cache-Control": "no-cache, no-transform" },
        });
      },
    },
  },
});
