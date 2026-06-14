# ReactEdge – Product Gallery Widget

An embeddable **Product Gallery widget** designed to integrate safely into existing websites without owning the page or application lifecycle.

This repository is part of the **ReactEdge** series — a collection of frontend widgets built around a consistent embedding contract, strict isolation discipline, and predictable behaviour.

---

## What this is

- A frontend widget for displaying product images
- Supports:
    - Classic gallery mode (main image + thumbnails)
    - Tiled view
    - Zoom mode with navigation
- Delivered as a **versioned IIFE JavaScript bundle**
- Integrated via a custom element
- Rendered in the **Light DOM** with scoped CSS
- Tested using Playwright in a real browser

The widget manages its own internal UI state without assuming control of the host application.

---

## What this is NOT

- ❌ A full product detail page
- ❌ A CMS
- ❌ A framework
- ❌ A design system
- ❌ A replacement for platform image handling

This widget focuses on safe, isolated delivery of image interaction behaviour.

---

## Design Principles

All ReactEdge widgets share the same architectural discipline:

### Isolation first
No global JavaScript leakage. CSS selectors are explicitly scoped.

### Reversible by design
Removing the script and custom element leaves no trace.

### Non-hostile to the host
No global resets. No DOM ownership. No theme overrides.

### Deterministic state model
A single source of truth drives:
- Active image index
- View mode (classic / tiled)
- Zoom state

### Minimal surface area
Only required interaction behaviour is implemented.

### Testable in isolation
Mounting, state transitions, and interactions validated via Playwright.

### Consistent contract across widgets
Follows the same embedding and configuration approach as other ReactEdge widgets.

### Boring on purpose
Predictable behaviour over clever abstractions.

---

## Interaction Model

The gallery operates as a deterministic UI state machine:

### View mode
- Tiled
- Classic

### Zoom mode
- Off (tiled grid)
- On (fullscreen with navigation)

### Navigation
- Thumbnail selection
- Previous / Next arrows
- Looping behaviour at boundaries

All transitions are explicit and internally managed.

---

## Embedding Contract

The widget is delivered as a standalone JavaScript file and exposed via a custom element.

### Example

```html
<script src="widget-product-gallery@x.y.z.iife.js" defer></script>

<productgallery-widget>
    <script type="application/json" data-config>
        {
          "data": {
              "images": [
                {
                  "src": "/image1.jpg",
                  "alt": "Ajax Full-Zip Sweatshirt"
                },
                {
                  "src": "/image2.jpg",
                  "alt": "Ajax Full-Zip Sweatshirt"
                },
                ...               
              ]
            }
          }
    </script>
</productgallery-widget>
```

Configuration may be provided via data attributes or a host configuration script depending on integration context.

---

## Project Structure

- `vite_project/`  
  Source code and build configuration.

- `tests/`  
  Playwright end-to-end tests validating:
    - Mount lifecycle
    - View switching
    - Thumbnail interaction
    - Arrow navigation
    - Zoom entry / exit

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
widget-product-gallery@x.y.z.iife.js
```

The widget runs as a static asset and does not require a backend runtime once built.

---

## Part of the ReactEdge Series

This repository is one of several widgets built under the same architectural model:

- USP
- Banner
- Contact
- Store Finder
- Booking

Each repository follows the same embedding contract and test discipline.
