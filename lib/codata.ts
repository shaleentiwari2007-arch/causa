import { CodataClient, ApiError } from 'codata-io';

// CODATA_GATE_URL must be set — the SDK has no default.
// Set it in your .env file, or pass explicitly:
// new CodataClient({ apiKey: '...', gateUrl: '...' })
const gateUrl = process.env.CODATA_GATE_URL!;
const client = new CodataClient({
  apiKey: process.env.CODATA_API_KEY!,
  gateUrl,
});

const ws = client.workspace('6aafc72bf15dff653eca7c58', {
  branch: "main",
  // Codata status widget: development builds only (a production build drops the token), browser only, read-only token. Remove to opt out.
  statusWidget: process.env.NODE_ENV === "development" ? { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoic3RhdHVzLXdpZGdldCIsIndvcmtzcGFjZUlkIjoiNmFhZmM3MmJmMTVkZmY2NTNlY2E3YzU4IiwiYnJhbmNoTmFtZSI6Im1haW4iLCJpYXQiOjE3OTIwNTMxNjAsImV4cCI6MTc5NDY0NTE2MH0.A2jFB0l51I7dTuXu92oAlCKTyX3tm9ZTxc5SSGZSBDU", scriptUrl: "https://mcp.codata.io/api/widget/v1.js" } : null,
});

// Available endpoints:
// List knowledgeEntries
// await ws.get<KnowledgeEntryList>('/knowledgeEntries');  // query params: ws.get('/path', { key: 'value' })
// Get KnowledgeEntry by id
// await ws.get<KnowledgeEntry>('/knowledgeEntries/{id}');
// Create KnowledgeEntry
// await ws.post<KnowledgeEntry>('/knowledgeEntries');
// Update KnowledgeEntry
// await ws.put<KnowledgeEntry>('/knowledgeEntries/{id}');
// Delete KnowledgeEntry
// await ws.delete<KnowledgeEntry>('/knowledgeEntries/{id}');

// ── Idempotent writes (safe retries) ──────────────────────────────
// A timed-out POST may have already created the record. Reuse a stable
// key across retries so Codata returns the first response instead of
// duplicating the row (cached 24h). See codata://platform/sdk-integration.
//
//   const idempotencyKey = crypto.randomUUID(); // one key per logical write
//   const created = await ws.post('/orders', body, {
//     headers: { 'Idempotency-Key': idempotencyKey },
//   });
//   // Retrying with the SAME idempotencyKey returns the same record — no duplicate.

/**
 * Convert a Codata SDK error into an HTTP response payload that preserves
 * the upstream status. Use in framework route catch blocks — NEVER hardcode
 * res.status(502) when the SDK throws, or you will mask 4xx validation
 * failures (duplicate field, FK violation, missing required field, schema
 * rejection) as infrastructure errors at the browser.
 *
 * Example (Next.js / Express):
 *   try { return Response.json(await ws.post('/users', body)); }
 *   catch (e) {
 *     const { status, body } = toHttpResponse(e);
 *     return Response.json(body, { status });
 *   }
 */
export function toHttpResponse(error: unknown): {
  status: number;
  body: { error: string; message: string; details?: unknown };
} {
  if (error instanceof ApiError) {
    // 4xx → forward verbatim. 5xx → 502 (gateway boundary is the honest
    // signal: Codata failed, not this app).
    const status = error.status >= 500 ? 502 : error.status;
    const details = (error.body && typeof error.body === 'object' && !Array.isArray(error.body))
      ? error.body
      : undefined;
    return {
      status,
      body: {
        error: error.name,
        message: error.message,
        ...(details !== undefined ? { details } : {}),
      },
    };
  }
  return {
    status: 500,
    body: { error: 'InternalError', message: error instanceof Error ? error.message : 'Unexpected error' },
  };
}

// ── Caller identity (COD-1358 / COD-1367) ─────────────────────────
// `ws` carries the WORKSPACE API KEY: the OPERATOR — every row of every
// table, no visibility applied. NEVER use it to serve a request on behalf of
// an end user. `callerWorkspace()` is built from the caller's own token:
// Codata then returns only the rows each table's visibility lets that person
// see (private: their own; shared: every row, only their own editable).
// lib/data.ts already does this for every data.* call.
const stripBearer = (credential: string) => credential.replace(/^Bearer\s+/i, '');

export function callerWorkspace(credential: string) {
  const callerClient = new CodataClient({
    apiKey: stripBearer(credential),
    gateUrl,
  });
  return callerClient.workspace('6aafc72bf15dff653eca7c58', { branch: "main" });
}

export { client, ws };