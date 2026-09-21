import { useState } from 'react'

export default function CausalNode({
  label,
  index,
  active = false,
  onClick,
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      className={`causal-node ${active ? 'is-active' : ''} ${
        hovered ? 'is-hovered' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      type="button"
    >
      <span className="causal-node-index">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="causal-node-core">
        <span className="causal-node-pulse" />
        <span className="causal-node-dot" />
      </span>

      <span className="causal-node-label">
        {label}
      </span>

      <span className="causal-node-state">
        {active ? 'ACTIVE' : hovered ? 'SELECT' : 'TRACE'}
      </span>
    </button>
  )
}
