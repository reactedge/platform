## Purpose

This roadmap outlines the near-term architectural direction for ReactEdge.  
Each milestone strengthens deployment independence, contract stability, and operational safety across legacy platforms.

---

## 1. Widget Contract Discipline

**Goal:** Make widget–host interaction deterministic and governable.

- Formalise the JSON configuration schema (runtime vs settings separation).
- Enforce strict validation at runtime.
- Define clear error handling for malformed configurations.
- Establish backward compatibility rules for contract evolution.

**Outcome:**  
Widgets behave predictably across platforms and versions.

---

## 2. CDN & Version Governance

**Goal:** Decouple widget releases from host deployment cycles.

- Immutable, versioned CDN bundles.
- Explicit semantic versioning rules.
- Upgrade strategy (opt-in, version pinning supported).
- Rollback model through version targeting.

**Outcome:**  
Independent deployment

---

## 3. DOM Strategy (Light DOM vs Shadow DOM)

**Goal:** Define styling isolation intentionally.

- Clear decision matrix for Light vs Shadow DOM usage.
- Theming and CSS variable boundary rules.
- Host styling compatibility guidance.

**Outcome:**  
Isolation is deliberate and documented, not incidental.

---

## 4. Multi-Instance & Event Discipline

**Goal:** Ensure widgets can coexist safely.

- Multiple widget instances per page support.
- Scoped event naming conventions.
- No global namespace pollution.

**Outcome:**  
Widgets compose without collision or hidden coupling.

---

## 5. Observability & Failure Modes

**Goal:** Make runtime behaviour visible and resilient.

- Loading and degraded-mode UX patterns.
- Timeout handling strategy.
- Minimal, production-safe logging.

**Outcome:**  
Failures degrade gracefully instead of breaking host systems.

---

## 6. Security & Boundary Integrity

**Goal:** Avoid introducing new attack surfaces.

- Explicit CORS discipline.
- Token isolation and data minimisation.
- CSP compatibility guidelines.

**Outcome:**  
Externalised execution does not weaken host security posture.

---

## 7. Dependency & Integration Rules

**Goal:** Preserve portability across platforms.

- No reliance on host-global JavaScript state.
- Clear network dependency declaration.
- CSS scope containment rules.
- Cross-platform adapter guidelines (Magento, WordPress, others).

**Outcome:**  
Portability becomes real

---

## 8. Governance & Contribution Model

**Goal:** Ensure controlled evolution.

- ADR-first change policy.
- Version impact declaration for breaking changes.
- Deprecation and migration strategy.
- Transparent roadmap publication.

**Outcome:**  
Architectural evolution remains intentional and governed.

## 9. ADRs high level 
| ADR Name                                     | Concerns Included                                                                                                                            | Notes                                                                                                                          |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **ADR-001: Contract & Compatibility Model**  | JSON schema discipline, runtime vs settings separation, validation strategy, backward compatibility rules, deprecation policy                | Foundational. Defines how widgets evolve safely over time. If this is weak, everything is fragile.                             |
| **ADR-002: Deployment & Version Governance** | CDN distribution, immutable bundles, semver rules, version pinning, rollback strategy, cache control                                         | Core differentiator. Explains how release lifecycle is decoupled from host lifecycle.                                          |
| **ADR-003: Runtime Isolation Model**         | Light vs Shadow DOM policy, multi-instance safety, instance-scoped state, event namespacing, no global pollution                             | This defines how widgets coexist safely and remain composable.                                                                 |
| **ADR-004: Boundary & Security Discipline**  | CORS rules, token isolation, CSP compatibility, dependency rules, no host-global reliance, data minimisation                                 | Defines trust boundaries between host and widget. Prevents accidental coupling or exposure.                                    |
| **ADR-005: Load Orchestration Model**        | widget discovery, page targeting rules, runtime bootstrap, mount lifecycle, lazy loading strategy, execution order, loader responsibilities  | Defines how the ReactEdge runtime identifies, schedules, and mounts widgets on the host page. This is the core runtime engine. |
| **ADR-006: Integration & Adapter Model**     | adapter responsibilities, non-restriction principle, cross-platform abstraction, config injection pattern, observability & failure behaviour | Where Magento assumptions belong. Adapters expose capabilities without constraining the widget runtime.                        |

## What's next
| Item | Title                              | Timeline                        | Core (≤100 words)                                                                                                                                                                                                                                                                                                                               | Notes                                                                                                                                    |
| ---- | ---------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Image Compression Service          | Q2 – Exploration                | A lightweight external service that compresses and optimises images before delivery to widgets such as banners or galleries. The goal is to improve storefront performance without modifying the Magento stack itself. The service would accept an image URL or upload, return optimised variants, and integrate easily with ReactEdge widgets. | Positioned as reusable infrastructure. Could be open source. Demonstrates “external capability instead of Magento module”.               |
| 2    | PIM Mock / Middleware Reconnection | Q2 – Architecture Demonstration | A simplified PIM layer that owns the mapping between ERP structures and Magento catalogue structures. Instead of synchronising complex systems directly, ReactEdge features interact with this middleware layer. The goal is to demonstrate how integrations can be isolated and versioned, reducing risk inside Magento.                       | You already built a similar middleware two years ago. This becomes a demonstration of **integration isolation**, not a full PIM product. |
| 3    | Subscription Feature               | Q2 – Roadmap Positioning        | Add subscription commerce capability (recurring products/orders) as a composable feature that integrates with Magento without deeply modifying the platform. The objective is to show how business capabilities can evolve outside the core while remaining compatible with existing storefronts.                                               | You already built a Magento subscription module. This roadmap item shows how ReactEdge could interact with or extend it.                 |
