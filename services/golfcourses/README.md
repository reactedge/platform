# Golf Courses

Small Express service that finds UK golf clubs near a postcode. It resolves the
postcode with [postcodes.io](https://postcodes.io/), then queries the UK Golf
API's nearby clubs endpoint. Search radius is supplied in miles; the upstream
API receives kilometres and results include `distance_miles` for display.

## Configure and run

Set `RAPIDAPI_KEY` in this service's `.env` file. The key is issued by the UK
Golf API's [RapidAPI listing](https://rapidapi.com/). Copy `.env.sample` to
`.env`, then run from the ReactEdge repository root:

```bash
npm ci --prefix services/golfcourses
npm start --prefix services/golfcourses
```

The service listens on port **4181** by default. `PORT` changes the port and
`FRONTEND_URL` is a comma-separated list of browser origins allowed by CORS.
`GOLF_API_URL` and `POSTCODE_API_URL` can override the provider URLs for local
testing or an approved replacement provider. The RapidAPI key stays on the
server and is never included in browser responses.

The provider's free tier is documented as 200 requests per month with a
5-request-per-minute limit. Applications should avoid firing repeated searches
for every keystroke and should debounce postcode/radius input.

## Routes

| Method | Path | Query | Result |
| --- | --- | --- | --- |
| GET | `/golfcourses/status` | — | `{ "status": "ok" }` |
| GET | `/golfcourses/nearby` | `postcode`, optional `radius_miles` | Nearby golf clubs, nearest first |

Example:

```text
GET http://127.0.0.1:4181/golfcourses/nearby?postcode=GU25%204LH&radius_miles=10
```

`radius_miles` defaults to 10 and must be greater than 0 and at most 100. The
response shape is:

```json
{
  "postcode": "GU25 4LH",
  "radius_miles": 10,
  "total": 3,
  "courses": [
    {"id": "...", "name": "Wentworth Club", "distance_km": 3.2, "distance_miles": 2.0}
  ]
}
```

Invalid or unrecognised postcodes return `400`. Missing API credentials return
`503`; provider failures return a sanitized error and an appropriate `502` or
`503` status.

## Validate

```bash
npm run typecheck --prefix services/golfcourses
npm test --prefix services/golfcourses
```
