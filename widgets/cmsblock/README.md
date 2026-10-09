# CMSBlock complexity

Use [Lizard](https://github.com/terryyin/lizard) to keep TypeScript/TSX
function complexity low in the CMSBlock widget (service and AI generator are
explicitly outside this check).

Install once:

```bash
python -m pip install lizard==1.24.1
```

From the ReactEdge platform root, run:

```bash
npm run complexity --prefix widgets/cmsblock
```

The script checks only `widgets/cmsblock/src` and `widgets/cmsblock/api`:

- Cyclomatic complexity (CCN) must not exceed **10** per function.
- Parameter count must not exceed **5** per function.

Lizard reports function NLOC and token counts as well. Review unusually long
functions for separation of responsibilities even if their CCN is low.
For TSX, length metrics can include markup and should be interpreted accordingly.

The GitHub Actions workflow `cmsblock-complexity.yml` runs the same
command on relevant changes. No service code or generation logic is affected.
