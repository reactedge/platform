# Cmsblock

Generated Express service with request-scoped OpenTelemetry tracing.

## Run

```bash
cp .env.sample .env
npm install
npm start
```

Verify the example route:

```bash
curl --fail http://localhost:4190/cmsblock/status
```

The trace contains a `cmsblock.request` parent span and a
`cmsblock.status` route span.
