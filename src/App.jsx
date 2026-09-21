import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState } from 'react'

import Starfield from './components/Starfield'
import CausalityGraph from './components/CausalityGraph'
import KnowledgeCore from './components/KnowledgeCore'
import KnowledgeNode from './components/KnowledgeNode'
import GraphConnections from './components/Connections'
import CameraRig from './components/CameraRig'
import Satellite from './components/Satellite'
import CausalTrace from './components/CausalTrace'
import { findKnowledge } from './data/knowledge'

import './App.css'

const NODES = [
  { name: 'SCIENCE', color: '#48a9ff', position: [-3.5, 1.8, 0] },
  { name: 'PHILOSOPHY', color: '#b47cff', position: [3.3, 1.7, -0.3] },
  { name: 'HISTORY', color: '#ffb45c', position: [-4, -1.5, -0.2] },
  { name: 'TECHNOLOGY', color: '#35e0c0', position: [4, -1.4, 0.1] },
  { name: 'MATHEMATICS', color: '#789cff', position: [-1.8, -3, -0.5] },
  { name: 'ART', color: '#ff65bd', position: [2, -3, -0.2] },
]

function UniverseScene() {
  return (
    <>
      <color attach="background" args={['#02030a']} />
      <fog attach="fog" args={['#02030a', 10, 30]} />

      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 6]} intensity={1.2} color="#6a9cff" />
      <pointLight position={[0, 0, 2]} intensity={3} distance={8} color="#347dff" />

      <Starfield />
      <CameraRig />

      <GraphConnections
        nodes={NODES.map((node) => ({
          id: node.name,
          start: [0, 0, 0],
          end: node.position,
          color: node.color,
        }))}
      />

      <KnowledgeCore />

      {NODES.map((node, index) => (
        <KnowledgeNode
          key={node.name}
          name={node.name}
          color={node.color}
          position={node.position}
          index={index}
        />
      ))}

      <Satellite />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.08}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.7}
      />
    </>
  )
}

export default function App() {
  const [exploring, setExploring] = useState(false)
  const [entering, setEntering] = useState(false)
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [noMatch, setNoMatch] = useState(false)

  const handleExplore = () => {
    setEntering(true)

    window.setTimeout(() => {
      setExploring(true)
      setEntering(false)
    }, 1400)
  }

  const runSearch = (text) => {
    const value = text ?? query
    const knowledge = findKnowledge(value)
    setResult(knowledge)
    setNoMatch(!knowledge && value.trim() !== '')
  }

  const closeResult = () => {
    setResult(null)
  }

  return (
    <main className={`causa ${exploring ? 'is-exploring' : ''}`}>
      {entering && (
        <div className="causa-transition">
          <div className="transition-core" />
          <div className="transition-ring ring-one" />
          <div className="transition-ring ring-two" />
          <div className="transition-text">
            <span>INITIALIZING</span>
            <strong>CAUSA</strong>
          </div>
        </div>
      )}

      {!exploring && (
        <>
          <Canvas
            camera={{ position: [0, 0, 10], fov: 45 }}
            dpr={[1, 1.8]}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <UniverseScene />
          </Canvas>

          <div className="hud">
            <header className="topbar">
              <div className="brand">
                <span className="brand-mark">C</span>
                <span>CAUSA</span>
              </div>

              <div className="system-status">
                <span className="status-dot" />
                SYSTEM ONLINE
              </div>

              <div className="interface">
                INTERFACE / <span>01</span>
              </div>
            </header>

            <section className="hero-copy">
              <div className="eyebrow">CAUSALITY EXPLORATION ENGINE</div>

              <h1>
                TRACE
                <br />
                <span>THE WHY.</span>
              </h1>

              <p>
                Explore the hidden chain of ideas, discoveries and events that
                shaped the world around us.
              </p>

              <button className="enter-button" onClick={handleExplore}>
                <span>ENTER CAUSA</span>
                <span className="enter-arrow">↗</span>
              </button>

              <div className="hero-meta">
                <span>CAUSALITY ENGINE</span>
                <span>01 / 06 DOMAINS</span>
              </div>
            </section>

            <div className="node-readout">
              <span>ACTIVE DOMAIN</span>
              <strong>ALL KNOWLEDGE</strong>
            </div>

            <div className="left-data">
              <span>KNOWLEDGE GRAPH</span>
              <strong>v2.4.1</strong>
              <small>CONNECTED / 06 DOMAINS</small>
            </div>

            <div className="bottom-data">
              <div>
                <span>MODE</span>
                <strong>EXPLORATION</strong>
              </div>
              <div>
                <span>DIMENSION</span>
                <strong>3D / WEBGL</strong>
              </div>
              <div>
                <span>STATUS</span>
                <strong>STABLE</strong>
              </div>
            </div>

            <div className="corner top-left" />
            <div className="corner top-right" />
            <div className="corner bottom-left" />
            <div className="corner bottom-right" />
          </div>
        </>
      )}

      {exploring && (
        <section className="exploration">
          <header className="exploration-topbar">
            <div className="brand">
              <span className="brand-mark">C</span>
              <span>CAUSA</span>
            </div>

            <div className="system-status">
              <span className="status-dot" />
              CAUSAL ENGINE ONLINE
            </div>

            <button
              className="return-button"
              onClick={() => {
                setExploring(false)
                setResult(null)
                setNoMatch(false)
                setQuery('')
              }}
            >
              ← UNIVERSE
            </button>
          </header>

          <div className="exploration-content">
            <div className="exploration-eyebrow">CAUSA / EXPLORATION ENGINE</div>

            <h2>
              WHAT DO YOU WANT
              <br />
              <span>TO UNDERSTAND?</span>
            </h2>

            <p className="exploration-description">
              Don't search for an answer. Trace what caused it.
            </p>

            <div className="search-container">
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setNoMatch(false)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    runSearch()
                  }
                }}
                placeholder='Try "telegraph", "electricity", or "printing press"'
              />

              <button onClick={() => runSearch()} aria-label="Search CAUSA">
                ↗
              </button>
            </div>

            {noMatch && (
              <div className="search-empty">
                No causal chain found for <strong>"{query}"</strong>. Try
                telegraph, electricity, or printing press.
              </div>
            )}

            <div className="domain-grid">
              {NODES.map((node) => (
                <button
                  key={node.name}
                  className="domain-card"
                  style={{ '--domain-color': node.color }}
                  onClick={() => {
                    const value = node.name.toLowerCase()
                    setQuery(value)
                    runSearch(value)
                  }}
                >
                  <span className="domain-dot" />
                  {node.name}
                  <span className="domain-arrow">↗</span>
                </button>
              ))}
            </div>

            {result && (
              <div className="causal-overlay">
                <div className="causal-overlay-backdrop" onClick={closeResult} />

                <div className="causal-result" role="dialog" aria-modal="true" aria-label="Causal trace">
                  <button className="causal-close" onClick={closeResult} aria-label="Close causal trace">
                    ×
                  </button>

                  <div className="result-header">
                    <div>
                      <span>CAUSAL TRACE</span>
                      <h3>{result.title}</h3>
                    </div>
                    <span>{result.year}</span>
                  </div>

                  <p>{result.description}</p>

                  <CausalTrace result={result} />

                  <div className="result-columns">
                    <div>
                      <span>WHAT LED TO IT</span>
                      <ul>
                        {result.causes.map((cause) => (
                          <li key={cause}>{cause}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span>WHAT CAME AFTER</span>
                      <ul>
                        {result.effects.map((effect) => (
                          <li key={effect}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <CausalityGraph result={result} />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}