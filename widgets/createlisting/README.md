# Listing manager

Create, rename and delete listing records with a required name of 1–50 characters. Names are trimmed; duplicate names are permitted because records have UUIDs. This widget reuses Word Editor's header and workspace styles. Records contain only `id` and `name`; there is no rich-text editor or Magento dependency.

From the repository root:

```bash
npm run dev --workspace widget-createlisting
npm run build --workspace widget-createlisting
npm run test:api --workspace widget-createlisting
```

Vite serves the widget and `/api/listings` together. Records persist in `widgets/createlisting/.data/listings.json` (ignored by Git). Set `LISTINGS_FILE` to an absolute path to choose another file. Mutations are serialized in one server process and use atomic file replacement; corrupt storage causes an error rather than being overwritten. Run one API process per file and keep the file on persistent storage.

For a deployed widget, start the API separately:

```bash
npm run start:api --workspace widget-createlisting
```

It listens on `127.0.0.1:4180` by default; `LISTINGS_HOST` and `LISTINGS_PORT` override the bind address. Route `/api/listings` on the widget's host to this service behind the host application's authentication. The API itself does not implement authentication. The contract's `settings.listingsApi` can select another same-origin path; the reverse proxy must map it to `/api/listings` upstream. Vite preview serves built assets only and does not run the API.

| Method | Path | Result |
| --- | --- | --- |
| GET | `/api/listings` | List all records |
| POST | `/api/listings` | Create with `{ "name": "Summer products" }` |
| PUT | `/api/listings/:id` | Rename with `{ "name": "Winter products" }` |
| DELETE | `/api/listings/:id` | Delete, returning 204 |

Browser tests in `tests/createlisting.spec.ts` exercise real JSON persistence, reloads, editing, delete confirmation, validation and error handling. Run them against this widget's Vite server with a dedicated `LISTINGS_FILE`; they clear records before each test. Use one Playwright worker. Do not target a store's live listing data.
