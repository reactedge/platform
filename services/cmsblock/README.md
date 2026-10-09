# CMSBlock vertical slice

This is a **development-only API** for the first CMSBlock end-to-end experiment.

It persists one hard-coded block, `demo`, into `data/demo.json` (ignored by git),
and uses a deterministic HTML/CSS generator in place of an AI provider.

From the platform root:

```bash
npm --prefix services/cmsblock start
npm --prefix services/cmsblock test
npm --prefix widgets/cmsblock dev
```

The widget calls `http://127.0.0.1:4190/cmsblock/blocks/demo` by default.
Set `PORT`, `CMSBLOCK_DATA_DIR`, `FRONTEND_URL` (comma-separated CORS
origins) for the API, or `VITE_CMSBLOCK_URL` when building the widget.

Flow: edit source + choose template -> **Save** -> **Generate draft** ->
**Review** -> **Approve** -> **View**. Source and approved output stay separate;
generating a new draft does not replace the last approved output.

**Do not expose this service on the public internet.** It deliberately has
no authentication, rate limiting or authorisation yet. CORS is not authentication.
Generated output is displayed inside a sandboxed iframe; a future public SSR
publisher must validate/sanitise AI-generated HTML and CSS before emitting it
into the ordinary document.

HTML input is simplified for this experiment: it is converted to text, with
up to three HTTPS image references retained. Complex HTML formatting is not
preserved by the mock generator.
