# CMSBlock

CMSBlock uses the ReactEdge runtime widget mount contract. The runtime passes
the widget contract, bootstrap data, and environment-specific integrations to
`ReactEdge_cmsblock.mount`. The widget validates the runtime service origin
from `integrations.cmsblockApi.api` and uses it for editor and view-mode API
requests. SSR bootstrap reads the published revision from the same configured
service origin.

For local development, set the runtime integration in
`public/reactedge-runtime.json`, for example:

```json
{
  "integrations": {
    "cmsblockApi": {
      "api": "http://127.0.0.1:4191"
    }
  },
  "context": {
    "storeCode": "nextjs",
    "sku": "WJ12",
    "category": "tops-men"
  }
}
```

Do not put the CMSBlock service URL in a Vite build-time variable. It belongs to
the runtime so the same built widget can be used in different environments.

## Complexity

Complexity analysis is shared by all ReactEdge widgets via a root-level
[mise](https://mise.jdx.dev/) task. Run from the platform root:

```bash
mise run complexity -- cmsblock
```

The launcher analyzes whichever of `src` and `api` exist under the widget:

- Cyclomatic complexity (CCN): maximum **10** per function.
- Parameter count: maximum **5** per function.

Lizard also reports function NLOC and tokens. Investigate unusually long
functions even if their cyclomatic complexity is acceptable.

The command is run manually; it does not analyze the CMSBlock service or AI generator.
