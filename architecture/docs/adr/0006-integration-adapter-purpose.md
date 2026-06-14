# ADR-E: Platform Adapter Purpose & Responsibilities

**Status:** Accepted  
**Last Updated:** 2026-02-26

---

## Context

ReactEdge widgets are platform-agnostic runtime artifacts.

The Platform adapter exists solely to integrate these artifacts into the Platform layout and rendering system without altering widget runtime behaviour.

---

## Purpose of the Platform Adapter

The Platform adapter is responsible for:

1. Rendering the custom element into Platform layout / blocks.
2. Providing the widget contract (inline or referenced).
3. Selecting the widget version (script reference).
4. Positioning the widget within Platform’s layout structure.

The adapter translates Platform layout concerns into declarative widget markup.

---

## Non-Responsibilities

The Platform adapter MUST NOT:

- Modify widget runtime behaviour.
- Enforce single-instance constraints.
- Inject global configuration variables.
- Merge multiple configuration sources.
- Own widget state.
- Parse or validate contracts.
- Depend on undocumented Platform globals.

---

## Multi-Instance Rule

If the runtime supports:

```html
<storefinder-widget></storefinder-widget>
<storefinder-widget></storefinder-widget>
```

The Platform adapter must allow this without restriction.

Platform layout limitations must not reduce runtime capability.

---

## Architectural Boundary

Platform owns:

- Layout placement
- Block rendering
- Version selection decision

The widget owns:

- Rendering logic
- Behaviour
- State
- Event emission
- Contract validation

---

## Architectural Principle

> The Platform adapter is a declarative integration layer — not a behavioural owner.

---

## Consequences

### Positive

- Clear separation of concerns
- Prevents hidden Platform coupling
- Preserves cross-platform portability
- Protects multi-instance guarantees

### Trade-offs

- Requires discipline in Platform block implementation
- No Platform-specific shortcuts inside widget runtime
