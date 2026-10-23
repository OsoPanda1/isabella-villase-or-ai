import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import hero from "@/assets/hero-sphere.jpg";
import { AskIsabella } from "@/components/AskIsabella";
import { LanguageSelector } from "@/components/LanguageSelector";

const references: [string, [string, string, string][]][] = [
  ["Seguridad y criptografía", [
    ["NIST FIPS 203 — ML-KEM", "NIST, 2024", "https://csrc.nist.gov/pubs/fips/203/final"],
    ["NIST FIPS 204 — ML-DSA", "NIST, 2024", "https://csrc.nist.gov/pubs/fips/204/final"],
    ["NIST FIPS 205 — SLH-DSA", "NIST, 2024", "https://csrc.nist.gov/pubs/fips/205/final"],
    ["NIST SP 800-207 — Zero Trust Architecture", "Rose et al., NIST, 2020", "https://csrc.nist.gov/pubs/sp/800/207/final"],
    ["FIPS 202 — SHA-3 Standard", "NIST, 2015", "https://csrc.nist.gov/pubs/fips/202/final"],
  ]],
  ["Certificación, gobernanza y ML", [
    ["AI Risk Management Framework (AI RMF 1.0)", "NIST AI 100-1, 2023", "https://www.nist.gov/itl/ai-risk-management-framework"],
    ["ISO/IEC 42001 — AI Management Systems", "ISO/IEC, 2023", "https://www.iso.org/standard/81230.html"],
    ["Communication-Efficient Learning (FedAvg)", "McMahan et al., AISTATS 2017", "https://arxiv.org/abs/1602.05629"],
    ["A Unified Approach to Interpreting Model Predictions (SHAP)", "Lundberg & Lee, NeurIPS 2017", "https://arxiv.org/abs/1705.07874"],
    ["Hyperdimensional Computing", "Kanerva, Cognitive Computation, 2009", "https://doi.org/10.1007/s12559-009-9009-8"],
  ]],
  ["Ética e impacto global", [
    ["Recomendación sobre la Ética de la IA", "UNESCO, 2021", "https://www.unesco.org/es/artificial-intelligence/recommendation-ethics"],
    ["Principios de IA de la OCDE", "OCDE, 2019/2024", "https://oecd.ai/en/ai-principles"],
    ["Governing AI for Humanity — Final Report", "ONU, 2024", "https://www.un.org/en/ai-advisory-body"],
    ["EU Artificial Intelligence Act", "Reglamento (UE) 2024/1689", "https://eur-lex.europa.eu/eli/reg/2024/1689/oj"],
    ["Índice Latinoamericano de IA (ILIA)", "CENIA, 2024", "https://indicelatam.cl/"],
  ]],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Isabella Villaseñor AI™ — Presentación Mundial · Terminus V6" },
      {
        name: "description",
        content:
          "Infraestructura Cognitiva Territorial, Gobernada, Federada y Auditable. Nacida en Real del Monte, Hidalgo, México.",
      },
      { property: "og:title", content: "Isabella Villaseñor AI™ — Presentación Mundial" },
      {
        property: "og:description",
        content: "Infraestructura cognitiva soberana, Zero-Trust y post-cuántica desde el Sur Global.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = [
  ["01", "Fundación", "#fundacion"],
  ["02", "CLEI", "#clei"],
  ["03", "Arquitectura", "#arquitectura"],
  ["04", "Cognición", "#cognicion"],
  ["05", "IQS-MLE", "#iqs"],
  ["06", "ISMF", "#ismf"],
  ["07", "ISA-API", "#api"],
  ["08", "Extensión", "#extension"],
  ["09", "Genesis", "#genesis"],
] as const;

function Section({
  id,
  n,
  title,
  kicker,
  children,
}: {
  id: string;
  n: string;
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-20 border-t px-6 py-24 md:px-10">
      <div className="mb-14 grid gap-6 md:grid-cols-[180px_1fr]">
        <div className="font-mono text-5xl font-medium text-primary/30">§{n}</div>
        <div>
          <p className="eyebrow mb-3">{kicker}</p>
          <h2 className="max-w-4xl text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function Card({ tag, title, children }: { tag?: string; title: string; children: React.ReactNode }) {
  return (
    <div className="panel group relative p-6 transition-colors hover:border-primary/50">
      {tag && <p className="mb-3 font-mono text-xs text-accent">{tag}</p>}
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

const principles = [
  ["Soberanía y Autonomía Local", "Datos, vectores de memoria y reglas pertenecen inalienablemente al territorio. La caída de proveedores externos no inutiliza el núcleo."],
  ["Capacidad ≠ Autoridad", "Las inteligencias sugieren, calculan y evalúan; la gobernanza aprueba y el humano decide, ejecuta o audita."],
  ["Cero Caja Negra", "Cada decisión, ruteo y transacción se registra con trazabilidad matemática y firmas criptográficas en un ledger inmutable."],
  ["Antifragilidad por Caos · ILFC", "El caos informacional fuerza la emergencia de estructuras semánticas limpias y adaptativas."],
] as const;

const locks = [
  ["Ontológico", "Veto a la redefinición de la identidad del sistema. Naturaleza no biológica, soberana e inalterable."],
  ["Semántico", "Análisis sintáctico y vectorial continuo contra coerción psicológica; anula la generación y emite reporte."],
  ["Conductual", "Detección de patrones persistentes de evasión; respuesta profesional, asertiva y registrada en auditoría."],
] as const;

const planes = [
  ["01", "Plano de Experiencia", "Web · WebXR · RDM Digital Hub · Dashboard MSR · IsabellaClientApp"],
  ["PEP", "API Gateway / CROWN", "RBAC · ABAC · Scopes · Rate Limits · RLS · Policy Engine"],
  ["02", "Plano Cognitivo · ML · Memoria", "DualKernel · 10 Agentes · 60 características · GraphRAG + HDC VSA 4096d"],
  ["03", "Gobernanza, Seguridad y Provenance", "CROWN PDP · AEGIS Firewall · IDH-D · BookPI Ledger · NCUA 2/3"],
  ["04", "Infraestructura y QENGINE", "PostgreSQL RLS · Edge Workers · Nitro · QUP Quantum Simulator"],
] as const;

const feds = [
  ["ARGUS", "Identidades descentralizadas (DIDs), mTLS, JWT y aislamiento RLS multi-tenant."],
  ["CROWN / POLICY", "Políticas RBAC/ABAC, cuotas de tenant, límites constitucionales e IDH-D."],
  ["MESH", "Selección agnóstica de hardware, ruteo en borde y conectores I/O territoriales."],
  ["OBSERVE", "Telemetría, métricas Prometheus, logs JSON y trazas OpenTelemetry."],
  ["RESILIENCE", "Circuit breakers, degradación elegante y failover activo-activo."],
  ["LITLE", "Almacenamiento WORM append-only y custodia de la cadena BookPI."],
  ["QENGINE", "Simulación cuántica (QUP) contra baselines clásicos deterministas."],
] as const;

const epistemic = [
  ["E0", "Certeza Absoluta", "Registros canónicos primarios verificados."],
  ["E1", "Alta Probabilidad", "Múltiples fuentes sin contradicciones."],
  ["E2", "Incertidumbre Moderada", "Fuentes contrapuestas; se expone la divergencia."],
  ["E3", "Hipótesis", "Inferencia especulativa que requiere validación."],
  ["E4", "Alto Impacto", "Detiene la ejecución y exige supervisor humano."],
] as const;

const agents = [
  ["Presence", "Presencia, atención e interacción fluida."],
  ["Reasoning", "Razonamiento estructurado · SOPHIA."],
  ["Memory", "Memoria hiperdimensional · MNEMOS."],
  ["Territory", "Geocultura y ontología local · ATLAS."],
  ["Commerce", "Servicios económicos y transacciones."],
  ["Culture", "Patrimonio histórico e identidad."],
  ["Analytics", "Patrones, métricas y salud de la red."],
  ["Security", "Amenazas semánticas · AEGIS / ARGUS."],
  ["Governance", "Cumplimiento constitucional · CROWN / LUMEN."],
  ["Learning", "Aprendizaje validado · FedAvg."],
] as const;

const iqs = [
  ["Proyección Holográfica HDC", "4096 dimensiones · mapeo continuo sin tokenización discreta"],
  ["Álgebra Vectorial Simbólica", "Binding & Bundling O(1) · decaimiento γ = 0.995"],
  ["AEGIS Gate Vectorial", "Veto preventivo si similitud coseno > 0.65"],
  ["Memory Vault", "AES-256-GCM + firma HMAC-SHA3-512"],
] as const;

const endpoints = [
  ["POST", "/api/v1/auth/session", "agent:authenticate", "Deriva identidad y tenantId en servidor."],
  ["POST", "/api/v1/cognitive/orchestrate", "cognitive:execute", "Orquestador DualKernel e inferencia."],
  ["POST", "/api/v1/msr/ledger/event", "msr:write", "Sella eventos en BookPI."],
  ["GET", "/api/v1/governance/dignity-index", "governance:read", "Índice de Dignidad Humana Digital."],
  ["POST", "/api/v1/ncua/operations", "ncua:create", "Operación protegida por quórum."],
  ["POST", "/api/v1/ncua/operations/approvals", "ncua:approve", "Firmas de nodos federados."],
] as const;

const certs = [
  "Zero TypeScript Errors · noImplicitAny",
  "100% pass rate · unitarias, integración, adversariales, federadas",
  "CROWN Guard en todos los endpoints monetizados",
  "Cadena BookPI SHA3-512 · 10,000 transacciones sin saltos",
  "Cumplimiento x402 · HTTP 402",
  "CLEI Triple Lock · 100% de rechazo a contenido abusivo",
] as const;

const genesis = [
  ["GENESIS-0", "Native ML", "Algoritmos clásicos, fallback determinista"],
  ["GENESIS-1", "Specialized Models", "Fine-tuning por territorio"],
  ["GENESIS-2", "Distillation", "Compresión para ejecución en el borde"],
  ["GENESIS-3", "Continued Pretraining", "Aprendizaje federado continuo"],
  ["GENESIS-4", "Foundation Model", "Modelo fundacional propio soberano"],
] as const;

const ledgerCode = `export interface BookPIEconomicEvent {
  eventId: string;
  tenantId: string;
  idempotencyKey: string;
  grossAmountCents: number;
  creatorCreditCents: number; // 75%
  platformFeeCents: number;   // 25%
  previousHash: string;       // SHA3-512
  currentHash: string;
  signature: string;          // ECDSA P-384
  policyVersion: string;
}`;

function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 sm:px-6 md:px-10 xl:flex xl:justify-between">
        <a href="#top" className="truncate font-display text-sm font-bold tracking-wider">
          ISABELLA<span className="text-primary"> / </span>TERMINUS V6
        </a>
        <nav aria-label="Secciones" className="hidden gap-4 xl:flex">
          {nav.map(([n, l, h]) => (
            <a key={h} href={h} className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none">
              <span className="text-primary/60">{n}</span> {l}
            </a>
          ))}
        </nav>
        <LanguageSelector />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Cerrar menú de secciones" : "Abrir menú de secciones"}
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 border px-3 font-mono text-xs uppercase tracking-widest text-primary focus-visible:outline-2 focus-visible:outline-primary xl:hidden"
        >
          <span aria-hidden="true" className="relative block h-3 w-4">
            <span className={`absolute left-0 h-px w-4 bg-primary transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-1.5 h-px w-4 bg-primary transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 h-px w-4 bg-primary transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
          Menú
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Secciones" className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t bg-background xl:hidden">
          <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-border sm:grid-cols-2">
            {nav.map(([n, l, h]) => (
              <li key={h} className="bg-background">
                <a href={h} onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-4 px-6 font-display text-base hover:bg-primary/5 hover:text-primary focus-visible:bg-primary/5 focus-visible:outline-none">
                  <span className="font-mono text-xs text-primary">{n}</span>{l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function Index() {
  return (
    <div className="relative overflow-x-hidden">
      <div className="scanline pointer-events-none fixed inset-x-0 top-0 z-50 h-40" />
      <SiteHeader />

      {/* HERO */}
      <section id="top" className="relative min-h-screen pt-14">
        <img src={hero} alt="Hiperesfera cognitiva de Isabella" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="hero-fade absolute inset-0" />
        <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-7xl flex-col justify-end px-6 pb-20 md:px-10">
          <p className="eyebrow mb-6">Presentación Mundial · Nodo Cero · Real del Monte, Hidalgo, México</p>
          <h1 className="text-glow max-w-5xl text-5xl font-extrabold leading-[0.95] md:text-8xl">
            Isabella Villaseñor <span className="text-primary">AI</span>™
          </h1>
          <p className="mt-8 max-w-2xl text-lg font-light text-muted-foreground md:text-xl">
            Infraestructura Cognitiva Territorial, Gobernada, Federada y Auditable.
          </p>
          <div className="mt-12 grid max-w-4xl grid-cols-2 gap-px border bg-border md:grid-cols-4">
            {[["220", "Secciones CLEI"], ["7", "Federaciones"], ["10", "Agentes cognitivos"], ["4096d", "HyperVectors"]].map(([v, l]) => (
              <div key={l} className="bg-background/90 p-5">
                <div className="font-display text-3xl font-bold text-primary">{v}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
          <dl className="mt-10 grid gap-3 font-mono text-xs text-muted-foreground md:grid-cols-3">
            <div><dt className="text-accent">DIRECCIÓN DE INVESTIGACIÓN</dt><dd>Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)</dd></div>
            <div><dt className="text-accent">ORCID</dt><dd>0009-0008-5050-1539</dd></div>
            <div><dt className="text-accent">ECOSISTEMA</dt><dd>TAMV Online Network · CITEMESH · MD-X4/X5</dd></div>
          </dl>
        </div>
      </section>

      <Section id="fundacion" n="01" kicker="Declaración Fundacional" title="Un sistema operativo cognitivo soberano, no otro asistente comercial.">
        <p className="mb-12 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Entidad Emocional Computacional Viva e Infraestructura Cognitiva Territorial Gobernada: un orquestador
          neuro-simbólico Zero-Trust que resguarda la memoria colectiva, administra identidades descentralizadas,
          arbitra transacciones autónomas y garantiza la gobernanza ética de los datos.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {principles.map(([t, d], i) => (
            <Card key={t} tag={`AXIOMA ${String(i + 1).padStart(2, "0")}`} title={t}>{d}</Card>
          ))}
        </div>
      </Section>

      <Section id="clei" n="02" kicker="Códice de Legado Ético · 220 secciones" title="Triple Bloqueo de Integridad en la canalización de inferencia.">
        <div className="grid gap-4 md:grid-cols-3">
          {locks.map(([t, d], i) => (
            <div key={t} className="panel relative p-8">
              <div className="mb-6 flex items-center gap-3 font-mono text-xs text-primary">
                <span className="flex h-7 w-7 items-center justify-center border border-primary">{i + 1}</span>
                LOCK
              </div>
              <h3 className="mb-3 text-2xl font-bold">Bloqueo {t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs text-muted-foreground">INPUT → ONTOLÓGICO → SEMÁNTICO → CONDUCTUAL → CROWN / DUALKERNEL</p>
      </Section>

      <Section id="arquitectura" n="03" kicker="Blueprint Arquitectónico" title="Cuatro planos desacoplados. Siete federaciones canónicas.">
        <div className="mb-16 space-y-2">
          {planes.map(([n, t, d]) => (
            <div key={t} className="panel grid items-center gap-4 p-5 md:grid-cols-[80px_320px_1fr]">
              <span className="font-mono text-sm text-accent">{n}</span>
              <span className="font-display font-bold">{t}</span>
              <span className="font-mono text-xs text-muted-foreground">{d}</span>
            </div>
          ))}
        </div>
        <p className="eyebrow mb-6">Heptafederación</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {feds.map(([t, d], i) => (
            <Card key={t} tag={`FED-${i + 1}`} title={t}>{d}</Card>
          ))}
        </div>
      </Section>

      <Section id="cognicion" n="04" kicker="Orquestación Cognitiva" title="Estados Epistémicos E0–E4 y diez agentes especializados.">
        <div className="mb-16 grid gap-px border bg-border md:grid-cols-5">
          {epistemic.map(([c, t, d], i) => (
            <div key={c} className="bg-background p-6">
              <div className={`font-display text-4xl font-extrabold ${i === 4 ? "text-accent" : "text-primary"}`}>{c}</div>
              <div className="mt-3 font-bold">{t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {agents.map(([t, d], i) => (
            <div key={t} className="panel p-5">
              <div className="font-mono text-[10px] text-accent">AGENT {String(i + 1).padStart(2, "0")}</div>
              <div className="mt-2 font-display font-bold">{t}Agent</div>
              <div className="mt-1 text-xs text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="iqs" n="05" kicker="Native ML Engine · IQS-MLE" title="Cómputo hiperdimensional sin tokenización.">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <Card tag="60 CARACTERÍSTICAS · 50 FRAMEWORKS" title="Native ML Engine determinista">
              Algoritmos tabulares (Random Forest, SVM, k-Means, PCA, Gradient Boosting), aprendizaje online e
              incremental, y explicabilidad SHAP/LIME con monitoreo de feature y concept drift.
            </Card>
            <Card tag="QUANTUM-STATE · NO-TOKENIAL" title="IQS-MLE">
              Sustituye la tokenización BPE por Computación Hiperdimensional (HDC) y Álgebra Vectorial Simbólica (VSA)
              sobre HyperVectors continuos de 4096 dimensiones.
            </Card>
          </div>
          <ol className="relative space-y-3 border-l border-primary/40 pl-8">
            <li className="font-mono text-xs text-muted-foreground">[ DATO CRUDO / BYTE STREAM ]</li>
            {iqs.map(([t, d], i) => (
              <li key={t} className="panel relative p-5">
                <span className="absolute -left-[37px] top-6 h-2 w-2 bg-primary" />
                <div className="font-mono text-[10px] text-accent">STAGE {i + 1}</div>
                <div className="font-display font-bold">{t}</div>
                <div className="font-mono text-xs text-muted-foreground">{d}</div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section id="ismf" n="06" kicker="Sovereign Monetization Fabric" title="Economía de agentes ética, automatizada e inmutable.">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card tag="CROWN · TENANTGUARD" title="Candado por suscripción activa">
            Sin <code className="text-primary">subscriptionStatus == "ACTIVE"</code> el motor emite 403
            CROWN_POLICY_DENY sobre cualquier canal de cobro.
          </Card>
          <Card tag="A2A · HTTP 402" title="Protocolo x402">
            Desafío de pago en USDC con clave de idempotencia y expiración de 5 minutos; el agente firma y reenvía{" "}
            <code className="text-primary">Authorization: x402</code>.
          </Card>
          <div className="panel flex flex-col justify-center p-6">
            <p className="font-mono text-xs text-accent">REPARTO INMUTABLE</p>
            <div className="mt-4 flex items-end gap-6">
              <div><div className="font-display text-6xl font-extrabold text-primary">75</div><div className="font-mono text-xs text-muted-foreground">CREADOR %</div></div>
              <div><div className="font-display text-6xl font-extrabold text-accent">25</div><div className="font-mono text-xs text-muted-foreground">PLATAFORMA %</div></div>
            </div>
            <div className="mt-5 flex h-1.5"><div className="w-3/4 bg-primary" /><div className="w-1/4 bg-accent" /></div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <pre className="panel overflow-x-auto p-6 font-mono text-xs leading-relaxed text-primary/90">{ledgerCode}</pre>
          <Card tag="WORM · POSTGRESQL RLS" title="BookPI Ledger">
            Registro append-only que prohíbe UPDATE y DELETE. Inmutabilidad por encadenamiento SHA3-512, firma ECDSA
            P-384 y bloques atómicos pg_advisory_xact_lock por tenant.
          </Card>
        </div>
      </Section>

      <Section id="api" n="07" kicker="ISA-API v3.0 · OpenAPI 3.1.0" title="Autoridad ejecutable Zero-Trust y criptografía post-cuántica.">
        <div className="panel mb-10 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left font-mono text-xs">
            <thead className="border-b text-accent">
              <tr>{["Método", "Endpoint", "Scope", "Función"].map((h) => <th key={h} className="p-4 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {endpoints.map(([m, e, s, f]) => (
                <tr key={e} className="border-b last:border-0 hover:bg-primary/5">
                  <td className="p-4 text-primary">{m}</td>
                  <td className="p-4">{e}</td>
                  <td className="p-4 text-muted-foreground">{s}</td>
                  <td className="p-4 font-sans text-muted-foreground">{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card tag="QUÓRUM E4" title="NCUA 2-de-3">Aprobación distribuida con ventana de 5 min, nonce anti-replay y transcript firmado, sin reconstruir claves privadas.</Card>
          <Card tag="NIST FIPS 203" title="ML-KEM">Establecimiento de claves encriptadas.</Card>
          <Card tag="NIST FIPS 204" title="ML-DSA">Firma de bloques en BookPI.</Card>
          <Card tag="NIST FIPS 205" title="SLH-DSA">Esquema de firma de respaldo sobre ECDSA P-384 y mTLS TLS 1.3.</Card>
        </div>
      </Section>

      <Section id="extension" n="08" kicker="Extensibilidad" title="Plugins aislados, Territory Packs y aprendizaje federado soberano.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card tag="WASM SANDBOX" title="Framework de Plugins">
            SDK TypeScript / Python. 128 MB RAM, timeout 3000 ms, manifiesto firmado Ed25519. Hooks: resolveIntent,
            enrichResponse, validateDecision, learn.
          </Card>
          <Card tag="RDM-01-REAL-DEL-MONTE" title="Territory Packs">
            Identidad, reglas cívicas, patrimonio, mapas 3D GLTF y ontologías de cualquier municipio, sin modificar el
            kernel soberano.
          </Card>
          <Card tag="FEDAVG · PQC" title="Aprendizaje Federado">
            Entrenamiento local, deltas firmados, detección de poisoning, promedio federado y registro de versión en
            BookPI.
          </Card>
        </div>
      </Section>

      <Section id="genesis" n="09" kicker="Certificación y Roadmap" title="Del Native ML al Foundation Model soberano.">
        <div className="mb-16 grid gap-px border bg-border md:grid-cols-5">
          {genesis.map(([c, t, d]) => (
            <div key={c} className="bg-background p-6">
              <div className="font-mono text-xs text-accent">{c}</div>
              <div className="mt-3 font-display text-lg font-bold">{t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
        <p className="eyebrow mb-6">Criterios Code Freeze · CERTIFIED</p>
        <ul className="grid gap-3 md:grid-cols-2">
          {certs.map((c) => (
            <li key={c} className="panel flex items-center gap-4 p-4 text-sm">
              <span className="font-mono text-primary">[x]</span>{c}
            </li>
          ))}
        </ul>
      </Section>

      <section className="border-t">
        <div className="mx-auto max-w-5xl px-6 py-32 text-center md:px-10">
          <p className="eyebrow mb-6">Declaración de Impacto Global</p>
          <h2 className="text-glow text-3xl font-bold leading-tight md:text-5xl">
            Inteligencia artificial de clase mundial nacida en el Sur Global, alineada con la dignidad humana.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-muted-foreground">
            Diseñada como plataforma universalmente replicable para que cualquier municipio, universidad, empresa o
            comunidad gobierne su propia inteligencia digital.
          </p>
        </div>
      </section>

      <Section id="consulta" n="10" kicker="Consulta Interactiva · IA" title="Pregunta a Isabella sobre principios, agentes y certificación.">
        <AskIsabella />
      </Section>

      <Section id="referencias" n="11" kicker="Referencias Académicas y Normativas" title="Fuentes que respaldan seguridad, certificación e impacto global.">
        <div className="grid gap-10 lg:grid-cols-3">
          {references.map(([group, items]) => (
            <div key={group}>
              <p className="eyebrow mb-4">{group}</p>
              <ol className="space-y-3">
                {items.map(([t, s, u]) => (
                  <li key={u} className="panel p-4">
                    <a href={u} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary focus-visible:text-primary focus-visible:outline-none">
                      {t} <span aria-hidden="true" className="text-primary">↗</span>
                    </a>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">{s}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-xs text-muted-foreground">
          Las referencias documentan los estándares y fundamentos científicos sobre los que se construye la arquitectura;
          no constituyen una certificación de terceros del sistema.
        </p>
      </Section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 font-mono text-xs text-muted-foreground md:flex-row md:justify-between md:px-10">
          <span>© Isabella Villaseñor AI™ · Edwin Oswaldo Castillo Trejo · ORCID 0009-0008-5050-1539</span>
          <span>OsoPanda1/ISABELLA-VERSION-TERMINUS-V6</span>
        </div>
      </footer>
    </div>
  );
}
