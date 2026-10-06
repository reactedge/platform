# Listingrecord

Express listing persistence service, generated using `create_server` from
[`reactedge/operational-intelligence`](https://github.com/reactedge/operational-intelligence).
It follows the same `src/access`, `src/routes`, `src/controller`, `src/model`,
`src/lib/initilisers` and `src/observability` structure. The status endpoint and
request/route OpenTelemetry spans are retained from the canonical template.

## Run

From the ReactEdge repository root:

```bash
npm ci --prefix services/listingrecord
npm start --prefix services/listingrecord
```

The service listens on port **4180** by default. Copy `.env.sample` to `.env`
in this service directory when configuring it. `PORT` overrides the port;
`FRONTEND_URL` is a comma-separated list of allowed browser origins.
`OTEL_HOST` and `OTEL_SERVICE_NAME` configure the existing telemetry exporter.

## Storage access

The access layer resolves `CDN_FOLDER` under `ROOT_DIR`, following cache-warmer's
`rootDir` / `cdnFolder` convention. Defaults are this service's directory and
`listing-data`. Records are saved to:

```text
services/listingrecord/listing-data/listings.json
```

Set `ROOT_DIR` to an existing absolute directory on persistent storage and
`CDN_FOLDER` to its relative data folder to choose another location. Startup
rejects paths or folder symlinks escaping that root. Requests cannot choose a
filename or folder. The same folder is exposed through the access layer at
`/<CDN_FOLDER>/`; listing reads also have a JSON API endpoint below.

Each record contains a UUID `id` and a trimmed `name` of 1–50 characters.
Duplicate names are allowed. Writes are serialized in one process and use
atomic file replacement. Invalid existing JSON is reported as an error and
never overwritten. Run **one service process per storage folder**. Default
runtime data is ignored by Git; keep custom storage outside tracked source.

## Routes

| Method | Path | Result |
| --- | --- | --- |
| GET | `/listingrecord/status` | `{ "status": "ok" }` |
| GET | `/listingrecord/listings` | Saved listing records |
| POST | `/listingrecord/listings` | Create with `{ "name": "Summer products" }`; returns 201 |

The service preserves the scaffold's CORS convention. It does not implement
application authentication; place it behind the host application's access
controls when exposing listing data.

## Widget integration

The widget uses an explicit service host prefix for both loading and saving:

```text
<VITE_LISTINGRECORD_URL>/listingrecord/listings
```

The default is `http://127.0.0.1:4180`. In a second terminal, from the
repository root, run the normal widget server:

```bash
mise run widget-dev -- createlisting
```

For another service host, set `VITE_LISTINGRECORD_URL` in the widget's existing
local environment configuration (`widgets/createlisting/.env.local`), or pass
it when starting Vite:

```bash
VITE_LISTINGRECORD_URL=https://api.example.com mise run widget-dev -- createlisting
```

Set the Express service's `FRONTEND_URL` to the exact widget/storefront origin
including its port, for example `http://127.0.0.1:5173`. CORS must allow that
origin for these direct requests. Restart Express after changing its `.env`;
restart Vite after changing the widget host prefix.

For deployment, set `VITE_LISTINGRECORD_URL` to the browser-accessible service
host **before building the widget**, and add the storefront origin to
`FRONTEND_URL`. Use HTTPS when the storefront uses HTTPS. Vite embeds `VITE_`
values in the frontend bundle; they are public configuration, not secrets.
Records remain owned by the service's configured storage folder.

The widget's canonical Vite configuration and launch scripts are unchanged.
All requests go directly to the configured Express host; no custom Vite
middleware or proxy configuration is required.

## Validate

```bash
npm run typecheck --prefix services/listingrecord
npm test --prefix services/listingrecord
```

Tests exercise the actual Express routes, configured access folder, CORS,
JSON persistence across store restarts, validation, simultaneous saves,
corrupt-file protection and paths escaping the configured root. Browser
integration was also checked with direct-host requests and mocked Magento data.
