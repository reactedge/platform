# EV Charger Finder service

Express API that resolves UK postcodes with Postcodes.io and searches nearby
charging locations with Open Charge Map. Provider integration and response
normalization live in the service so the widget calls one stable endpoint.

Copy `.env.sample` to `.env` and optionally set `OCM_API_KEY`. The service
listens on port 4182 by default. `FRONTEND_URL` is a comma-separated CORS
allowlist; provider URLs, port and OpenTelemetry settings can be overridden
through the environment. The OCM key is sent only to Open Charge Map and is
never included in responses.

## Routes

| Method | Path | Query | Result |
| --- | --- | --- | --- |
| GET | `/evchargers/status` | — | `{ "status": "ok" }` |
| GET | `/evchargers/nearby` | `postcode`, `radiusKm` (5, 10, 25 or 50) | `{ center, stations }` |

Each station includes its address, coordinates, connector types and power,
operational status, and distance in kilometres. Open Charge Map reports
operational status rather than live connector occupancy.

## Run and validate

```bash
npm ci --prefix services/evchargerfinder
npm start --prefix services/evchargerfinder
npm run typecheck --prefix services/evchargerfinder
npm test --prefix services/evchargerfinder
```

Invalid postcodes or radii return 400. Upstream failures return sanitized 502
responses, upstream rate limits return 503, and upstream request timeouts return
504.
