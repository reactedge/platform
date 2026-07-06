# ReactEdge Contributor Guide

This document defines the engineering conventions for contributors and AI agents.

## Principles

- Contract-first architecture
- Interoperability over framework lock-in
- Convention over configuration
- Production-ready by default
- Keep widgets self-contained
- Security by default

---

## Branch Naming

Feature work

feat/<description>

Examples

feat/adopt-mise
feat/widget-launcher

Bug fixes

fix/<description>

Documentation

docs/<description>

Experiments

spike/<description>

Refactoring

refactor/<description>

Testing

test/<description>

Performance

perf/<description>

Maintenance

chore/<description>

---

## Commit Messages

Use Conventional Commits.

Examples

feat: adopt mise as the standard developer workflow

fix: resolve widget launcher path

docs: improve widget onboarding

---

## Widget Standards

Every widget must:

- launch standalone
- integrate into Magento
- expose a Zod contract
- export TypeScript types
- contain a README
- include sample contracts
- include automated tests

---

## Developer Workflow

Clone

```bash
git clone ...
```

Install toolchain

```bash
mise install
```

Install dependencies

```bash
mise run widgets-install
```

Launch widget

```bash
mise run widget-dev -- usp
```

---

## Coding Standards

- Strict TypeScript
- Public APIs documented
- No `any`
- Zod for runtime validation
- SSR first
- CSS isolated

---

## Documentation

Every feature must include:

- README updates
- ADR updates when architecture changes
- Examples
- Migration notes when required