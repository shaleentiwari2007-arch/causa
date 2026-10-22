import { useEffect, useMemo, useState } from 'react'
import { relationshipData } from '../data/relationships'

const addNeighbour = (list = [], neighbour) =>
  neighbour && !list.includes(neighbour) ? [...list, neighbour] : list

export default function CausalityGraph({ result }) {
  const chain = useMemo(() => result?.chain ?? [], [result])

  const startNode =
    result?.focus && chain.includes(result.focus) ? result.focus : chain[0] ?? null

  const [selected, setSelected] = useState(startNode)
  const [history, setHistory] = useState([])

  useEffect(() => {
    setSelected(startNode)
    setHistory([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  if (!result || chain.length === 0) return null

  const dataFor = (name) => result.nodes?.[name] ?? relationshipData[name] ?? null

  const selectedIndex = chain.indexOf(selected)
  const base = dataFor(selected)

  const selectedData = {
    type:
      base?.type ??
      (selectedIndex === 0
        ? 'ORIGIN'
        : selectedIndex === chain.length - 1
          ? 'CURRENT'
          : 'CONNECTED NODE'),
    description: base?.description ?? 'A connected point inside the current causal journey.',
    causes: addNeighbour(base?.causes, chain[selectedIndex - 1]),
    effects: addNeighbour(base?.effects, chain[selectedIndex + 1]),
  }

  const isCause = (name) => selectedData.causes.includes(name)
  const isEffect = (name) => selectedData.effects.includes(name)

  const selectNode = (name) => {
    if (name === selected || !chain.includes(name)) return

    setHistory((previous) => [...previous, selected].slice(-5))
    setSelected(name)
  }

  const goBack = () => {
    setHistory((previous) => {
      if (previous.length === 0) return previous

      const next = [...previous]
      const previousNode = next.pop()
      setSelected(previousNode)

      return next
    })
  }

  const renderLink = (name, direction) => {
    const arrow = direction === 'cause' ? <small>↳</small> : <small>↗</small>

    if (!chain.includes(name)) {
      return (
        <span key={name} className="link-outside" title="Not part of this trace">
          {direction === 'cause' && arrow}
          {name}
          {direction === 'effect' && arrow}
        </span>
      )
    }

    return (
      <button
        key={name}
        type="button"
        className={dataFor(name) ? 'has-data' : ''}
        onClick={() => selectNode(name)}
      >
        {direction === 'cause' && arrow}
        {name}
        {direction === 'effect' && arrow}
      </button>
    )
  }

  return (
    <section className="causality-graph">
      <div className="graph-header">
        <div>
          <span className="graph-kicker">CAUSAL INTELLIGENCE</span>
          <h3>TRACE THE CHAIN</h3>
        </div>

        <div className="graph-controls">
          <button
            type="button"
            className="trace-back"
            onClick={goBack}
            disabled={history.length === 0}
          >
            ← BACK
          </button>

          <div className="graph-meta">
            <span>NODES</span>
            <strong>{String(chain.length).padStart(2, '0')}</strong>
          </div>
        </div>
      </div>

      <div className="graph-stage">
        <div className="graph-grid" />
        <div className="graph-scanline" />
        <div className="graph-axis" />

        <div className="graph-track">
          {chain.map((name, index) => {
            const active = name === selected
            const connected = isCause(name) || isEffect(name)
            const past = history.includes(name)
            const next = chain[index + 1]

            return (
              <div
                key={`${name}-${index}`}
                className={`graph-node-wrapper ${active ? 'active' : ''} ${
                  connected ? 'connected' : ''
                } ${past ? 'visited' : ''}`}
              >
                {next && (
                  <div
                    className={`graph-connection ${
                      active || isCause(next) || isEffect(next) ? 'active' : ''
                    }`}
                  >
                    <span />
                  </div>
                )}

                <button type="button" className="graph-node" onClick={() => selectNode(name)}>
                  <span className="graph-node-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="graph-node-orb">
                    <span />
                  </span>

                  <span className="graph-node-label">{name}</span>
                </button>
              </div>
            )
          })}
        </div>

        <div className="graph-flow">
          <span>CAUSE</span>
          <span className="flow-line" />
          <span>CONSEQUENCE</span>
        </div>
      </div>

      <div className="graph-inspector">
        <div className="inspector-main">
          <div className="inspector-index">
            NODE {String(Math.max(selectedIndex, 0) + 1).padStart(2, '0')}
          </div>

          <span className="inspector-type">{selectedData.type}</span>

          <strong>{selected}</strong>

          <p>{selectedData.description}</p>
        </div>

        <div className="inspector-section">
          <span>WHAT CAUSED IT</span>

          <div className="inspector-links">
            {selectedData.causes.length > 0 ? (
              selectedData.causes.map((name) => renderLink(name, 'cause'))
            ) : (
              <strong className="muted">ORIGIN NODE</strong>
            )}
          </div>
        </div>

        <div className="inspector-section">
          <span>WHAT IT CAUSED</span>

          <div className="inspector-links">
            {selectedData.effects.length > 0 ? (
              selectedData.effects.map((name) => renderLink(name, 'effect'))
            ) : (
              <strong className="muted">CURRENT EDGE</strong>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}