# ReactEdge -- Store Finder Widget

An isolated, open‑source Store Finder widget designed to decouple
store finder discovery functionality from legacy CMS and eCommerce
platforms.

This widget is part of the **ReactEdge** series --- a collection of
embeddable frontend widgets built around a consistent contract, strict
isolation discipline, and predictable behaviour.

------------------------------------------------------------------------

## What this is

-   An embeddable Store Finder widget
-   Displays store locations in list and map format
-   Contract‑driven configuration via
    `<storefinder-widget data-contract="/cdn/store-1.json"></storefinder-widget>`
-   Integration‑aware (Google Maps via runtime configuration)
-   Delivered as a versioned IIFE JavaScript bundle
-   Rendered in the Light DOM with scoped CSS
-   Tested using Playwright in a real browser

The widget manages its own UI state and does not assume control of the
host application lifecycle.

------------------------------------------------------------------------

## What this is NOT

-   ❌ A full eCommerce platform
-   ❌ A CMS
-   ❌ A framework
-   ❌ A replacement for Google Maps configuration
-   ❌ A backend service

This widget focuses on safe, isolated delivery of location discovery
behaviour.

## Embedding Contract

Example usage:

``` html
        {
            "data": {
                "stores": [
                    { "name": "London Central", "lat": 51.5074, "lng": -0.1278, "hours": "Mon–Sat: 9am–6pm" },
                    { "name": "Manchester Hub", "lat": 53.4808, "lng": -2.2426, "hours": "Mon–Fri: 10am–5pm" }
                ],
                "defaultCenter": { "lat": 52.3555, "lng": -1.1743 },
                "zoom": 6
            },
            "integration": {
                "requires": ["googleMaps"]
            }
        }
```

``` html
<script type="application/json" id="reactedge-runtime">
{
    "integrations": {
        "googleMaps": {
            "apiKey": "YOUR_API_KEY"
        }
    }
}
</script>
```

------------------------------------------------------------------------

## Project Structure

-   `vite_project/` -- Source code and build configuration\
-   `src/domain/` -- Domain types and models\
-   `tests/` -- Playwright end‑to‑end tests\
-   `www/` -- Generated build artefacts (not committed)\
-   `.github/` -- CI and repository metadata

------------------------------------------------------------------------

## Local Development

Install dependencies:

``` bash
npm install
```

Run locally:

``` bash
cd vite_project
npm install
npm run dev
```

Run tests:

``` bash
npx playwright test --config=tests/playwright.dev.config.ts
```

------------------------------------------------------------------------

## Building for Production

From `vite_project`:

``` bash
npm run build
```

This produces a versioned JavaScript artefact in the `www/` directory.

The widget runs as a static asset and does not require a backend runtime
once built.

------------------------------------------------------------------------

## Part of the ReactEdge Series

This repository is one of several widgets built under the same
architectural model:

-   Banner
-   USP
-   Product Gallery
-   Contact Us
-   Region Map
-   Booking

Each repository follows the same embedding contract and resolution
discipline.