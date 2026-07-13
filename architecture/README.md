# ReactEdge – Embedding Architecture

This repository defines the architectural standards that govern how ReactEdge capabilities are embedded into third-party systems (Magento, WordPress, static sites, etc.).

It does not contain widget implementations.

It defines the rules they must follow.

---

## Purpose

ReactEdge capabilities are designed to operate inside uncontrolled host environments.

Those environments:
- Own global CSS
- Control layout contexts
- May introduce conflicting resets
- May evolve independently of the embedded feature
- Execute within constrained and unpredictable network conditions

Network constraints include:
- Cross-origin restrictions (CORS, preflight failures)
- Asset delivery through CDNs and intermediate proxies (e.g. caching, rewrites)
- Integrity enforcement (SRI) and script trust boundaries
- Variable latency and cold starts (edge, origin, third-party APIs)
- Cache incoherence across browser, CDN, and origin layers

This repository formalises the decisions that ensure safe, predictable embedding across both rendering and delivery boundaries.

---

## Scope

This repo documents:

- Widget contract standards
- Runtime configuration extraction rules
- DOM isolation strategy (Light DOM default)
- Shadow DOM exception policy
- CSS scoping conventions (`reactedge-<WIDGET_ID>` prefixing)
- Integration and validation boundaries
- Architectural Decision Records (ADRs)

---

## Core Principles

1. Isolation is architectural, not accidental.
2. Contracts are explicit and validated.
3. Host systems are not trusted.
4. Simplicity is preferred over theoretical purity.
5. Isolation level scales with capability complexity.

---

## DOM Strategy

Default: **Light DOM**

Used for:
- Simple and medium-complexity capabilities
- Host-aligned layout behaviour
- Easier debugging and integration

Exception: **Shadow DOM**

Used only when:
- host CSS interference creates more friction than isolation removes.
- Overlay / drawer systems
- Host CSS interference creates instability

See ADRs for formal decisions.

---

## ADR Index

ADR-0001 – Embedding Contract
Defines how configuration is extracted, validated, and frozen at the embedding boundary.

ADR-0002 – UI Contract Surface
Formalises what the host is allowed to control versus what remains internal to the capability.

ADR-0003 – DOM Isolation Strategy
Establishes Light DOM as default and defines when Shadow DOM is justified.

ADR-0004 – Network Boundary Policy
Defines when and how widgets may perform network requests.

ADR-0005 – Rendering Model
Clarifies rendering assumptions and host interaction constraints.

ADR-0006 – Independent Deployment
Ensures capabilities are versioned and deployed independently from host systems.

ADR-0007 – Load Orchestration
Defines how and when widgets are initialised and bootstrapped.

---

## Audience

This repository is intended for:

- Contributors to ReactEdge capabilities
- Integrators embedding ReactEdge features
- Architects reviewing embedding strategy
- Future maintainers

---

## Philosophy

ReactEdge is not a component library.

It is a feature-isolation system designed to modernise legacy platforms incrementally.

Embedding is the boundary.
Architecture protects the boundary.
