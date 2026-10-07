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

  'Static Electricity': {
    type: 'ORIGIN',
    description:
      'Early observations of static charge gave the first clues that electricity was a distinct, controllable force.',
    causes: [],
    effects: ['Electric Current'],
  },

  'Electric Current': {
    type: 'ENABLER',
    description:
      'Understanding the controlled flow of charge made practical electrical devices possible.',
    causes: ['Static Electricity'],
    effects: ['Electromagnetism'],
  },

  Electromagnetism: {
    type: 'FOUNDATION',
    description:
      'Discovering the link between electricity and magnetism unlocked motors and long-distance signaling.',
    causes: ['Electric Current'],
    effects: ['Telegraph'],
  },

  'Electric Power': {
    type: 'INFRASTRUCTURE',
    description:
      'Large-scale generation and distribution of electricity brought power to homes and industry alike.',
    causes: ['Telegraph'],
    effects: ['Electronics'],
  },

  Electronics: {
    type: 'FOUNDATION',
    description:
      'Circuits built to precisely control electron flow gave rise to radio, television, and computing.',
    causes: ['Electric Power'],
    effects: ['Computers'],
  },

  Computers: {
    type: 'TRANSFORMATION',
    description:
      'Programmable electronic machines could process information at a scale no prior technology could match.',
    causes: ['Electronics'],
    effects: ['Internet'],
  },

  Paper: {
    type: 'ORIGIN',
    description:
      'An inexpensive, portable writing material made mass reproduction of text feasible for the first time.',
    causes: [],
    effects: ['Movable Type'],
  },

  'Movable Type': {
    type: 'ENABLER',
    description:
      'Reusable individual characters let printers assemble and reset pages far faster than hand-copying.',
    causes: ['Paper'],
    effects: ['Printing Press'],
  },

  'Printing Press': {
    type: 'BREAKTHROUGH',
    description:
      'Mechanized reproduction of text dramatically increased the speed and scale at which ideas could spread.',
    causes: ['Paper', 'Movable Type'],
    effects: ['Mass Literacy', 'Scientific Revolution'],
  },

  'Mass Literacy': {
    type: 'TRANSFORMATION',
    description:
      'A widespread ability to read turned printed material into a tool for education and civic life.',
    causes: ['Printing Press'],
    effects: ['Modern Knowledge'],
  },

  'Scientific Revolution': {
    type: 'BREAKTHROUGH',
    description:
      'A shift toward observation and experimentation replaced tradition as the basis of knowledge.',
    causes: ['Printing Press', 'Renaissance'],
    effects: ['Enlightenment', 'Scientific Method'],
  },

  Enlightenment: {
    type: 'BREAKTHROUGH',
    description:
      'A philosophical movement that placed reason, individual rights, and skepticism of authority at the center of human thought.',
    causes: ['Scientific Revolution', 'Rationalism'],
    effects: ['Natural Rights', 'Modern Human Rights'],
  },

  'Modern Knowledge': {
    type: 'CURRENT',
    description:
      "Today's vast, widely accessible base of recorded human understanding.",
    causes: ['Mass Literacy'],
    effects: [],
  },

  Renaissance: {
    type: 'ORIGIN',
    description:
      'A revival of classical learning and inquiry set the stage for scientific and philosophical thinking.',
    causes: [],
    effects: ['Scientific Revolution'],
  },

  'Scientific Method': {
    type: 'FOUNDATION',
    description:
      'A systematic approach of observation, hypothesis, and testing became the standard for reliable knowledge.',
    causes: ['Scientific Revolution', 'Rationalism'],
    effects: ['Modern Science'],
  },

  'Modern Science': {
    type: 'FOUNDATION',
    description:
      'Organized scientific disciplines built on testable, repeatable methods.',
    causes: ['Scientific Method'],
    effects: ['Engineering'],
  },

  Engineering: {
    type: 'TRANSFORMATION',
    description:
      'Applying scientific principles to design and build practical systems and structures.',
    causes: ['Modern Science'],
    effects: ['Modern Technology'],
  },

  'Modern Technology': {
    type: 'CURRENT',
    description:
      "Today's technological tools and infrastructure, built on centuries of engineering practice.",
    causes: ['Engineering'],
    effects: [],
  },

  Rationalism: {
    type: 'ORIGIN',
    description:
      'The view that reason, not authority or tradition, is the primary source of reliable knowledge.',
    causes: [],
    effects: ['Scientific Method', 'Enlightenment'],
  },

  'Natural Rights': {
    type: 'FOUNDATION',
    description:
      'The idea that individuals possess inherent rights independent of any government.',
    causes: ['Enlightenment'],
    effects: ['Social Contract Theory'],
  },

  'Social Contract Theory': {
    type: 'FOUNDATION',
    description:
      'The idea that legitimate government derives from an agreement among the governed.',
    causes: ['Natural Rights'],
    effects: ['Democracy'],
  },

  Democracy: {
    type: 'TRANSFORMATION',
    description:
      'Governance by the consent and participation of the people.',
    causes: ['Social Contract Theory'],
    effects: ['Modern Human Rights'],
  },

  'Modern Human Rights': {
    type: 'CURRENT',
    description:
      "Today's legal and moral frameworks protecting individual freedoms worldwide.",
    causes: ['Democracy', 'Enlightenment'],
    effects: [],
  },

  'Ancient Geometry': {
    type: 'ORIGIN',
    description:
      'Early systematic study of shapes, space, and measurement.',
    causes: [],
    effects: ['Algebra'],
  },

  Algebra: {
    type: 'ENABLER',
    description:
      'Symbolic methods for solving equations and expressing general mathematical relationships.',
    causes: ['Ancient Geometry'],
    effects: ['Analytic Geometry'],
  },

  'Analytic Geometry': {
    type: 'ENABLER',
    description:
      'Representing geometric shapes using algebraic equations and coordinate systems.',
    causes: ['Algebra'],
    effects: ['Calculus'],
  },

  Calculus: {
    type: 'BREAKTHROUGH',
    description:
      'Calculus gave mathematics a language for describing continuous change, unlocking centuries of scientific and engineering progress.',
    causes: ['Analytic Geometry'],
    effects: ['Newtonian Physics'],
  },

  'Newtonian Physics': {
    type: 'BREAKTHROUGH',
    description:
      'Laws of motion and gravitation formalized using the tools of calculus.',
    causes: ['Calculus'],
    effects: ['Modern Engineering'],
  },

  'Modern Engineering': {
    type: 'TRANSFORMATION',
    description:
      'Applying precise mathematical models to design machines, structures, and systems.',
    causes: ['Newtonian Physics'],
    effects: ['Computer Science'],
  },

  'Computer Science': {
    type: 'CURRENT',
    description:
      'The study of computation, algorithms, and information processing.',
    causes: ['Modern Engineering'],
    effects: [],
  },

  Photography: {
    type: 'ORIGIN',
    description:
      'The ability to capture a scene exactly as it appeared challenged painters to find a new purpose.',
    causes: [],
    effects: ['Naturalism'],
  },

  Naturalism: {
    type: 'ENABLER',
    description:
      'An art movement emphasizing accurate, unidealized depiction of everyday life.',
    causes: ['Photography'],
    effects: ['Impressionism'],
  },

  Impressionism: {
    type: 'BREAKTHROUGH',
    description:
      'Impressionism broke from rigid academic painting, capturing light and fleeting moments instead of rigid detail.',
    causes: ['Photography', 'Naturalism'],
    effects: ['Post-Impressionism'],
  },

  'Post-Impressionism': {
    type: 'TRANSFORMATION',
    description:
      'Artists pushed beyond naturalistic color and light toward personal expression and structure.',
    causes: ['Impressionism'],
    effects: ['Modern Art'],
  },

  'Modern Art': {
    type: 'TRANSFORMATION',
    description:
      'A broad rejection of traditional technique in favor of experimentation and new forms.',
    causes: ['Post-Impressionism'],
    effects: ['Abstract Art'],
  },

  'Abstract Art': {
    type: 'CURRENT',
    description:
      'Art that represents ideas and emotion without depicting recognizable subjects.',
    causes: ['Modern Art'],
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