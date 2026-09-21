export function KnowledgeGraph() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.28]"
      aria-hidden="true"
    >
      <line x1="10%" y1="20%" x2="30%" y2="40%" className="knowledge-graph-line" />
      <line x1="30%" y1="40%" x2="55%" y2="25%" className="knowledge-graph-line" />
      <line x1="55%" y1="25%" x2="75%" y2="45%" className="knowledge-graph-line" />
      <line x1="75%" y1="45%" x2="90%" y2="30%" className="knowledge-graph-line" />
      <line x1="20%" y1="70%" x2="45%" y2="55%" className="knowledge-graph-line" />
      <line x1="45%" y1="55%" x2="70%" y2="75%" className="knowledge-graph-line" />
      <line x1="30%" y1="40%" x2="45%" y2="55%" className="knowledge-graph-line" />
      <circle cx="10%" cy="20%" r="2" fill="rgba(99,102,241,0.35)" />
      <circle cx="30%" cy="40%" r="2.5" fill="rgba(99,102,241,0.45)" />
      <circle cx="55%" cy="25%" r="2" fill="rgba(139,92,246,0.4)" />
      <circle cx="75%" cy="45%" r="2" fill="rgba(99,102,241,0.35)" />
      <circle cx="45%" cy="55%" r="2.5" fill="rgba(139,92,246,0.45)" />
      <circle cx="70%" cy="75%" r="2" fill="rgba(99,102,241,0.35)" />
    </svg>
  );
}
