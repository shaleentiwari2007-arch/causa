// lib/spec.ts — GENERATED workspace spec (assets + endpoints).
// The shell's client-side asset proxy (app/api/[asset]/**) + resolver
// (lib/api.ts) read this at request time so dataClient(<Asset>) works.
// Overwrites the placeholder stub; regenerate after spec changes.

export interface SpecField { name: string; storageRef?: 'id'; storageAsset?: string; }
export interface SpecAsset { name: string; category?: string; visibility?: string; fields?: SpecField[]; }
export interface SpecEndpoint { method: string; path: string; operationId?: string; }
export interface Spec { assets: SpecAsset[]; endpoints: SpecEndpoint[]; }

export const spec: Spec = {
  "assets": [
    {
      "name": "KnowledgeEntry",
      "category": "TABLE"
    }
  ],
  "endpoints": [
    {
      "method": "GET",
      "path": "/knowledgeEntries"
    },
    {
      "method": "GET",
      "path": "/knowledgeEntries/{id}"
    },
    {
      "method": "POST",
      "path": "/knowledgeEntries"
    },
    {
      "method": "PUT",
      "path": "/knowledgeEntries/{id}"
    },
    {
      "method": "DELETE",
      "path": "/knowledgeEntries/{id}"
    }
  ]
};

export default spec;
