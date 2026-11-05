# SSR Worker

The SSR worker generates server-rendered widget artifacts
asynchronously.

SSR generation is intentionally separated from the main orchestrator
process. The orchestrator prepares the effective widget contract and
submits an SSR generation job. The worker consumes the job, renders the
widget and publishes the resulting HTML artifact.

## Flow

``` text
Orchestrator
    │
    │ prepares effective contract
    │
    ▼
SSR Queue
    │
    ▼
SSR Worker
    │
    ├── render widget
    ├── write temporary artifact
    └── atomically publish output.html
```

The worker receives a prepared contract rather than loading the original
contract file itself. This allows the orchestrator to enrich or
transform contracts before SSR generation without introducing
widget-specific behaviour into the worker.

For example, a capability may combine its contract with
platform-exported data before the SSR job is submitted.

## Structure

``` text
ssr-worker/
├── jobs/           SSR generation jobs
├── connection.ts   Redis connection
├── job-types.ts    Queue job contracts
├── logger.ts       Worker logging
├── queue.ts        Queue producer
├── render-ssr.ts   Queue-specific SSR renderer
└── README.md
```

The worker process is started from:

``` text
services/orchestrator/ssr-worker.ts
```

The entry point remains at the orchestrator root because the worker is
an orchestrator process and requires the same environment configuration.

## Rendering

`render-ssr.ts` is the rendering adapter used by the asynchronous
worker.

The effective contract is passed directly to the renderer rather than
being reloaded from a contract path. The widget's own SSR entry point
remains responsible for producing the HTML.

``` text
effective contract
      │
      ▼
render-ssr.ts
      │
      ▼
widgets/<widget>/src/ssr/render.tsx (or legacy src/entrypoints/ssr.tsx)
      │
      ▼
HTML
```

The existing `packages/widget-build/ssr-generation/render-page.ts`
renderer is currently retained for existing CLI and mise workflows.

These are temporarily separate execution paths. They should converge on
a shared rendering primitive once the asynchronous SSR pipeline has been
validated across the required widget types.

## Local Redis

The worker requires Redis.

If Redis is already running as a system service, stop it before starting
the development container:

``` bash
sudo service redis-server stop
```

Start Redis:

``` bash
docker run --name reactedge-redis \
    --publish 6379:6379 \
    --detach redis:7-alpine
```

Verify the container:

``` bash
docker ps --filter name=reactedge-redis
```

Verify Redis:

``` bash
redis-cli ping
```

Expected response:

``` text
PONG
```

For subsequent development sessions, an existing stopped container can
be restarted with:

``` bash
docker start reactedge-redis
```

## Current scope

The asynchronous pipeline has been validated with:

-   USP --- contract-only SSR
-   Mega Menu --- SSR using a contract enriched with exported platform
    data

Product Gallery is the next case to validate. Unlike the current
widgets, it requires product-specific SSR artifacts and therefore
introduces one-to-many SSR generation.
