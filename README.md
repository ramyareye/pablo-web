```txt
npm install
npm run dev
```

```txt
npm run deploy
```

## Submit UI

This is a **Cloudflare Pages** project that hosts the submission UI:

- UI routes (client-side, SPA fallback via `public/_redirects`):
  - `/` (home)
  - `/victim-report` (Victim / Killed)
  - `/detention-report` (Detained / Missing)
  - `/perpetrator-report` (Perpetrator Identification)
  - `/witness-testimony` (Witness Testimony)
- API proxy: `/api/reports/*` via **Pages Functions** (`functions/api/reports/*.ts`)

The proxy forwards multipart form submissions to the `pablo` API (Worker) at:

- `POST /api/reports/victims`
- `POST /api/reports/detentions`
- `POST /api/reports/perpetrators`
- `POST /api/reports/witnesses`

### Environment

Set `PABLO_API_URL` in your Pages project environment variables to the base URL of the deployed `pablo` API worker, e.g.
`https://pablo.<account>.workers.dev`.

For local dev (`npm run dev`), `vite` proxies `/api/*` to `PABLO_API_URL` if set, otherwise it defaults to `http://127.0.0.1:8787` (Wrangler dev default).

### Routing

SPA fallback is configured in `public/_redirects`:

- `/* /index.html 200`
