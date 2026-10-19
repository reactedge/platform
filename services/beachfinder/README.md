# Beach Finder

Express service with request-scoped OpenTelemetry tracing. `GET /beachfinder/beaches`
accepts a UK postcode and search radius in miles, then returns named and unnamed
OpenStreetMap beach features in range. Distances are straight-line distances.

## Search contract

```http
GET /beachfinder/beaches?postcode=BN1%201AA&radiusMiles=10
```

Successful responses have `{postcode, radiusMiles, beaches}`. Each beach has
`id`, `name`, `latitude`, `longitude`, and `distanceMiles`. Invalid query values
return `400`, unknown postcodes return `404`, and upstream failures return
`502`. Radius must be greater than 0 and at most 100 miles.

Postcode coordinates come from Postcodes.io. Beach features come from the
OpenStreetMap Overpass API; the provider URLs can be changed with
`POSTCODE_API_URL` and `OVERPASS_API_URL`. Results reflect OpenStreetMap data
and may be incomplete. The widget should display the returned distance and
attribute map data to OpenStreetMap.

## Run

```bash
cp .env.sample .env
npm install
npm start
```

Verify the example route:

```bash
curl --fail http://localhost:4185/beachfinder/status
```

Run checks with `npm test`, `npm run typecheck`, and `npm run build`.

The trace contains a `beachfinder.request` parent span and a
`beachfinder.status` route span.
