# ReactEdge Feature Health Engine

## Installation

### Runtime

```bash
npm install \
express \
dotenv \
jsdom \
zod
```

### Development

```bash
npm install -D \
typescript \
tsx \
@types/node \
@types/express \
@types/jsdom
```

### OpenTelemetry

```bash
npm install \
@opentelemetry/api \
@opentelemetry/sdk-trace-node \
@opentelemetry/sdk-trace-base \
@opentelemetry/exporter-trace-otlp-http \
@opentelemetry/resources
```

---

## Start

```bash
npm run start
```

or

```bash
npm run dev
```

---

## Observe a deployment

The Health Engine automatically discovers deployed widget instances from the live registry.

```bash
curl -X POST http://localhost:3002/validation/widgets
```

Example response:

```json
{
  "healthy": false,
  "assessments": [
    {
      "instance": "usp",
      "healthy": false,
      "issues": [
        {
          "type": "enum.invalid",
          "target": "settings.mode.mobile"
        }
      ],
      "matches": [
        "enum.invalid"
      ]
    }
  ]
}
```

---

## Cron

The engine is designed to be triggered externally.

Example:

```bash
#!/bin/sh

echo "[Health] Running observation..."

curl \
  --fail \
  --silent \
  --show-error \
  -X POST \
  "$FEATURE_HEALTH_URL"

echo "[Health] Completed."
```

This allows the same service to be executed manually, during deployment, or from a scheduled job without embedding scheduling logic into the application itself.


---

## Validate Performance

The Health Engine can validate the performance of every publicly accessible page exposed by a website.

The validator discovers pages from the site's public sitemap (generated natively by Magento) and verifies that those pages are healthy from a performance perspective.

```bash
curl -X POST http://localhost:3002/validation/performance
```

Example response:

```json
[
  {
    "id": "gear",
    "label": "gear",
    "url": "https://mageos-docker.magsite.co.uk/gear.html",
    "baselineMs": 145.86,
    "verificationMs": 153.76,
    "improvementMs": -7.89,
    "baselineCacheHit": true,
    "verificationCacheHit": true,
    "healthy": true
  }
]
```

The validator reads the public sitemap configured through the application configuration, for example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset>
    <url>
        <loc>https://mageos-docker.magsite.co.uk/</loc>
    </url>

    <url>
        <loc>https://mageos-docker.magsite.co.uk/gear.html</loc>
    </url>

    <url>
        <loc>https://mageos-docker.magsite.co.uk/gear/bags.html</loc>
    </url>
</urlset>
```