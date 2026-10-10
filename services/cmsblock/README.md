# CMSBlock — first iteration

This service was scaffolded from Operational Intelligence's `create_server`
MCP template, like ReactEdge's ListingRecord service. It uses Express,
TypeScript, request/route OpenTelemetry spans and separate access, controller,
routes, and model layers.

This **development-only** iteration supports a single block, `demo`,
with a deterministic generator (not an AI model).

## Start locally

```bash
npm --prefix services/cmsblock ci
npm --prefix services/cmsblock start
```

Default HTTP address: `http://127.0.0.1:4190`.

For local development, start the CMSBlock widget separately:

```bash
npm --prefix widgets/cmsblock dev
```

The widget uses `http://127.0.0.1:4190/cmsblock/blocks/demo` by default.
Set `VITE_CMSBLOCK_URL` to override the service origin.

## API

| Method | Path | Action |
| --- | --- | --- |
| GET | `/cmsblock/status` | Scaffold status |
| GET | `/cmsblock/blocks/demo` | Read saved block |
| PUT | `/cmsblock/blocks/demo` | Save source, style and layout |
| POST | `/cmsblock/blocks/demo/generate` | Generate a revision for review |
| POST | `/cmsblock/blocks/demo/approve` | Publish the pending revision |
| POST | `/cmsblock/blocks/demo/reject` | Discard the pending revision |

Source content remains separate from pending and approved HTML/CSS. New
drafts do not change the approved revision until approval. The JSON store
uses `data/demo.json` by default and is compatible with the old prototype.
The generator supports three editorial styles and three image arrangements.

Set `PORT`, `CMSBLOCK_DATA_DIR`, `FRONTEND_URL` (comma-separated CORS
origins), `OTEL_HOST`, and `OTEL_SERVICE_NAME` as needed.

## Checks

```bash
npm --prefix services/cmsblock run typecheck
npm --prefix services/cmsblock test
mise run complexity -- cmsblock
```

Run these checks locally when changing the service. To verify startup, call
`curl --fail http://127.0.0.1:4190/cmsblock/status` after starting it.

## Limitations

**Do not expose this API to the public internet.** It has no authentication,
authorization or rate limiting. It listens on loopback by default; CORS is
not an authentication mechanism. The deterministic generator converts
supplied HTML to escaped text and retains up to three HTTPS image URLs;
it does not preserve arbitrary HTML or interpret style reference images.
The widget uses sandboxed iframe previews. Published output will require
separate security review and sanitisation before it can be served directly
as SSR markup. Telemetry exporter delivery is not covered by the current
HTTP lifecycle test.

## AI-assisted generation (opt in)

By default CMSBLOCK_GENERATOR=deterministic preserves the existing local
demo behavior. To use the server-side OpenAI Responses API, configure:

    CMSBLOCK_GENERATOR=openai
    OPENAI_API_KEY=your-server-only-key
    CMSBLOCK_AI_MODEL=gpt-4.1-mini
    CMSBLOCK_PROMPT_VERSION=v1

Prompt instructions live in versioned JSON assets at
services/cmsblock/cdn/cmsblock/prompt.v1.json. Select the version with
CMSBLOCK_PROMPT_VERSION; the service loads that asset once and reuses it.
To serve the JSON from a CDN, set CMSBLOCK_PROMPT_URL to the exact versioned
asset URL. CDN JSON must include the matching version field and an
instructions string array. The service fails generation if the asset
cannot be loaded or its version does not match, so a different prompt is
never selected silently.

The key must never be placed in the widget or bundled frontend assets.

The generation mode is chosen from the source:
- Plain text, incomplete HTML, or unstructured snippets are treated as loose briefs.
  AI is allowed to design semantic HTML and CSS.
- Balanced semantic HTML is treated as a structural guardrail. The server
  retains the submitted HTML verbatim and uses AI only for its scoped styling.

Generated content enters the existing pending review state. Nothing is
published without approval; provider errors leave the published revision intact.
The server rejects scripting markup and unscoped AI CSS. These are initial
guardrails rather than a complete HTML/CSS sanitization or an authorization
layer; keep this unauthenticated development service private.
