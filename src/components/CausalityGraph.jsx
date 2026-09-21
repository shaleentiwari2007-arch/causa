import { useEffect, useMemo, useState } from 'react'

const relationshipData = {
  'Electrical Experiments': {
    type: 'ORIGIN',
    description:
      'Early experiments with electricity created the scientific foundation for electrical communication.',
    causes: [],
    effects: ['Telegraph'],
  },

  'Morse Code': {
    type: 'ENABLER',
    description:
      'A standardized system of dots and dashes made it possible to encode language into electrical signals.',
    causes: ['Electrical Experiments'],
    effects: ['Telegraph'],
  },

  'Wired Electrical Networks': {
    type: 'INFRASTRUCTURE',
    description:
      'Wired electrical networks provided the physical infrastructure required to transmit coded messages.',
    causes: ['Electrical Experiments'],
    effects: ['Telegraph'],
  },

  Telegraph: {
    type: 'BREAKTHROUGH',
    description:
      'The telegraph transformed communication by allowing coded messages to travel rapidly across long distances.',
    causes: [
      'Electrical Experiments',
      'Morse Code',
      'Wired Electrical Networks',
    ],
    effects: ['Telephone', 'Radio'],
  },

  Telephone: {
    type: 'BREAKTHROUGH',
    description:
      'The telephone extended electrical communication from coded signals to transmitted human speech.',
    causes: ['Telegraph'],
    effects: ['Radio'],
  },

  Radio: {
    type: 'BREAKTHROUGH',
    description:
      'Radio enabled information to travel wirelessly, opening the path toward modern electronic communication.',
    causes: ['Telegraph', 'Telephone'],
    effects: ['Transistor'],
  },

  'Solid-State Physics': {
    type: 'FOUNDATION',
    description:
      'Research into solid-state materials provided the scientific foundation for semiconductor electronics.',
    causes: ['Physics', 'Materials Science'],
    effects: ['Transistor'],
  },

  Transistor: {
    type: 'FOUNDATION',
    description:
      'The transistor made electronic circuits smaller, faster, and more reliable.',
    causes: ['Radio', 'Solid-State Physics'],
    effects: ['Integrated Circuit'],
  },

  'Integrated Circuit': {
    type: 'FOUNDATION',
    description:
      'Integrated circuits placed many electronic components onto a single piece of semiconductor material.',
    causes: ['Transistor'],
    effects: ['Microprocessor'],
  },

  Microprocessor: {
    type: 'FOUNDATION',
    description:
      'The microprocessor placed central computing logic onto a compact chip.',
    causes: ['Integrated Circuit'],
    effects: ['Personal Computer', 'Smartphone'],
  },

  'Personal Computer': {
    type: 'TRANSFORMATION',
    description:
      'Personal computers brought programmable computing power from institutions into homes and workplaces.',
    causes: ['Microprocessor'],
    effects: ['Internet'],
  },

  Internet: {
    type: 'NETWORK',
    description:
      'The Internet connected independent computer networks into a global information system.',
    causes: ['Personal Computer'],
    effects: ['Smartphone'],
  },

  Smartphone: {
    type: 'CURRENT',
    description:
      'The smartphone combines computing, communication, sensors, and global connectivity into one portable device.',
    causes: ['Internet', 'Microprocessor'],
    effects: [],
  },
}

const fallbackNode = (name, chain, index) => ({
  type:
    index === 0
      ? 'ORIGIN'
      : index === chain.length - 1
        ? 'CURRENT'
        : 'CONNECTED NODE',

  description:
    'A connected point inside the current causal journey.',

  causes:
    index > 0
      ? [chain[index - 1]]
      : [],

  effects:
    index < chain.length - 1
      ? [chain[index + 1]]
      : [],
})

export default function CausalityGraph({ result }) {
  const chain = result?.chain || []

  const [selected, setSelected] = useState(
    chain[0] || null,
  )

  const [history, setHistory] = useState([])

  useEffect(() => {
    setSelected(chain[0] || null)
    setHistory([])
  }, [result])

  const nodes = useMemo(() => {
    return chain.map((name, index) => ({
      name,
      index,
    }))
  }, [chain])

  const selectedIndex = nodes.findIndex(
    (node) => node.name === selected,
  )

  const selectedData =
    relationshipData[selected] ||
    fallbackNode(
      selected,
      chain,
      selectedIndex,
    )

  const selectNode = (name) => {
    if (name === selected) return

    setHistory((previous) => {
      const next = [...previous, selected]

      return next.slice(-5)
    })

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

  const isCause = (name) =>
    selectedData.causes.includes(name)

  const isEffect = (name) =>
    selectedData.effects.includes(name)

  if (!result || chain.length === 0) {
    return null
  }

  return (
    <section className="causality-graph">

      <div className="graph-header">

        <div>
          <span className="graph-kicker">
            CAUSAL INTELLIGENCE
          </span>

          <h3>TRACE THE CHAIN</h3>
        </div>

        <div className="graph-controls">

          <button
            className="trace-back"
            onClick={goBack}
            disabled={history.length === 0}
          >
            ← BACK
          </button>

          <div className="graph-meta">
            <span>NODES</span>

            <strong>
              {String(chain.length).padStart(2, '0')}
            </strong>
          </div>

        </div>
      </div>

      <div className="graph-stage">

        <div className="graph-grid" />

        <div className="graph-scanline" />

        <div className="graph-axis" />

        <div className="graph-track">

          {nodes.map((node, index) => {

            const active =
              node.name === selected

            const connected =
              isCause(node.name) ||
              isEffect(node.name)

            const past =
              history.includes(node.name)

            return (
              <div
                key={`${node.name}-${index}`}
                className={`
                  graph-node-wrapper
                  ${active ? 'active' : ''}
                  ${connected ? 'connected' : ''}
                  ${past ? 'visited' : ''}
                `}
              >

                {index < nodes.length - 1 && (
                  <div
                    className={`
                      graph-connection
                      ${
                        active ||
                        isCause(nodes[index + 1].name) ||
                        isEffect(nodes[index + 1].name)
                          ? 'active'
                          : ''
                      }
                    `}
                  >
                    <span />
                  </div>
                )}

                <button
                  className="graph-node"
                  onClick={() =>
                    selectNode(node.name)
                  }
                >

                  <span className="graph-node-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="graph-node-orb">
                    <span />
                  </span>

                  <span className="graph-node-label">
                    {node.name}
                  </span>

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
            NODE {String(selectedIndex + 1).padStart(2, '0')}
          </div>

          <span className="inspector-type">
            {selectedData.type}
          </span>

          <strong>{selected}</strong>

          <p>
            {selectedData.description}
          </p>

        </div>

        <div className="inspector-section">

          <span>WHAT CAUSED IT</span>

          <div className="inspector-links">

            {selectedData.causes.length > 0 ? (
              selectedData.causes.map((cause) => (

                <button
                  key={cause}
                  className={
                    relationshipData[cause]
                      ? 'has-data'
                      : ''
                  }
                  onClick={() =>
                    selectNode(cause)
                  }
                >
                  <small>↳</small>
                  {cause}
                </button>

              ))
            ) : (
              <strong className="muted">
                ORIGIN NODE
              </strong>
            )}

          </div>

        </div>

        <div className="inspector-section">

          <span>WHAT IT CAUSED</span>

          <div className="inspector-links">

            {selectedData.effects.length > 0 ? (
              selectedData.effects.map((effect) => (

                <button
                  key={effect}
                  className={
                    relationshipData[effect]
                      ? 'has-data'
                      : ''
                  }
                  onClick={() =>
                    selectNode(effect)
                  }
                >
                  {effect}
                  <small>↗</small>
                </button>

              ))
            ) : (
              <strong className="muted">
                CURRENT EDGE
              </strong>
            )}

          </div>

        </div>

      </div>

    </section>
  )
}