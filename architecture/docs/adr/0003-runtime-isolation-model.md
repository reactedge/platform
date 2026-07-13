# ADR-3: Runtime Isolation & Contract Resolution Model

**Status:** Accepted (Revised)  
**Last Updated:** 2026-05-01

---

## Context

ReactEdge widgets execute inside heterogeneous host environments:

- Magento
- WordPress
- Static sites
- Custom CMS platforms

These environments may contain:

- Unpredictable CSS systems
- Multiple JavaScript frameworks
- Dynamic DOM mutations
- Shared global namespaces

Without strict runtime isolation, widgets risk:

- State collisions
- Event conflicts
- Multi-instance instability
- Behavioural drift across environments

---

## Decision

Widgets SHALL:

1. Maintain **instance-scoped state** (no shared singleton state).
2. Support **multiple instances per page**.
3. Use **idempotent mounting logic**.
4. Namespace and version event payloads.
5. Avoid global variable pollution.
6. Default to Light DOM, with optional Shadow DOM containment.

Behavioural isolation is mandatory.  
Styling isolation is contextual.

---

## Multi-Instance Principle

The runtime must not assume a single widget instance.

### Correct Pattern

```html
<storefinder-widget data-instance="store-1"></storefinder-widget>
<storefinder-widget data-instance="store-2"></storefinder-widget>
```

Each instance:

- Parses its own contract
- Maintains independent state
- Emits scoped, versioned events
- Does not interfere with sibling instances

Widgets are now instantiated using `data-instance` as an **alias**
- The alias maps to a contract defined in a **central registry (manifest)**

---

### Behaviour

- The runtime resolves the widget configuration using the instance alias
- The contract is no longer fetched per widget instance
- Multiple widget instances may share the same underlying contract
- Contract resolution is handled outside the DOM

---

## DOM Strategy

### Default: Light DOM

Light DOM preserves:

- Natural SEO behaviour
- Layout interoperability
- Lower integration friction

### Optional: Shadow DOM

Shadow DOM may be used when:

- Strong styling containment is required
- Host CSS is unstable
- Portability across unknown systems is prioritised

Rendering mode must not affect behavioural determinism.

---

## Event Discipline

Events are part of the behavioural contract.

Rules:

- Must be namespaced (e.g., `reactedge:storefinder:select:v1`)
- Payload structure must be versioned
- No unversioned structural changes allowed

Event collisions across instances are prohibited.

---

## Architectural Principle

> Behaviour must be isolated. Styling may integrate.

---

## Consequences

### Positive

- Reduced network overhead (no per-instance contract fetch)
- Improved performance on multi-widget pages
- Centralised configuration management
- Better alignment with orchestrated runtime model

### Trade-offs

- Implicit contract resolution reduces DOM-level transparency
- Increased reliance on runtime registry correctness
- Harder debugging if instance-to-contract mapping is unclear
- Potential for hidden coupling via shared instance aliases

---

# Roadmap

The current model introduces a runtime orchestration layer but does not yet formalise it.

The following improvements are required to stabilise and scale the system.

---

## 1. Formal Contract Resolution Rules

Define explicit resolution behaviour:

- `data-instance` MUST map to exactly one contract
- Missing or invalid instance MUST fail fast
- Contract MUST be immutable during page lifecycle

---

## 2. Registry Lifecycle Control

Introduce:

- Single registry fetch per page
- Preload or bootstrap strategy before widget mounting
- Versioned registry support

Goal:

> Deterministic contract resolution across all environments

---

## 3. Explicit Loading Strategy

Introduce `data-load` attribute:

```html
<storefinder-widget 
  data-instance="store-1"
  data-load="onscroll:300">
</storefinder-widget>
```

Planned modes:

- `critical` → immediate load (blocking)
- `eager` → immediate non-blocking load
- `onscroll:<offset>` → lazy load on viewport proximity

Goal:

> Decouple loading timing from mounting logic

---

## 4. Runtime Phases Definition

Formalise widget lifecycle:

1. **Resolve** (map instance → contract)
2. **Schedule** (apply loading strategy)
3. **Mount** (initialise widget)

Goal:

> Prevent race conditions and inconsistent behaviour

---