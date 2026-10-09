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

CI also exercises Express startup and the status endpoint.

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
