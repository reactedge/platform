# 0010 — Shared CDN Assets

## Status
Proposed

## Context

ReactEdge widgets now support server-side rendering (SSR) capabilities.

This introduces new operational concerns around:
- rendering orchestration
- shared static assets
- deployment consistency
- runtime separation

---

# Decision

## 1. Externalized CDN assets

Contracts and styles are removed from widget-local Vite public folders.

They are now deployed through the dedicated CDN repository:

```text
reactedge/platform/cdn
```

This includes:
- contracts
- manifests
- shared styles

Purpose:
- independent operational deployment
- cleaner widget repositories
- centralized asset governance

---

# Consequences

## Positive

- A single CDN location simplifies integration of ReactEdge widgets
- Shared asset delivery improves consistency across widgets
- Using a single CDN domain makes browser optimizations such as `preconnect` more effective
- Widget repositories become smaller and more focused on executable runtime concerns

## Negative

- Additional repository coordination
- Version compatibility concerns between:
    - widget runtime
    - CDN contracts
- Increased deployment orchestration complexity