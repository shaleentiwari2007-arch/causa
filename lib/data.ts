// lib/data.ts — typed data-access FACADE over the Codata SDK.
// Your app code calls data.<entity>.* — NEVER call `ws` directly.
// This layer wraps lib/codata.ts (the SDK `ws`) and bakes in the quirks
// so wiring is straightforward: JSONB columns parsed, updates use the full
// object (there is no PATCH), list responses unwrapped. Re-generate after
// any schema change (it ships alongside lib/codata.ts / lib/codata.types.ts).
import { ws } from './codata';
import type { KnowledgeEntry, KnowledgeEntryInput } from './codata.types';
// Read freshness (COD-1590): every read below opts its render out of Next's
// Data Cache / static prerender. The app's earliest renders can happen BEFORE
// the platform seeds demo data — without this, that empty response can be
// captured by the cache and served forever with no error ("list renders but
// shows no data"). unstable_noStore() is a no-op outside a request scope.
import { unstable_noStore as noStore } from 'next/cache';

/** Parse a JSONB column value that may arrive as a JSON string.
 * COD-1139: the gate now returns JSONB columns as parsed JSON, so this is
 * a no-op passthrough on current workspaces — kept as a compatibility shim
 * because this facade can be re-fetched onto workspaces whose endpoint
 * bindings predate that change (regenerate to refresh them). */
function parseJsonb(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const s = value.trim();
  if (!s || (s[0] !== '[' && s[0] !== '{')) return value;
  try { return JSON.parse(s); } catch { return value; }
}

/** Normalize a row: parse the JSONB fields that may come back as strings. */
function hydrate<T>(row: Record<string, unknown> | null, jsonbFields: string[]): T | null {
  if (!row || typeof row !== 'object') return row as T | null;
  if (jsonbFields.length === 0) return row as T;
  const out: Record<string, unknown> = { ...row };
  for (const f of jsonbFields) if (f in out) out[f] = parseJsonb(out[f]);
  return out as T;
}

/** Unwrap the { data, pagination } list envelope to a plain array. */
function asRows(res: unknown): Record<string, unknown>[] {
  if (Array.isArray(res)) return res as Record<string, unknown>[];
  const data = (res as { data?: unknown })?.data;
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

// Minimal SDK surface we call. The real client lives in lib/codata.ts.
type WsLike = {
  get: (path: string, query?: Record<string, unknown>) => Promise<unknown>;
  post: (path: string, body: unknown) => Promise<unknown>;
  put: (path: string, body: unknown) => Promise<unknown>;
  delete: (path: string) => Promise<unknown>;
};
type CallAs = { sdk: WsLike; signedIn: boolean };
const asWorkspace = async (): Promise<CallAs> => ({ sdk: ws as unknown as WsLike, signedIn: true });

/**
 * Build the gate-safe query object for a list() call.
 *
 * The Codata gate STRICTLY validates query parameters and 400s any it does
 * NOT declare ("Query parameter validation failed"). It accepts:
 *   - pagination: `pageOffset` (records to skip) + `pageLimit` (1..200), and
 *   - the DECLARED filters for this endpoint (derived from its columns, e.g.
 *     name / category / price_gte / created_after — passed to `allowed`).
 * So we accept friendly pagination keys (page/pageSize/limit/offset/…),
 * translate them, FORWARD any key in `allowed`, and drop the rest. Sorting is
 * not a gate param — sort in your component after list() returns.
 */
function buildListQuery(opts?: Record<string, unknown>, allowed: string[] = []): Record<string, string> | undefined {
  if (!opts) return undefined;
  const num = (v: unknown): number | null => {
    const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
    return Number.isFinite(n) ? n : null;
  };
  const PAGINATION = new Set(['page', 'pageSize', 'limit', 'offset', 'pageOffset', 'pageLimit']);
  const q: Record<string, string> = {};
  // Page size: pageLimit | pageSize | limit (clamped 1..200).
  const sizeRaw = num(opts.pageLimit) ?? num(opts.pageSize) ?? num(opts.limit);
  const pageLimit = sizeRaw != null ? Math.min(200, Math.max(1, Math.trunc(sizeRaw))) : null;
  // Offset: explicit pageOffset | offset, else derived from a 1-based page.
  let offset = num(opts.pageOffset) ?? num(opts.offset);
  if (offset == null) {
    const page = num(opts.page);
    if (page != null && pageLimit != null) offset = Math.max(0, (Math.trunc(page) - 1) * pageLimit);
  }
  if (pageLimit != null) q.pageLimit = String(pageLimit);
  if (offset != null && offset > 0) q.pageOffset = String(Math.trunc(offset));
  // Forward declared filters (skip pagination aliases and null/undefined).
  const allow = new Set(allowed);
  for (const [k, v] of Object.entries(opts)) {
    if (PAGINATION.has(k) || !allow.has(k) || v == null) continue;
    q[k] = String(v);
  }
  return Object.keys(q).length ? q : undefined;
}

export interface Repo<T, TInput> {
  /** List records (server-side). opts takes pagination ({ page?, pageSize? } / pageOffset / pageLimit) PLUS this endpoint's declared filters (see each data.<entity>.list doc for the exact keys, e.g. { category: 'x', price_gte: 10 }). Unknown keys are dropped, not sent. Sort in your component after list(). */
  list(opts?: Record<string, unknown>): Promise<T[]>;
  /** Get one record by id, or null if not found. */
  get(id: string | number): Promise<T | null>;
  /** Create a record. UNIQUE-constrained columns (see each entity's doc below) reject duplicates with 409 — give each row a distinct value and surface the failure instead of retrying the same payload. */
  create(input: TInput): Promise<T>;
  /** Update a record. Fetches the current row and PUTs the full merged object (there is no PATCH). */
  update(id: string | number, patch: Partial<TInput>): Promise<T>;
  /** Delete a record. */
  remove(id: string | number): Promise<void>;
}

/** Which operations a signed-out visitor may perform (the spec's public endpoints). */
type Anon = { list: boolean; get: boolean; create: boolean; update: boolean; remove: boolean };
const NO_ANON: Anon = { list: false, get: false, create: false, update: false, remove: false };
const ALL: Anon = { list: true, get: true, create: true, update: true, remove: true };

function makeRepo<T, TInput>(
  collectionPath: string,
  itemPath: (id: string | number) => string,
  jsonbFields: string[],
  filterKeys: string[] = [],
  callAs: () => Promise<CallAs> = asWorkspace,
  anon: Anon = NO_ANON,
): Repo<T, TInput> {
  return {
    async list(opts) {
      noStore(); // COD-1590: never serve a cached (possibly pre-seed) read
      const who = await callAs();
      const res = await who.sdk.get(collectionPath, buildListQuery(opts, filterKeys));
      return asRows(res).map((r) => hydrate<T>(r, jsonbFields) as T);
    },
    async get(id) {
      noStore(); // COD-1590: never serve a cached (possibly pre-seed) read
      const who = await callAs();
      const res = await who.sdk.get(itemPath(id));
      return hydrate<T>(res as Record<string, unknown> | null, jsonbFields);
    },
    async create(input) {
      const who = await callAs();
      const res = await who.sdk.post(collectionPath, input);
      return hydrate<T>(res as Record<string, unknown>, jsonbFields) as T;
    },
    async update(id, patch) {
      noStore(); // COD-1590: never serve a cached (possibly pre-seed) read
      const who = await callAs();
      // No PATCH on Codata — fetch the current row, merge, PUT the full object.
      const current = (await who.sdk.get(itemPath(id))) as Record<string, unknown> | null;
      const res = await who.sdk.put(itemPath(id), { ...(current ?? {}), ...(patch as Record<string, unknown>) });
      return hydrate<T>(res as Record<string, unknown>, jsonbFields) as T;
    },
    async remove(id) {
      const who = await callAs();
      await who.sdk.delete(itemPath(id));
    },
  };
}

/**
 * Your backend. Build your app against THIS — e.g. `await data.knowledgeEntry.list()`.
 * Each entity exposes list/get/create/update/remove (only the verbs your
 * schema deployed). Keep these calls SERVER-SIDE (server components / route
 * handlers / server actions) — this module holds the secret API key.
 */
export const data = {
  /** KnowledgeEntry — list/get/create/update/remove — list() filters: id, id_in, slug, title, year, domain, description, causes, effects, chain — UNIQUE: slug (distinct per row; duplicates → 409) */
  knowledgeEntry: makeRepo<KnowledgeEntry, KnowledgeEntryInput>('/knowledgeEntries', (id) => `/knowledgeEntries/${id}`, ['causes', 'effects', 'chain'], ['id', 'id_in', 'slug', 'title', 'year', 'domain', 'description', 'causes', 'effects', 'chain']),
};
