# ReactEdge – Region Map Widget

An embeddable **Region Map widget** designed to integrate safely into existing websites without owning the page or application lifecycle.

This repository is part of the **ReactEdge** series — a collection of frontend widgets built around a consistent embedding contract, strict isolation discipline, and predictable behaviour.

---

## What this is

- A frontend widget for displaying a geographic region using Google Maps
- Supports:
    - Configurable center and zoom level
    - Polygon region rendering
    - Optional title display
- Delivered as a **versioned IIFE JavaScript bundle**
- Integrated via a custom element
- Rendered in the **Light DOM** with scoped CSS
- Demonstrates safe isolation of third-party SDKs (Google Maps)
- Tested using Playwright in a real browser

The widget encapsulates Google Maps integration while exposing a minimal, controlled surface to the host page.

---

## What this is NOT

- ❌ A full GIS system
- ❌ A routing or directions engine
- ❌ A CMS
- ❌ A framework
- ❌ A replacement for backend geospatial logic

This widget focuses on safe, isolated rendering of a defined geographic region.

---

## Design Principles

All ReactEdge widgets share the same architectural discipline:

### Isolation first
No global JavaScript leakage. CSS selectors are explicitly scoped.

### Reversible by design
Removing the script and custom element leaves no trace.

### Minimal surface area
Only required configuration is accepted.

### Testable in isolation
Mounting, configuration mapping, and conditional rendering validated via Playwright.

### Consistent contract across widgets
Follows the same embedding and configuration approach as other ReactEdge widgets.

---

## Embedding Contract

The widget is delivered as a standalone JavaScript file and mounted via a custom element inside a container.

### Example

```html
<div data-widget-container="regionmap"
     data-load="eager"
     data-page="home"
     data-src="https://widget.regionmap.co.uk/widget-regionmap.iife.js"
>
    <regionmap-widget>
        <script type="application/json" data-config>
            {
                "data": {
                    "title": "Working area",
                    "center": { "lat": 50.72, "lng": -1.98 },
                    "zoom": 10,
                    "region": [
                        { "lat": 50.75, "lng": -2.00 },
                        { "lat": 50.78, "lng": -1.97 },
                        { "lat": 50.70, "lng": -1.90 },
                        { "lat": 50.68, "lng": -1.95 }
                    ]
                },
                "integration": {
                    "requires": ["googleMaps"]
                }
            }
        </script>
    </regionmap-widget>
</div>

<script type="application/json" id="reactedge-runtime">
    {
        "integrations": {
            "googleMaps": {
                "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
            }
        }
    }
</script>
```

---

## Runtime Integration

This widget requires the `googleMaps` integration to be defined in the shared ReactEdge runtime configuration.

The runtime configuration allows multiple widgets to share external SDK configuration without coupling directly to implementation details.

---

## Project Structure

- `vite_project/`  
  Source code and build configuration.

- `tests/`  
  Playwright end-to-end tests validating:
    - Mount lifecycle
    - Title rendering
    - Conditional region rendering
    - Safe behaviour when region is missing

- `docker/` and `docker-compose.yml`  
  Optional local development tooling.

- `.github/`  
  CI workflows and repository metadata.

- `www/`  
  Generated build artefacts (not committed).

---

## Local Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
cd vite_project
npm install
npm run dev
```

Run tests:

```bash
npx playwright test --config=tests/playwright.dev.config.ts
```

---

## Building for Production

From `vite_project`:

```bash
npm run build
```

This produces a versioned JavaScript artefact in the `www/` directory:

```
widget-regionmap@x.y.z.iife.js
```

The widget runs as a static asset and does not require a backend runtime once built.

---

## Part of the ReactEdge Series

This repository is one of several widgets built under the sam