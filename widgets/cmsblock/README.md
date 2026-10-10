# CMSBlock complexity

Complexity analysis is shared by all ReactEdge widgets via a root-level
[mise](https://mise.jdx.dev/) task. Run from the platform root:

```bash
mise run complexity -- cmsblock
```

Replace `cmsblock` with any directory name under `widgets/`. The task uses
a pinned Lizard **1.24.1** CLI, installed automatically by mise through the
task-specific `uv`/Python environment. There is no per-widget npm complexity
script and no separate Python package installation to maintain.

The launcher analyzes whichever of `src` and `api` exist under the widget:

- Cyclomatic complexity (CCN): maximum **10** per function.
- Parameter count: maximum **5** per function.

Lizard also reports function NLOC and tokens. Investigate unusually long
functions even if their cyclomatic complexity is acceptable.

The command is run manually; it does not analyze the CMSBlock service or AI generator.
