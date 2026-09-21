import { useMemo, useState } from 'react'
import CausalNode from './CausalNode'
import CausalConnections from './CausalConnections'

export default function CausalTrace({ result }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const chain = useMemo(() => {
    return result?.chain ?? []
  }, [result])

  if (!result || chain.length === 0) {
    return null
  }

  const activeItem = chain[activeIndex]

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

        <div className="causal-node-row">
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
          <span>ACTIVE CAUSAL NODE</span>

          <strong>{activeItem}</strong>

          <p>
            Explore this point in the causal chain and trace
            how it connects to what came before and what came after.
          </p>
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
    </section>
  )
}