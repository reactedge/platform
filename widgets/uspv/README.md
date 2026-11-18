# ReactEdge – USPV widget

USPV shows a store's unique selling propositions one at a time, with the
USP widget's mobile slider visual at every width. The contract timer
(`settings.timer`) rotates the slides; using the left or right arrow stops
the timer for good, and rotation pauses while keyboard focus is inside the
widget. UI labels can be translated through the contract (`translations`,
same mechanism as the store finder; see `public/fr.json`).

Vertical navigation (the "V") is deferred: see "Deferred: vertical
navigation" in `.codex/agents/uspv-agent.toml`.

## Checks

From the platform root:

```bash
mise run widget-build -- uspv            # structure validation + build
mise run widget-test -- uspv             # Playwright: slider, translations, height
widgets/uspv/tests/height-before-after.sh  # slide clipping before/after report
```

## Decision: `zod/mini` with `jitless` for contract validation

**Why `jitless`.** Zod 4 decides whether it may JIT-compile object
parsers by calling `Function("")`. Under a Content-Security-Policy without
`'unsafe-eval'`, the browser blocks that probe and reports a `script-src`
violation on every page load. Zod then falls back to its normal parser, so
the widget works, but CSP reports fill with noise and eval-free pages look
non-compliant. `z.config({ jitless: true })` turns the probe and the JIT
path off. Measured with a strict CSP (`script-src 'self'`): classic Zod,
1 violation; `zod/mini`, 0; `zod/mini` + `jitless`, 0. With `zod/mini`
the probe is already gone for this schema, so `jitless` is defence in
depth that keeps the widget clean if a JIT-capable construct or classic
Zod comes back.

**Why `zod/mini`.** It is the same validation core behind tree-shakable
functions instead of chained methods. The USPV bundle went from
278,113 to 214,626 bytes minified (−23%) and from 83.9 KB to 66.8 KB
gzipped (−20%). The contract rules and results did not change: a
20-case check (valid contracts, every bound, wrong types, unknown keys)
gave identical success/failure, issue codes, paths and defaults.
`.parse()` and `.safeParse()` remain, so the self-healing contract
workflow is unaffected.

**Consumer fix this required.** Errors thrown by `zod/mini` are not
instances of classic `ZodError`. The orchestrator's contract validator
checked `instanceof ZodError` and would report a `zod/mini` failure as
one opaque `widget_validation_failed` issue. It now checks the core
`$ZodError`, which matches classic and mini errors alike (commit
`f3f208c`).

## Roll-out to the other widgets

Survey of the other 17 buildable widgets (production builds of this
branch at commit `15e6e32`; `widgets/integration` has no package and
was skipped): every bundle contains classic Zod (17–25% of the bundle)
and the `Function("")` probe, and none sets `jitless`. Each one therefore
raises the same CSP violation under a strict policy.

**`jitless`: roll out to all widgets.** It is one line in each
widget's `ConfigSchema.ts`, changes no validation result, and removes the
violation. Also add it to the `ConfigSchema.ts` files of
`packages/widget-template` so new widgets start compliant (that file is
widget-specific, so existing widgets stay structurally valid). Note that
`z.config` is global per Zod instance: in the browser each widget bundles
its own copy, but in a Node process that renders several widgets (SSR),
one call switches JIT off for all of them. That costs nothing in
practice (contracts are parsed once per render), but it is a reason to
set it everywhere rather than in some widgets only.

**`zod/mini`: roll out progressively, one widget at a time.** The
expected saving is of the same order as USPV's (about 60 KB minified and
17 KB gzipped per widget, to be measured per widget), and every API the
widgets use has a `zod/mini` equivalent. The risk is in the rewrite,
not in the library, so each migration should repeat the USPV
equivalence check before merging.

| Effort | Widgets | Classic APIs to map |
|---|---|---|
| Low (direct rewrite) | banner, categoryfaq, categoryfeatured, imagezoom, usp, sizeguide, megamenu, googlereviews, sellerfinder, storefinder, regionmap, intentdiscovery | `z.record`, `z.lazy`, `z.literal`, `z.tuple`, `z.url`, `.regex()` |
| Medium (semantic mapping) | cmsblock, createlisting, golfcoursefinder, productgallery, quote | `.passthrough()` → `z.looseObject`, `.extend()` → `z.extend`, `.transform()` → `z.pipe` + `z.transform`, `z.discriminatedUnion` |

A larger, separate saving remains available: every widget also bundles
its own React-DOM and Zod. Sharing them across widgets would cut more
than any per-widget change, and is worth assessing before the medium
tier is migrated.
