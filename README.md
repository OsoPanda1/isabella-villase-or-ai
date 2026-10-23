# Isabella Villaseñor AI

Landing pública en español para presentar la visión, los principios de gobernanza y la arquitectura propuesta de Isabella Villaseñor AI. Aplicación construida con React, TanStack Start, Vite, Tailwind CSS y TypeScript.

> **Estado técnico:** el repositorio está en desarrollo. La presencia de una descripción arquitectónica o de una interfaz no demuestra por sí sola que todos los sistemas descritos estén implementados, certificados o en producción. El estado real debe determinarse mediante build, pruebas, revisión de rutas y validación del despliegue.

## Requisitos

- Node.js compatible con Vite 8 (Node.js 20.19+ o 22.12+ recomendado).
- npm.
- Una clave de API de OpenAI para habilitar el endpoint de consulta pública.

## Desarrollo local

```bash
git clone https://github.com/OsoPanda1/isabella-villase-or-ai.git
cd isabella-villase-or-ai
npm ci
npm run dev
```

## Verificaciones

```bash
npm run lint
npm test
npm run build
```

Si alguna verificación falla, registra el comando, el archivo y el error reproducible antes de declarar el proyecto listo para producción.

## Consulta pública de Isabella

La interfaz envía preguntas a `POST /api/public/ask`. El servidor valida el tipo de contenido, el JSON, el campo `question` y su longitud antes de iniciar una respuesta en streaming.

Configura la variable **solo en el entorno del servidor**:

- `OPENAI_API_KEY`: clave privada de OpenAI. Nunca uses el prefijo `VITE_` para este secreto.
- `ISABELLA_PUBLIC_MODEL`: modelo permitido para el endpoint (opcional; valor predeterminado configurado en el código).

Ejemplo para un entorno local: coloca las variables en un archivo `.env` ignorado por Git y no publiques su contenido. En Vercel, configúralas en las variables de entorno del proyecto y vuelve a desplegar.

El endpoint responde con un error HTTP 503 si falta `OPENAI_API_KEY`; no simula una respuesta ni expone la clave al navegador. La disponibilidad y el costo del proveedor dependen de la configuración externa.

## Alcance y límites

- La landing presenta conceptos, módulos y objetivos del proyecto; no constituye una certificación independiente.
- Las cifras, protocolos y capacidades arquitectónicas deben contrastarse con código ejecutable y pruebas antes de presentarse como resultados validados.
- No se debe almacenar información sensible del usuario en preguntas públicas.
- No se debe publicar una clave de API, credenciales ni secretos en el repositorio.

## Despliegue

El proyecto incluye configuración Vite/TanStack Start. Antes de promover una versión a producción, valida localmente lint, pruebas y build; configura los secretos en el proveedor de despliegue; verifica las rutas HTTP y prueba el flujo de consulta con una clave válida y con la clave ausente. Un commit por sí solo no demuestra que el despliegue haya finalizado correctamente.
