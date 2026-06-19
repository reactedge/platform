# ReactEdge Feature Health Engine

The Feature Health Engine continuously validates deployed ReactEdge widget configurations.

Rather than validating source files, it observes the live deployment, discovers every deployed widget instance, validates each contract using the widget's own schema and reports any detected health issues.

## Features

* Observe deployed widget instances
* Validate live widget contracts
* Normalize validation failures into Health Issues
* Match Health Rules
* Foundation for autonomous remediation

---

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
curl -X POST http://localhost:3002/observe
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

## Observation Pipeline

```text
Observe Deployment
        ↓
Load Registry
        ↓
Resolve Widget
        ↓
Validate Contract
        ↓
Normalize Health Issues
        ↓
Match Rules
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
