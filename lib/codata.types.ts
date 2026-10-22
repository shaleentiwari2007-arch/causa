// Auto-generated TypeScript types from Codata workspace spec
// Re-generate by calling workspaces-getApiUsage after spec changes

export interface KnowledgeEntry {
  /** Server-generated UUID (client may supply on POST; server generates if omitted). */
  id: string; // Primary key
  /** Unique — the backend rejects duplicate values with 409. Give every row a distinct value. */
  slug: string;
  title: string;
  year?: string | null;
  domain: 'science' | 'philosophy' | 'history' | 'technology' | 'mathematics' | 'art';
  description: string;
  causes?: unknown[] | null;
  effects?: unknown[] | null;
  chain?: unknown[] | null;
}

/** Fields for creating or updating a KnowledgeEntry. Excludes server-managed timestamps. */
export type KnowledgeEntryInput = Omit<KnowledgeEntry, 'id'> & { id?: string };

// List response envelopes (runtime returns { data, pagination })
export interface KnowledgeEntryList {
  data: KnowledgeEntry[];
  pagination: {
    pageOffset: number;
    pageLimit: number;
    /** Reserved for future pagination metadata; not currently emitted by the runtime. */
    total?: number;
    /** Reserved for future pagination metadata; not currently emitted by the runtime. */
    hasMore?: boolean;
  };
}
