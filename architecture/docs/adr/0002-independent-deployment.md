
# ADR-2: Deployment & Version Governance Model

**Status:** Accepted  
**Last Updated:** 2026-03-07

---

## Context

Traditional frontend features are compiled into host platform artifacts (themes, modules, build pipelines).

This creates build-time coupling between:

- UI evolution and host deployment cycles
- Small feature changes and full platform releases
- Regression exposure and unrelated system areas

In high-entropy or legacy systems, this slows feature velocity and increases operational risk.

ReactEdge isolates frontend capability without requiring host lifecycle ownership.

---

## Decision

ReactEdge widgets SHALL:

1. Be distributed as immutable, versioned IIFE bundles.
2. Be referenced via **absolute URLs**.
3. Not rely on relative paths or same-origin assumptions.
4. Follow semantic versioning.
5. Support explicit version pinning by the host.
6. Allow rollback by referencing a previous version.
7. Not require modification of the host build pipeline.
8. Not assume ownership of host runtime state.

The host platform remains authoritative over:

- Which version is loaded
- When upgrades occur

The widget remains responsible for:

- Behavioural integrity per version
- Backward compatibility within major versions

---

## Artifact Addressability Rule

Widget bundles must be referenced via absolute URLs.

Relative paths are prohibited because they introduce:

- Host origin coupling
- Deployment topology assumptions
- Environment-specific fragility

Example (correct pattern):

```html
<script src="https://cdn.reactedge.net/storefinder/storefinder.1.2.3.iife.js"></script>
```

The deployment location may change.  
The independence principle does not.

---

## Debugging Support (Source Maps)

To support debugging within host environments, widget can expose source maps.

Source maps allow developers to inspect and debug widgets directly in browser developer tools using the original source files rather than the compiled bundle.

Rules:

- Each published bundle can provide a corresponding `.map` file. (set sourcemap: true in vite.config.ts: this should not be used in production mode)
- The source maps directly relate to 1 unique IIFE release file version

Example:

```
https://cdn.reactedge.net/storefinder/storefinder.1.2.3.iife.js
https://cdn.reactedge.net/storefinder/storefinder.1.2.3.iife.js.map
```

This enables developers to debug widget behaviour in real storefront environments without requiring access to the original build pipeline.

---

## Versioning Rules

ReactEdge follows semantic versioning:

- **Major** → Breaking contract or behavioural changes
- **Minor** → Backward compatible feature additions
- **Patch** → Bug fixes without structural change

Within a major version:

- Contract structure must remain compatible.
- Event payload versions must remain stable.
- Behaviour must remain deterministic.

---

## Rollback Discipline

Rollback is achieved by changing the referenced script version.

No host rebuild required.  
No data migration required.

Version selection is explicit and declarative.

---

## Hosting Model

Default architectural model:

- External CDN hosting with immutable versioned artifacts.

Enterprise-compatible alternatives:

- Self-hosted internal CDN
- Same-origin mirroring

Deployment independence is the architectural default.  
Hosting location is configurable.

---

## Architectural Principle

> Feature evolution must not require host platform deployment.

---

## Consequences

### Positive

- Reduced regression blast radius
- Faster feature iteration
- Independent release cadence
- Incremental modernization without replatforming

### Trade-offs

- External hosting dependency
- Strict version governance required
- Operational discipline needed for lifecycle management