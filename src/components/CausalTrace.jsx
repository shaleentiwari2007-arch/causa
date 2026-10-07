import { useEffect, useMemo, useState } from 'react'

import CausalNode from './CausalNode'
import CausalConnections from './CausalConnections'

export default function CausalTrace({ result }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const chain = useMemo(() => {
    return result?.chain ?? []
  }, [result])

  useEffect(() => {
    setActiveIndex(0)
  }, [result])

  if (!result || chain.length === 0) {
    return null
  }

  const activeItem = chain[activeIndex]
  const activeNode = result.nodes?.[activeItem]

  const previousItem =
    activeIndex > 0 ? chain[activeIndex - 1] : null

  const nextItem =
    activeIndex < chain.length - 1
      ? chain[activeIndex + 1]
      : null

  const goBack = () => {
    setActiveIndex((current) => Math.max(0, current - 1))
  }

  const goForward = () => {
    setActiveIndex((current) =>
      Math.min(chain.length - 1, current + 1),
    )
  }

  return (
    <section className="causal-trace">
      <div className="causal-trace-header">
        <div>
          <span className="causal-trace-kicker">
            CAUSALITY MAP
          </span>

          <h4>TRACE THE CHAIN</h4>
        </div>

        <div className="causal-trace-count">
          {String(chain.length).padStart(2, '0')} NODES
        </div>
      </div>

      <div className="causal-trace-stage">
        <CausalConnections
          count={chain.length}
          activeIndex={activeIndex}
        />

        <div
          className="causal-energy"
          style={{
            '--energy-progress':
              chain.length > 1
                ? `${(activeIndex / (chain.length - 1)) * 100}%`
                : '0%',
          }}
        />

        <div
          className="causal-node-row"
          style={{
            '--causal-node-count': chain.length,
          }}
        >
          {chain.map((item, index) => (
            <CausalNode
              key={`${item}-${index}`}
              label={item}
              index={index}
              active={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="causal-focus">
        <div className="causal-focus-index">
          {String(activeIndex + 1).padStart(2, '0')}
        </div>

        <div className="causal-focus-content">
          <div className="causal-signal">
            <span className="causal-signal-dot" />
            <span>CAUSAL SIGNAL ACTIVE</span>
          </div>

          <span className="causal-focus-label">
            ACTIVE CAUSAL NODE
          </span>

          <strong>{activeItem}</strong>

          {activeNode && (
            <>
              <div className="causal-node-meta">
                <span>{activeNode.era}</span>
                <span>{activeNode.type}</span>
              </div>

              <p>{activeNode.description}</p>
            </>
          )}
        </div>

        <div className="causal-navigation">
          <button
            type="button"
            onClick={goBack}
            disabled={activeIndex === 0}
          >
            ← BACK
          </button>

          <button
            type="button"
            onClick={goForward}
            disabled={activeIndex === chain.length - 1}
          >
            FORWARD →
          </button>
        </div>
      </div>

      <div className="causal-links">
        <div className="causal-link-card">
          <span>WHAT CAME BEFORE</span>

          <strong>
            {previousItem || 'ORIGIN POINT'}
          </strong>
        </div>

        <div className="causal-link-arrow">
          →
        </div>

        <div className="causal-link-card causal-link-card-active">
          <span>CURRENT NODE</span>

          <strong>{activeItem}</strong>
        </div>

        <div className="causal-link-arrow">
          →
        </div>

        <div className="causal-link-card">
          <span>WHAT CAME NEXT</span>

          <strong>
            {nextItem || 'END OF TRACE'}
          </strong>
        </div>
      </div>
    </section>
  )
}