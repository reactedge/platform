# ReactEdge — Architectural Principles

**Last Updated:** 2026-02-26

---

These principles define the enduring architectural beliefs of ReactEdge.
They guide decisions recorded in ADRs and help avoid repetition across documents.

They are not implementation details.
They are guardrails.

---

## 1. Behavioural Isolation Over Styling Isolation

Behaviour must be isolated from host systems.
Styling may integrate when beneficial.

JavaScript state, rendering logic, and behavioural outputs must remain independent of host runtime conditions.

---

## 2. Determinism Per Version

For a given contract and version, the widget must produce the same:

- DOM structure
- Behavioural outputs
- Event payloads

Randomness, implicit timing dependencies, and undeclared state are prohibited.

---

## 3. Explicit Boundaries Over Implicit Coupling

All integration surfaces must be declared explicitly:

- Configuration via contract
- External integrations declared
- Event payloads versioned

No hidden configuration.
No implicit host inference.

---

## 4. Deployment Independence by Default

Feature evolution must not require host platform deployment.

Widgets are independently versioned runtime artifacts.
Version selection is explicit.
Rollback must not require host rebuild.

---

## 5. No Hidden Dependencies

Widgets must not introduce undeclared network calls,
global state reliance, or implicit third-party integrations.

Network activity is part of the contract surface.

---

## 6. Adapters Must Not Constrain Capability

Platform adapters translate layout concerns into declarative markup.

They must not:

- Restrict multi-instance support
- Modify runtime behaviour
- Own widget state

Adapters expose capability.
They do not reduce it.

---

## 7. Contract as the Single Source of Truth

Configuration, behavioural outputs, localisation, and integrations form one versioned contract surface.

If the contract changes structurally, the version must change.

---

## 8. Minimal Orchestration Layer

The loader exists only to coordinate mounting.

It must not:

- Own validation
- Own data
- Modify host lifecycle
- Introduce hidden coupling

It is infrastructure, not application logic.

---

## Intent

These principles exist to:

- Reduce entropy in legacy systems
- Enable safe incremental modernisation
- Preserve portability across platforms
- Maintain architectural clarity as the system evolves

ADRs must align with these principles.