# Isabella Villaseñor AI™

Landing pública para presentar la visión, los principios de gobernanza y la arquitectura propuesta de Isabella Villaseñor AI. La aplicación usa React 19, TanStack Start/Router, Vite 8, Tailwind CSS 4, TypeScript y el AI SDK.

> **Estado de producción:** el repositorio incorpora controles automatizados y una ruta pública de consulta, pero no se considera listo para producción hasta que CI termine en verde, se validen las variables del proveedor y se realice una prueba HTTP en el entorno desplegado. La documentación arquitectónica no demuestra por sí sola que cada subsistema descrito esté implementado.

## Requisitos

- Bun (versión actual estable; el lockfile del proyecto es `bun.lock`).
- Runtime compatible con Vite 8 (Node.js 20.19+ o 22.12+ si se usa Node para herramientas auxiliares).
- Una clave de API de OpenAI o una clave válida de Lovable AI Gateway para habilitar la consulta pública.

## Desarrollo local

```bash
git clone https://github.com/OsoPanda1/isabella-villase-or-ai.git
cd isabella-villase-or-ai
bun install --frozen-lockfile
cp .env.example .env
# Edita .env y configura una sola clave de proveedor.
bun run dev
```

No pegues secretos en el código, issues, registros públicos ni variables con prefijo `VITE_`.

## Verificaciones locales

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

El workflow `.github/workflows/ci.yml` ejecuta estos controles en cada push a `main` y en cada pull request. Un commit no equivale a una ejecución satisfactoria: consulta el resultado real de Actions antes de promover una versión.

## Idiomas de la plataforma

La cabecera global incluye un selector con español, inglés, portugués, francés, alemán, italiano, chino simplificado, japonés, coreano, hindi, árabe y ruso. La preferencia se guarda en el almacenamiento local del navegador, actualiza el atributo `lang` y aplica dirección de derecha a izquierda para árabe. La consulta de Isabella también recibe el idioma seleccionado y lo valida en el servidor.

La traducción integral del contenido se realiza mediante el widget externo de Google Translate; por ello necesita conexión y disponibilidad del servicio, y sus resultados son traducciones automáticas no revisadas editorialmente. La plataforma no envía claves propias al navegador para esta función. Si se requiere disponibilidad garantizada, control de calidad terminológica, privacidad contractual o traducciones certificadas, debe sustituirse por un proveedor de traducción con SLA y revisión lingüística.

## Consulta pública de Isabella

La interfaz utiliza `POST /api/public/ask`, implementado en `src/routes/api/public/ask.ts`.

Controles implementados en el endpoint:
- Acepta únicamente solicitudes JSON.
- Lee el cuerpo de forma acotada y cancela la lectura al superar 8 KiB; limita la pregunta a 600 caracteres.
- Rechaza JSON inválido, campos ausentes, tipos incorrectos y preguntas vacías.
- No reintenta automáticamente solicitudes al proveedor.
- Devuelve errores HTTP explícitos si falta configuración o no se puede iniciar la consulta.
- Transmite texto en streaming, no almacena la respuesta en caché y evita exponer la clave al navegador.
- Valida el idioma de respuesta contra la lista admitida; el selector envía la preferencia al endpoint para que Isabella responda en ese idioma.
- Usa el documento de presentación como contexto e instruye al modelo a no presentar propuestas como capacidades probadas.

Variables del servidor:
- `OPENAI_API_KEY`: clave privada de OpenAI.
- `LOVABLE_API_KEY`: clave privada de Lovable AI Gateway. Se usa si está definida; si ambas claves existen, el gateway de Lovable tiene prioridad.
- `ISABELLA_PUBLIC_MODEL`: modelo opcional compatible con el proveedor configurado.

Consulta `.env.example` para el formato. Los archivos `.env` están excluidos de Git; configura los secretos directamente en el panel del proveedor de despliegue.

### Límites operativos que aún requieren configuración

- El endpoint aplica un límite distribuido de 10 solicitudes por ventana de 60 segundos por IP mediante un contador atómico de Upstash Redis REST. En producción, `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` son obligatorios; si faltan o Redis no responde, la ruta falla de forma cerrada con HTTP 503. En desarrollo local, el limitador se omite si no hay credenciales.
- Configura límites de gasto y alertas en el proveedor del modelo; el rate limit no sustituye esas protecciones.
- Verifica que el modelo configurado esté habilitado para la cuenta y región utilizadas.
- No envíes información confidencial o datos personales sensibles a la consulta pública.
- Las pruebas unitarias cubren validación de entrada y el limitador distribuido simulado; no sustituyen pruebas de integración con Redis real ni con el proveedor del modelo.

## Despliegue

La configuración de Vite usa el paquete `@lovable.dev/vite-tanstack-config`, que declara un target Nitro/Cloudflare por defecto. El adaptador y las variables del entorno real deben coincidir con el proveedor elegido. **No se afirma compatibilidad desplegada con Vercel hasta configurar ese target y verificar un despliegue real.**

Antes de promover a producción:

1. Exige que TypeScript, lint, pruebas y build terminen sin errores.
2. Configura una clave de proveedor, el modelo autorizado y las credenciales `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` en el entorno del servidor.
3. Con el limitador configurado, comprueba que `POST /api/public/ask` responde 415 a un tipo de contenido incorrecto, 400 a JSON/pregunta/idioma inválidos, 429 al superar el límite y 503 cuando falta la clave del proveedor.
4. Ejecuta una consulta real en staging y verifica streaming, cancelación, errores del proveedor y límites de gasto.
5. Configura rate limiting, alertas, logging sin secretos, dominio/TLS y monitoreo de disponibilidad.
6. Verifica el despliegue y las rutas desde el entorno público después de cada promoción.

## Alcance y precisión

La landing presenta conceptos, módulos y objetivos del proyecto; no es una certificación independiente. Los claims técnicos, cifras de rendimiento, garantías criptográficas y capacidades de agentes deben sostenerse con código ejecutable, pruebas reproducibles y evidencia antes de presentarse como resultados validados.
