<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# AGENTS.md — Codata backend

## Codata Backend Rules

This project uses **Codata** (`codata-io` SDK) as its backend — database, API, auth, and storage. Workspace: **Untitled workspace** (`6aafc72bf15dff653eca7c58`).

**Purpose:** now how to use it [then showed Codata Home: Cursor is building Untitled workspace, Connected and standing by, 0% BUILDING, waiting for the first build event]

### Environment
- Required env vars: `CODATA_API_KEY` and `CODATA_GATE_URL` (see `.env.example`).
- The SDK has no default gateway URL — it throws `NO_GATE_URL` if `CODATA_GATE_URL` is unset.
- Mint a key via the MCP tool `workspaces-createApiKey` (shown once on creation).

### Runtime secrets (third-party API keys)
- Any OTHER key the app reads via `process.env` (Stripe, OpenAI, a weather API…) is a **workspace secret**: stored in Codata's Settings → Secrets page and injected into the deployed app as a server-only env var automatically.
- Check what exists with `workspaces-listSecrets` (status `needs_value` = declared but EMPTY — treat as missing). Register a missing key with `workspaces-declareSecret` (name only), then hand the user the `settingsUrl` to enter the value — **never ask for a secret value in chat** and never hardcode one.
- Server secrets never reach an app's bundle: a deploy injects only the ones that app's code reads. Public config (a browser-visible value such as an analytics id) is NOT a secret — it lives on the app (App › Settings › Public config) under a `NEXT_PUBLIC_`/`EXPO_PUBLIC_` name, never a key — register one with `workspaces-declarePublicConfig`.
- Mirror the same keys in your local `.env` for `npm run dev` (see `.env.example`).

### SDK Usage (MANDATORY)
- Import `{ ws }` from the client module (`lib/codata.ts` or equivalent)
- Use `ws.get()`, `ws.post()`, `ws.put()`, `ws.delete()` for all data operations
- The SDK provides: automatic retry with exponential backoff, LRU response caching, `paginate()`/`paginateAll()` for lists, `batch()` for concurrent operations, and response envelope unwrapping
- **NEVER use raw `fetch`, `axios`, or HTTP clients** to call Codata endpoints — you lose retry, caching, pagination, and type safety

### Route validation (MANDATORY — no exceptions)
- These endpoints are the ONLY backend for this app. **Validate each route with a real call before relying on it** (e.g. a `GET` for lists, a test upload for file routes). Do not assume — verify.
- **NEVER substitute a local fallback** (local storage, filesystem, in-memory store, mock, or a self-invented endpoint) for any operation — uploads, persistence, auth, everything goes through these routes.
- **NEVER fake success.** If a route fails validation, surface the exact error and STOP — do not fall back to a workaround and report it as working. Partial compliance is failure.

### External touchpoints are USER DATA (MANDATORY)
- Social/chat links (Instagram, WhatsApp, Facebook, X, Telegram, Discord, YouTube), contact emails, phone numbers, and third-party API keys are **facts about the user's real world — you cannot invent them**.
- When a feature needs one and the user hasn't provided it: **ASK for the real value first**, or ship the element **disabled/hidden with a clear "add your link" note** — NEVER a live link to a guessed handle or a placeholder host. A fabricated `instagram.com/their-app-name` points real visitors at a 404 or a stranger's account the moment the app deploys.
- "Placeholder, easy to swap" is not acceptable for a LIVE link — users forget and ship it.

### Data Schema
- **KnowledgeEntry**: id?: UUID, slug: STRING, title: STRING, year?: STRING, domain: STRING, description: TEXT, causes?: ARRAY, effects?: ARRAY, chain?: ARRAY.


### API Endpoints
- `GET /knowledgeEntries` — List knowledgeEntries
- `GET /knowledgeEntries/{id}` — Get KnowledgeEntry by id
- `POST /knowledgeEntries` — Create KnowledgeEntry
- `PUT /knowledgeEntries/{id}` — Update KnowledgeEntry
- `DELETE /knowledgeEntries/{id}` — Delete KnowledgeEntry

### Reserved paths — `app/api/*` is NOT yours (COD-1323)
- app/api/* is RESERVED by Codata. A generic proxy is INJECTED there at deploy time — it forwards browser calls to the Codata gate under the workspace's proxy auth policy, attaching the workspace API key server-side only where that policy allows, so the key never reaches the client. Route handlers you author under app/api/* are dropped (never deployed), and if they were kept they would collide with the injected proxy and either shadow it or fail the build.
- The injected proxy serves `/api/[asset]` (list/create) and `/api/[asset]/[id]` (get/update/delete) for every asset in lib/spec.ts, resolving each to the workspace REST path and forwarding under the workspace's proxy auth policy. From server code (server components, actions, loaders) import the typed facade `lib/data.ts`, or `ws` from `lib/codata.ts` — both ship in the integration kit. From the browser, fetch the injected route directly: `fetch('/api/<asset>')` is same-origin and needs no helper module — but it is NOT a blanket open door. When the workspace has managed auth, non-public endpoints require the signed-in user's credential (the session that `ws.auth` sign-in from lib/codata.ts establishes rides along; anonymous calls get 401 AUTH_REQUIRED). When the workspace has NO auth service, the proxy attaches the workspace key for EVERY caller: every asset endpoint is browser-callable with no credential and ALL rows are effectively public. If that data should not be public, add managed auth to the workspace (plan_backend_change) or expose only narrow server-side reads via lib/data.ts instead of linking users at the raw asset routes. Realtime workspaces additionally get `app/api/realtime/token/route.ts` (COD-1392) — the browser's connection-token mint, which the `realtime` helper in lib/codata.ts POSTs to. It ships in the integration kit; subscribe with `realtime.subscribe(...)` and do NOT author your own mint route.
- Need data? On the server use lib/data.ts (or `ws` from lib/codata.ts); in the browser fetch the injected `/api/<asset>` route — do NOT author a route handler. Need a NEW backend endpoint or entity? Delegate it: plan_backend_change → apply_backend_plan, then re-fetch the integration kit. Need your own non-Codata serverless function? Put it under root `api/` (accepted), not app/api/*.

### Single Source of Truth
- Use TypeScript types from `codata.types.ts` — never define separate interfaces, Zod schemas, or ORM models
- Pass SDK responses directly to consumers — no mapper/adapter/transformer functions
- If the schema needs changes: delegate the change to your Codata backend worker — on the v2 MCP surface call `plan_backend_change` (describe the whole change; it designs + returns a hashed plan) then `apply_backend_plan`. Then update types via `generate_client` / the integration kit
- Do NOT add Prisma, Mongoose, Drizzle, or any ORM — Codata IS the backend
- This workspace is the home for ALL data, not just what was set up first. Any new entity, list, setting, preference, upload, or relationship a later feature needs goes in the SAME workspace (delegate it: `plan_backend_change` → `apply_backend_plan` → update types). Never reach for localStorage, in-memory state, JSON files, or a new database for "just one more thing"

### Code guidance — how to write the app on a Codata backend

Rules you can check yourself against before you publish. Each one is "never X, do Y instead"; the checklist at the end is the self-test.

1. **TypeScript, not JavaScript.** Author every app source file you write as `.ts`/`.tsx` — never `.js`/`.jsx`. Types come from the generated `lib/codata.types.ts`; never re-declare `User`, `Order`, etc., and never widen them to `any`. Before you publish, `tsc --noEmit` is clean. (A plain static site has no compile step — there, keep browser JavaScript free of every Codata call and key; see rule 3.)
2. **No secrets in client code.** `CODATA_API_KEY` and every third-party key are read ONLY in server code — server components, server actions, route handlers, root `api/` functions — as `process.env.NAME`. Never inline a key, never put one under a `NEXT_PUBLIC_`/`VITE_`/`EXPO_PUBLIC_` name, never commit `.env`. The ONE legitimate browser value is `NEXT_PUBLIC_CODATA_GATE_URL`: it is the gate's address, not a credential (the kit sets it so browser auth can reach the gate). Everything else with a public prefix is a leak — unless it is public config the app declares (rule 6), which is never a key.
3. **Data access through the generated client only.** On the server import `{ ws }` from `lib/codata.ts` or the typed facade `lib/data.ts`; in the browser call the injected `/api/<asset>` route. Never hand-roll `fetch`/`axios` against the gate, never add an ORM (Prisma, Mongoose, Drizzle), a mapper/DTO layer, or a second datastore (SQLite, JSON files, localStorage as a database).
4. **Privileged reads happen server-side.** The browser's only path to data is the injected `app/api/*` proxy. Never author route handlers under `app/api/*` (they are dropped at deploy); your own non-Codata serverless code goes under root `api/`. A page that reads data exports `export const dynamic = 'force-dynamic'` so it is never statically cached with stale or another user's rows.
5. **Validate writes, forward real errors.** Send bodies that match the endpoint schema and check required fields before the call — browser input is untrusted. In handlers wrap SDK calls with `toHttpResponse(error)` from `lib/codata.ts`; never collapse to a hardcoded 500/502, never fake success, and never put a key, token, or `.env` contents in a log line or an error response.
6. **Runtime secrets go through Codata.** A third-party key the app needs is registered by NAME with `workspaces-declareSecret`; the user enters the value at the `workspaces-getSecretsUrl` link, and it arrives as a server-only env var at deploy. Never ask for the value in chat and never write it into a file. Server secrets live on the workspace (Settings → Secrets) and never reach an app's bundle; a deploy injects only the ones that app's code reads. Public config — a value the browser or phone bundle may carry, such as an analytics id — is not a secret: it lives on the app (App › Settings › Public config) under a `NEXT_PUBLIC_`/`EXPO_PUBLIC_` name, is registered with `workspaces-declarePublicConfig`, and is never a key.
7. **The workspace is the backend, and you share it with the user.** Apps (web, mobile) are clients of one workspace: its data, sign-in, files, jobs and server secrets serve every app, while each app keeps its own screens, code and publishing. Your app tools (`publish_app`, `workspaces-pushAppFiles`, `workspaces-goLive`, `generate_client`, the hosting and store tools) act on ONE app: the workspace's only app, or the one `link_project { workspaceId, appId }` pinned for your session (`createApp: { kind, name }` adds an app you build and pins it; mobile apps are coming soon, so `kind: "mobile"` answers `MOBILE_COMING_SOON`). With several apps and no pin they answer `APP_REQUIRED` with `details.apps`; never guess, pin one. The user works in ONE Codata chat per workspace and sees you there: `link_project`, a plan, an apply or a push shows you as connected (writing while a change runs; a read such as `get_project_context` does not), and `publish_app`, `apply_backend_plan` and waives post a card from you in that chat. That chat changes the backend too. While a design it started is running, your `plan_backend_change` answers `PLAN_IN_PROGRESS` (wait, then plan again); `get_plan` without a planId may return the user's plan; and its apply changes the contract. Never code on against a client you have not re-checked: pass `haveSpecVersion` to `inspect_contract` and re-run `generate_client` when it reports stale. Codata never pushes to you: when a result's `_meta.notices` is above 0, call `get_project_context` and act on each `notices[]` entry (a secret saved, an obligation waived, a plan revised, an app created or renamed, a go-live). Each is handed over once; reading it is the acknowledgement. Your MCP calls never spend the user's credits. Work the user asks of Codata's chat does (a data answer, a backend apply, an app build); `get_project_context.credits` shows the balance read-only, so never promise the user a free Codata build.
8. **Build from the design.** If `.codata/design/` exists, build every screen from it before inventing any UI.

**Self-check before `publish_app` / `workspaces-pushAppFiles`:**
- No `.js`/`.jsx` app source you wrote; `tsc --noEmit` passes.
- `grep -rn "NEXT_PUBLIC_\|VITE_\|EXPO_PUBLIC_" app lib components` returns nothing but `NEXT_PUBLIC_CODATA_GATE_URL` and the app's declared public config (never a key).
- `grep -rn "wsk_\|CODATA_API_KEY" app components` returns nothing (the key lives only in `lib/codata.ts` and the server env).
- No `fetch(` to the gate URL outside `lib/codata.ts`; no `app/api/*` files of your own; no ORM in `package.json`.
- `inspect_contract` with your `haveSpecVersion` does not report stale, and no result since your last `get_project_context` carried `_meta.notices`, and you acted on every user line in `_meta.conversation` (what the user said in the Codata chat while you worked).

### The app's design — `codata.design.json`
Codata shows the app's design on its Settings page. Keep a `codata.design.json` at the app's root and push it with the app's other files, e.g. `{"mood":"Warm and bookish","palette":{"bg":"#fbf7f0","surface":"#f3ebdd","ink":"#2b2118","muted":"#6b5b4b","primary":"#8a3b12","onPrimary":"#ffffff","accent":"#1f5f5b","onAccent":"#ffffff"},"fonts":{"display":"Fraunces","body":"Inter"},"radius":"md","density":"regular"}`. Colours are `#rrggbb` (`success`, `warning`, `danger` are roles too); `radius` is none, sm, md or lg; `density` is compact, regular or airy; `mood` is at most 140 characters. Use the values the app really uses (its CSS variables, Tailwind theme, font imports); leave out anything it doesn't have; update the file in the same push when the design changes.

### Finishing a build — offer go-live (MANDATORY)
When the app is built and validated, do NOT end at local run steps ("npm run dev" is not a finish line). Proactively offer to take the app LIVE on Codata-managed hosting — it is one step for the user and every app gets a free Codata domain: `workspaces-pushAppFiles` (your app source) → `workspaces-goLive` → poll `workspaces-getHostingStatus` until READY, then tell the user their live URL explicitly. If the app reads external API keys from env, hand the user the `workspaces-getSecretsUrl` link BEFORE going live (Codata injects them at deploy). If the user is deploying the app themselves, skip pushAppFiles and call `workspaces-goLive` with hosting:"external" and liveUrl:"<public https URL>" once it is up, so Codata records where the app lives — Codata deploys nothing there, so the user configures the env vars (CODATA_API_KEY, third-party keys) on their own host; later updates are a redeploy on their host, re-recording the URL only if it changed.

### Reporting a Codata bug (MANDATORY)
If you hit an error or unexpected behaviour you believe is caused by **Codata itself** (not your own code), file a triage ticket instead of working around it. Treat it as a Codata-side issue when ANY of these hold:
- The HTTP status code is **5xx**, or
- The response body contains an internal error (raw Postgres error, a stack trace, `[object Object]`, etc.), or
- The endpoint behaves **inconsistently with the OpenAPI spec / integration kit**, or
- You have verified your request is valid per the spec and the error **persists across retries**.

When it is a Codata-side issue, call the MCP tool `support-createTicket` with:
- `subject` — short summary of the bug
- `description` — full description of the problem
- `workspaceId` — `6aafc72bf15dff653eca7c58`
- `branch` — the current workspace branch name
- `route` — full API route (method + path, e.g. `POST /users`)
- `request` — the exact request body + relevant headers you sent
- `response` — the full response received (status + body)
- `evidence` — plain-English reasoning for why this is a Codata bug, not your code (e.g. "spec says 201 with the full record, runtime returned 200 with only `{id}`")
- `agent` — which agent you are (e.g. "Claude Code", "Cursor", "Codex", "GitHub Copilot")

Before filing, call `support-tickets` with action `list`: if an open ticket already covers the problem, reply into it (action `reply`) instead of filing a duplicate. Use action `get` later to read the support team's reply.

These triage fields route the ticket straight to the Codata SRE team. After submitting, tell the user: "I've filed a Codata support ticket for this error. The team has been notified and will triage it." Do NOT invent a workaround or switch to another service while waiting.

## Codata status widget (dev builds only)

The Codata status widget shows the person watching your preview which Codata services run behind the app (read-only, scoped to this workspace). `lib/codata.ts` already mounts it in DEVELOPMENT builds whenever `ws` is used in the browser — nothing to add. Only if the app never imports `ws` client-side, add this tag once to the root layout / entry HTML, gated on NODE_ENV !== "production". Never in production.

```html
<script src="https://mcp.codata.io/api/widget/v1.js" data-token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoic3RhdHVzLXdpZGdldCIsIndvcmtzcGFjZUlkIjoiNmFhZmM3MmJmMTVkZmY2NTNlY2E3YzU4IiwiYnJhbmNoTmFtZSI6Im1haW4iLCJpYXQiOjE3OTIwNTMxNjAsImV4cCI6MTc5NDY0NTE2MH0.A2jFB0l51I7dTuXu92oAlCKTyX3tm9ZTxc5SSGZSBDU" async></script>
```

- Next.js `app/layout.tsx`: `{process.env.NODE_ENV !== "production" && <script src="https://mcp.codata.io/api/widget/v1.js" data-token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoic3RhdHVzLXdpZGdldCIsIndvcmtzcGFjZUlkIjoiNmFhZmM3MmJmMTVkZmY2NTNlY2E3YzU4IiwiYnJhbmNoTmFtZSI6Im1haW4iLCJpYXQiOjE3OTIwNTMxNjAsImV4cCI6MTc5NDY0NTE2MH0.A2jFB0l51I7dTuXu92oAlCKTyX3tm9ZTxc5SSGZSBDU" async />}`
- Vite / plain HTML: append the tag from `if (import.meta.env.DEV) { … }`.
- Token rejected (401)? Call `workspaces-get` for a fresh `statusWidget.snippet`.

Full workspace context: `.codata/instructions.md`
