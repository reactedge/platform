# 0011 — Server-Side Rendering Strategy for ReactEdge Widgets

## Status

Proposed

---

# Context

ReactEdge widgets support both:
- client-side rendering (CSR)
- server-side rendering (SSR)

SSR is introduced to:
- reduce perceived latency
- improve initial rendering performance
- improve layout stability during hydration
- prepare widgets for SEO-sensitive and performance-sensitive integrations

The architecture must support:
- static SSR generation
- dynamic SSR rendering
- low-latency delivery
- progressive hydration

At the same time, widgets remain independently deployable and must continue supporting CSR-only execution where SSR is not available.

---

# Decision

## 1. Dedicated SSR rendering layer

Each widget exposes a dedicated SSR rendering entrypoint:

```text
src/ssr/
```

Purpose:
- isolate SSR execution concerns from browser runtime logic
- support independent rendering strategies
- allow widgets to execute in either:
  - SSR mode
  - CSR-only mode

SSR rendering is treated as an optional capability of the widget runtime rather than a mandatory execution path.

---

## 2. Static and dynamic SSR modes

ReactEdge supports two SSR generation strategies.

### Static SSR

Static SSR allows widgets to generate deterministic HTML fragments ahead of runtime execution.

Typical use cases:
- banners
- static navigational structures
- predictable landing page fragments
- low-change marketing content

Characteristics:
- pre-generated
- cache-friendly
- low runtime cost
- predictable latency

---

### Dynamic SSR

Dynamic SSR allows widgets to render against runtime payloads and external integrations.

Typical use cases:
- contextual navigation
- customer-aware rendering
- search-driven experiences
- integration-aware widgets

Characteristics:
- runtime rendering
- request-aware execution
- integration-aware rendering
- higher operational complexity

---

## 3. SSR-compatible critical CSS delivery

Widgets may expose SSR-compatible critical CSS fragments alongside rendered SSR output.

Purpose:
- reduce first paint latency
- reduce layout shift during hydration
- improve perceived rendering stability

Current implementation couples critical CSS generation to the CSR runtime pipeline.

This is not considered ideal long term because:
- SSR rendering and CSR asset generation remain partially coupled
- critical CSS generation still depends on browser-oriented build artifacts

However, this approach currently provides:
- a consistent method to deliver SSR and hydration assets together
- predictable rendering behavior
- low-latency initial rendering delivery

The architecture intentionally accepts this compromise while SSR strategies continue to evolve.

---

# Consequences

## Positive

- Widgets can operate in SSR or CSR mode independently
- Static SSR reduces runtime rendering cost
- Dynamic SSR enables runtime-aware rendering strategies
- Critical CSS delivery improves initial rendering latency
- Hydration behavior becomes more visually stable
- SSR capabilities remain optional and composable per widget

---

## Negative

- SSR introduces additional operational complexity
- Dynamic SSR increases runtime dependency surface
- Static and dynamic SSR strategies require different caching approaches
- Critical CSS remains partially coupled to CSR asset generation
- Widget rendering behavior may differ between:
  - SSR execution
  - CSR hydration
- Additional observability may become necessary to diagnose SSR degradation

---

# Future considerations

Potential future evolution areas include:
- decoupled SSR-specific critical CSS generation
- streaming SSR strategies
- fallback SSR rendering modes
- partial hydration
- SSR degradation strategies
- runtime observability and self-healing behavior
- contract-aware rendering optimization
