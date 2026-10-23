import { useRef, useState } from "react";

const suggestions = [
  "¿Cuáles son los principios axiomáticos?",
  "¿Qué hace cada uno de los 10 agentes?",
  "¿Qué criterios exige la certificación?",
  "¿Cómo funciona el Triple Bloqueo CLEI?",
];

export function AskIsabella() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ctrl = useRef<AbortController | null>(null);

  async function ask(question: string) {
    if (!question.trim() || loading) return;
    ctrl.current = new AbortController();
    setLoading(true);
    setAnswer("");
    setError("");
    try {
      const res = await fetch("/api/public/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        signal: ctrl.current.signal,
      });
      if (!res.ok || !res.body) {
        setError(res.status === 429 ? "Demasiadas consultas, intenta en un momento." : res.status === 402 ? "Servicio de IA sin créditos disponibles." : (await res.text()) || "No se pudo responder.");
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setAnswer((a) => a + dec.decode(value, { stream: true }));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel p-6 md:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="ask-q" className="sr-only">Tu pregunta</label>
        <input
          id="ask-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={600}
          placeholder="Pregunta sobre principios, agentes o certificación…"
          className="min-h-11 flex-1 border bg-background px-4 font-mono text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        {loading ? (
          <button type="button" onClick={() => ctrl.current?.abort()} className="min-h-11 border border-accent px-6 font-mono text-xs uppercase tracking-widest text-accent">
            Detener
          </button>
        ) : (
          <button type="submit" className="min-h-11 bg-primary px-6 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
            Consultar
          </button>
        )}
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button key={s} type="button" onClick={() => { setQ(s); ask(s); }} className="min-h-9 border px-3 text-xs text-muted-foreground hover:border-primary hover:text-primary">
            {s}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mt-6 min-h-24 border-t pt-6">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!error && !answer && (
          <p className="font-mono text-xs text-muted-foreground">{loading ? "Isabella está analizando el documento canónico…" : "Las respuestas se basan exclusivamente en el documento oficial de la presentación."}</p>
        )}
        {answer && <p className="whitespace-pre-wrap text-sm leading-relaxed">{answer}</p>}
      </div>
    </div>
  );
}
