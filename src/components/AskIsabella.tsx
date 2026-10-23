import { useRef, useState } from "react";

const suggestions = [
  "¿Cuáles son los principios axiomáticos?",
  "¿Qué hace cada uno de los 10 agentes?",
  "¿Qué criterios exige la certificación?",
  "¿Cómo funciona el Triple Bloqueo CLEI?",
];

const MAX_QUESTION_LENGTH = 600;

export function AskIsabella() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ctrl = useRef<AbortController | null>(null);

  async function ask(question: string) {
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion || loading) return;
    if (normalizedQuestion.length > MAX_QUESTION_LENGTH) {
      setError(`La pregunta no puede superar ${MAX_QUESTION_LENGTH} caracteres.`);
      return;
    }

    const controller = new AbortController();
    ctrl.current = controller;
    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const res = await fetch("/api/public/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/plain" },
        body: JSON.stringify({
          question: normalizedQuestion,
          language: document.documentElement.lang || "es",
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const rawDetails = (await res.text()).trim();
        let details = rawDetails;
        try {
          const payload: unknown = JSON.parse(rawDetails);
          if (
            typeof payload === "object" &&
            payload !== null &&
            "error" in payload &&
            typeof payload.error === "string"
          ) {
            details = payload.error;
          }
        } catch {
          // Providers may return plain text instead of JSON errors.
        }
        if (res.status === 429) {
          setError("Se alcanzó el límite de consultas. Intenta de nuevo más tarde.");
        } else if (res.status === 402) {
          setError("El servicio de IA no está disponible por el momento.");
        } else {
          setError(details.slice(0, 500) || `No se pudo responder (HTTP ${res.status}).`);
        }
        return;
      }

      if (!res.body) {
        setError("El servidor devolvió una respuesta vacía.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let receivedContent = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            receivedContent = true;
            setAnswer((previous) => previous + chunk);
          }
        }

        const finalChunk = decoder.decode();
        if (finalChunk) {
          receivedContent = true;
          setAnswer((previous) => previous + finalChunk);
        }

        if (!receivedContent && !controller.signal.aborted) {
          setError("La respuesta llegó vacía. Intenta reformular la pregunta.");
        }
      } finally {
        reader.releaseLock();
      }
    } catch (cause) {
      if (cause instanceof Error && cause.name === "AbortError") {
        return;
      }
      setError("No fue posible conectar con Isabella. Comprueba tu conexión e inténtalo de nuevo.");
    } finally {
      if (ctrl.current === controller) {
        ctrl.current = null;
        setLoading(false);
      }
    }
  }

  function stop() {
    ctrl.current?.abort();
  }

  return (
    <div className="panel p-6 md:p-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void ask(q);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="ask-q" className="sr-only">Tu pregunta</label>
        <input
          id="ask-q"
          value={q}
          onChange={(event) => setQ(event.target.value.slice(0, MAX_QUESTION_LENGTH))}
          maxLength={MAX_QUESTION_LENGTH}
          placeholder="Pregunta sobre principios, agentes o certificación…"
          className="min-h-11 flex-1 border bg-background px-4 font-mono text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          aria-describedby="ask-help"
          disabled={loading}
        />
        {loading ? (
          <button
            type="button"
            onClick={stop}
            className="min-h-11 border border-accent px-6 font-mono text-xs uppercase tracking-widest text-accent"
          >
            Detener
          </button>
        ) : (
          <button
            type="submit"
            disabled={!q.trim()}
            className="min-h-11 bg-primary px-6 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Consultar
          </button>
        )}
      </form>
      <p id="ask-help" className="mt-2 text-xs text-muted-foreground">
        Máximo {MAX_QUESTION_LENGTH} caracteres. No incluyas contraseñas ni datos personales sensibles.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={loading}
            onClick={() => {
              setQ(suggestion);
              void ask(suggestion);
            }}
            className="min-h-9 border px-3 text-xs text-muted-foreground hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
      <div aria-live="polite" aria-busy={loading} className="mt-6 min-h-24 border-t pt-6">
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {!error && !answer && (
          <p className="font-mono text-xs text-muted-foreground">
            {loading
              ? "Isabella está procesando la consulta…"
              : "Las respuestas dependen del servicio de consulta configurado en el servidor."}
          </p>
        )}
        {answer && <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{answer}</p>}
      </div>
    </div>
  );
}
