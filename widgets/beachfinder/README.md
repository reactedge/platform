# Beach Finder widget

The runtime configuration must provide the Beach Finder service base URL as
`integrations.beachfinderApi.api`. For local service development, the checked-in
runtime example points to `http://127.0.0.1:4185`; set the production service URL
in the environment's runtime configuration.

The widget calls `GET /beachfinder/beaches` with `postcode` and `radiusMiles`,
shows loading, no-results, validation, unknown-postcode, and service-error states,
and links each result to OpenStreetMap. Map data attribution is shown in the
widget footer.

Run `npm test`, `npm run build`, and `npm run lint` from this directory.
