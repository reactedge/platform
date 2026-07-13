# ADR-1: Contract & Compatibility Model

**Status:** Accepted  
**Last Updated:** 2026-02-26

---

## Context

ReactEdge widgets execute independently of host build systems and runtime state.

To remain portable and safely evolvable across platforms, the widget contract defines:

- Configuration surface
- Behavioural outputs
- Event payload structure
- Localisation boundaries

Without a strict contract model:

- Integrations silently break
- Behaviour drifts between versions
- Backward compatibility becomes unenforceable

The contract is the complete integration boundary.

---

## Decision

Each widget SHALL:

1. Consume a single JSON contract.
2. Render deterministically from:
    - Parsed contract
    - Explicit runtime configuration
3. Version all behavioural outputs (including events).
4. Support localisation exclusively via the contract.
5. Reject unknown top-level keys.
6. Guarantee backward compatibility within a major version.

Breaking structural changes require a major version increment.

---

## Contract Structure

Example:

```json
{
  "data": {},
  "runtime": {},
  "integrations": {},
  "translations": {}
}
```

### Keys

- `data`  
  Required. Business content rendered by the widget.

- `runtime`  
  Optional. Execution context (flags, environment, mode).

- `integrations`  
  Optional. Explicit external dependencies.

- `translations`  
  Optional. Localised user-facing strings (ADR-0008).

No additional top-level keys are permitted without formal revision of this ADR.

---

## Example 1 — Deterministic Rendering

### ❌ Invalid (Non-deterministic)

```ts
const id = Math.random().toString(36);
```

This changes DOM structure on every mount.  
Snapshot tests break. Host integrations fail.

### ✅ Correct

DOM structure must be a pure function of:

```json
{
  "data": {
    "items": [...]
  }
}
```

Same contract → same DOM output.

---

## Example 2 — Event Versioning Discipline

### v1 Event

```ts
reactedge:minicart:add:v1
{
  sku: "ABC-123",
  qty: 2
}
```

### ❌ Breaking Change Without Version Bump

```ts
reactedge:minicart:add
{
  productSku: "ABC-123",
  quantity: 2
}
```

Existing listeners break silently.

### ✅ Correct Versioned Evolution

```ts
reactedge:minicart:add:v2
{
  productSku: "ABC-123",
  quantity: 2
}
```

Event versioning preserves determinism per version.

---

## Example 3 — Localisation via Contract

### Contract

```json
{
  "locale": "fr-FR",
  "translations": {
    "store_found_singular": "%1 magasin trouvé",
    "store_found_plural": "%1 magasins trouvés"
  },
  "data": {
    "count": 2
  }
}
```

Widget logic:
- Selects correct key
- Substitutes value

### ❌ Forbidden

Hardcoded string inside widget:

```ts
"2 stores found"
```

Localisation is part of the contract surface.

---

## Compatibility Rules

Within a major version:

- Fields may be added (non-breaking).
- Fields may not be removed.
- Event payload structure must remain stable.
- Translation keys must not change semantics.

If contract shape changes → Major version increment required.

---

## Architectural Principle

> Configuration, behaviour, events, and localisation form a single versioned contract surface.

---

## Fallback

The widget contract is simpler to be maintained in the core system as it means less environments to handle. Using a single 
environment when developing a POC for a feature for instance, it makes sense to enable the widget to use a simpler contract.
Therefore, the contract can be also read from the DOM as a fallback mechanism to enable the widget to work without any additional 
CDN constraint. This is a practice that is built-in optionally in some widgets. This method is in exploration to be formalised systematically on 
all widgets. 

The DOM node `<script type="application/json" ${WIDGET_ID}-data-config>` is used to define a local contract.

## Consequences

### Positive

- Deterministic behaviour
- Safe upgrades
- Clear migration paths
- Portable across platforms

### Trade-offs

- Strict schema governance required
- Slightly higher versioning discipline overhead  