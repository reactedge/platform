# ReactEdge -- Contact Us Widget

An isolated, open-source Contact Us widget designed to safely integrate
form handling into legacy CMS and eCommerce platforms without owning the
page or application lifecycle.

This repository is part of the ReactEdge series --- a collection of
frontend widgets built around a consistent embedding contract, strict
isolation discipline, and predictable behaviour.

------------------------------------------------------------------------

## What this is

-   A lightweight frontend contact form widget
-   Supports:
    -   Field validation
    -   Error and success states
    -   Controlled submission lifecycle
-   Delivered as a versioned IIFE JavaScript bundle
-   Integrated via a custom element
-   Rendered in the Light DOM with scoped CSS
-   Designed for safe embedding in legacy environments
-   Tested using Playwright in a real browser

The widget manages its own internal state while exposing a minimal
integration surface to the host system.

------------------------------------------------------------------------

## What this is NOT

-   ❌ A CRM
-   ❌ A marketing automation system
-   ❌ A full backend submission processor
-   ❌ A framework
-   ❌ A design system

This widget focuses on safe, isolated delivery of form interaction
behaviour.

------------------------------------------------------------------------

## Design Principles

### Isolation first

No global JavaScript leakage. CSS selectors are explicitly scoped.

### Reversible by design

Removing the script and custom element leaves no trace.

### Minimal surface area

Only required fields and behaviours are implemented.

### Testable in isolation

Mount lifecycle, validation logic, and state transitions validated via
Playwright.

### Consistent contract across widgets

Follows the same embedding and configuration approach as other ReactEdge
widgets.

------------------------------------------------------------------------

## Embedding Contract

The widget is delivered as a standalone JavaScript file and mounted via
a custom element inside a container.

### Example

``` html
<div data-widget-container="contactus"
     data-load="eager"
     data-page="contact"
     data-src="https://widget.contactus.co.uk/widget-contactus.iife.js"
>
    <contactus-widget>
        <script type="application/json" data-config>
            {
                "data": {
                    "title": "Get in touch",
                    "fields": [
                        { "name": "name", "label": "Your Name", "required": true },
                        { "name": "email", "label": "Email Address", "required": true },
                        { "name": "message", "label": "Message", "required": true }
                    ]
                }
            }
        </script>
    </contactus-widget>
</div>
```

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

This produces a versioned JavaScript artefact in the `www/` directory:

    widget-contactus@x.y.z.iife.js

The widget runs as a static asset and does not require a backend runtime
once built.

------------------------------------------------------------------------

## Part of the ReactEdge Series

This repository is one of several widgets built under the same
architectural model:

-   USP\
-   Banner\
-   Product Gallery\
-   Store Finder\
-   Region Map\
-   Booking

Each repository follows the same embedding contract and test discipline.