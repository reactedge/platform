# 0007 — Widget Build Framework

## Status
Accepted

## Context

ReactEdge widgets must be compiled into lightweight browser bundles that can be dynamically loaded by host platforms such as Magento, WordPress, or static websites.

To keep widgets small, predictable, and portable across environments, the build system must remain simple and avoid unnecessary framework overhead.

## Decision

ReactEdge widgets are built using **Vite** with **TypeScript**.

Widgets are compiled into **IIFE JavaScript bundles** suitable for CDN distribution and runtime loading.

Typical output:

- widget-banner.iife.js
- widget-megamenu.iife.js
- widget-intent-discovery.iife.js

These bundles are loaded dynamically by the ReactEdge runtime loader.

## Implementation Rules

The widget build stack is defined as:

- **Vite** for bundling
- **TypeScript** for development
- **No React compilation**
- No framework-specific runtime dependencies
```bash
npm create vite@latest vite_project (React/Typescript)
cd vite_project
npm install
```

Widgets strive to remain framework-agnostic and compatible with any host platform.

## Rationale

Avoiding framework dependencies ensures:

- smaller bundle size
- predictable runtime behaviour
- easier integration across platforms
- reduced long-term maintenance risk

## Consequences

Positive:

- minimal runtime footprint
- consistent widget architecture
- simpler build and deployment pipeline

Trade-offs:

- complex UI patterns must be implemented without framework abstractions