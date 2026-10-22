import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { ACESFilmicToneMapping } from 'three'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

import Starfield from './components/Starfield'
import KnowledgeCore from './components/KnowledgeCore'
import KnowledgeNode from './components/KnowledgeNode'
import GraphConnections from './components/Connections'
import CameraRig from './components/CameraRig'
import Satellite from './components/Satellite'
import Exploration from './components/Exploration'
import { DOMAINS, getDomain } from './data/domains'

import './App.css'

// stable references so hover state in <App> never re-applies camera/gl props
const CONNECTIONS = DOMAINS.map((domain) => ({
  id: domain.key,
  start: [0, 0, 0],
  end: domain.position,
  color: domain.color,
}))

const CAMERA = { position: [0, 0, 10], fov: 45 }
const DPR = [1, 1.8]
const GL = {
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
  toneMapping: ACESFilmicToneMapping,
}

function UniverseScene({ onSelect, onHoverChange }) {
  return (
    <>
      <fog attach="fog" args={['#02030a', 10, 30]} />

      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 6]} intensity={1.2} color="#6a9cff" />
      <pointLight position={[0, 0, 2]} intensity={3} distance={8} color="#347dff" />

      <Starfield />
      <CameraRig />

      <GraphConnections nodes={CONNECTIONS} />

      <KnowledgeCore />

      {DOMAINS.map((domain, index) => (
        <KnowledgeNode
          key={domain.key}
          name={domain.name}
          color={domain.color}
          position={domain.position}
          index={index}
          onSelect={onSelect}
          onHoverChange={onHoverChange}
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

      <EffectComposer>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.25}
          mipmapBlur
          radius={0.35}
        />
        <Vignette eskil={false} offset={0.15} darkness={0.9} />
      </EffectComposer>
    </>
  )
}

const Universe = memo(function Universe({ onSelect, onHoverChange }) {
  return (
    <Canvas camera={CAMERA} dpr={DPR} gl={GL}>
      <UniverseScene onSelect={onSelect} onHoverChange={onHoverChange} />
    </Canvas>
  )
})

function readDeepLink() {
  const params = new URLSearchParams(window.location.search)
  const q = params.get('q') || params.get('chain')
  const domain = params.get('domain')

  if (!q && !domain) return null

  return {
    q: q ? q.slice(0, 120) : '',
    domain: getDomain(domain) ? domain : null,
  }
}

export default function App() {
  const [deepLink] = useState(readDeepLink)

  const [view, setView] = useState(deepLink ? 'explore' : 'universe')
  const [scope, setScope] = useState(deepLink?.domain ?? null)
  const [pendingQuery, setPendingQuery] = useState(deepLink?.q ?? '')
  const [hoveredKey, setHoveredKey] = useState(null)
  const [transition, setTransition] = useState(null)
  const [aboutOpen, setAboutOpen] = useState(false)

  const timerRef = useRef(null)

  // browser history: back/forward move between universe and domain pages
  useEffect(() => {
    window.history.replaceState(
      { view: deepLink ? 'explore' : 'universe', scope: deepLink?.domain ?? null },
      '',
      deepLink ? window.location.pathname : window.location.href,
    )

    const onPop = (event) => {
      const state = event.state

      if (state?.view === 'explore') {
        setScope(state.scope ?? null)
        setView('explore')
      } else {
        setScope(null)
        setView('universe')
      }

      setPendingQuery('')
      setHoveredKey(null)
    }

    window.addEventListener('popstate', onPop)

    return () => {
      window.removeEventListener('popstate', onPop)
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!aboutOpen) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') setAboutOpen(false)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [aboutOpen])

  const navigate = useCallback((nextView, nextScope = null, nextQuery = '') => {
    window.history.pushState({ view: nextView, scope: nextScope }, '')
    setScope(nextScope)
    setPendingQuery(nextQuery)
    setView(nextView)
    setHoveredKey(null)
  }, [])

  const enter = useCallback(
    (domainKey = null) => {
      if (timerRef.current) return

      const domain = getDomain(domainKey)

      setTransition({
        caption: domain ? 'ENTERING DOMAIN' : 'INITIALIZING',
        label: domain ? domain.name : 'CAUSA',
      })

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null
        navigate('explore', domainKey)
        setTransition(null)
      }, 1400)
    },
    [navigate],
  )

  const handleSelect = useCallback((name) => enter(name.toLowerCase()), [enter])

  const handleHover = useCallback(
    (name) => setHoveredKey(name ? name.toLowerCase() : null),
    [],
  )

  const hoveredDomain = getDomain(hoveredKey)

  return (
    <main className={`causa ${view === 'explore' ? 'is-exploring' : ''}`}>
      {transition && (
        <div className="causa-transition">
          <div className="transition-core" />
          <div className="transition-ring ring-one" />
          <div className="transition-ring ring-two" />
          <div className="transition-text">
            <span>{transition.caption}</span>
            <strong>{transition.label}</strong>
          </div>
        </div>
      )}

      {view === 'universe' && (
        <>
          <Universe onSelect={handleSelect} onHoverChange={handleHover} />

          <div className="hud">
            <header className="topbar">
              <div className="brand">
                <span className="brand-mark">C</span>
                <span>CAUSA</span>
              </div>

              <nav className="topnav">
                <a
                  href="#"
                  className="active"
                  onClick={(event) => {
                    event.preventDefault()
                    enter(null)
                  }}
                >
                  EXPLORE
                </a>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    enter(null)
                  }}
                >
                  KNOWLEDGE GRAPH
                </a>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    setAboutOpen(true)
                  }}
                >
                  ABOUT
                </a>
              </nav>

              <div className="topbar-right">
                <div className="system-status">
                  <span className="status-dot" />
                  SYSTEM ONLINE
                </div>

                <button
                  type="button"
                  className="topbar-menu"
                  aria-label="About CAUSA"
                  onClick={() => setAboutOpen(true)}
                >
                  <span />
                  <span />
                  <span />
                </button>

                <div className="interface">
                  INTERFACE / <span>01</span>
                </div>
              </div>
            </header>

            <section className="hero-copy">
              <div className="eyebrow">CAUSAL KNOWLEDGE ENGINE</div>

              <h1>
                TRACE
                <br />
                <span>THE WHY.</span>
              </h1>

              <p>
                Explore the chain of ideas, discoveries and events that shaped the world
                around us.
              </p>

              <button type="button" className="enter-button" onClick={() => enter(null)}>
                <span>ENTER CAUSA</span>
                <span className="enter-arrow">↗</span>
              </button>

              <div className="hero-meta">
                <span>CAUSALITY ENGINE</span>
                <span>06 DOMAINS · CLICK A NODE TO ENTER</span>
              </div>
            </section>

            <div className="node-readout">
              <span>ACTIVE DOMAIN</span>
              <strong style={hoveredDomain ? { color: hoveredDomain.color } : undefined}>
                {hoveredDomain ? hoveredDomain.name : 'ALL KNOWLEDGE'}
              </strong>
            </div>

            <div className="left-data">
              <span>KNOWLEDGE GRAPH</span>
              <strong>v2.4.1</strong>
              <small>CONNECTED / 06 DOMAINS</small>
            </div>

            <div className="bottom-data">
              <div>
                <span>MODE</span>
                <strong>{hoveredDomain ? 'DOMAIN SELECT' : 'EXPLORATION'}</strong>
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

      {view === 'explore' && (
        <Exploration
          key={scope ?? 'all'}
          scope={scope}
          initialQuery={pendingQuery}
          onBack={() => navigate('universe')}
          onSwitchScope={(nextScope, nextQuery = '') =>
            navigate('explore', nextScope, nextQuery)
          }
        />
      )}

      {aboutOpen && (
        <div className="causal-overlay about-overlay">
          <div className="causal-overlay-backdrop" onClick={() => setAboutOpen(false)} />

          <div
            className="causal-result about-panel"
            role="dialog"
            aria-modal="true"
            aria-label="About CAUSA"
          >
            <button
              type="button"
              className="causal-close"
              onClick={() => setAboutOpen(false)}
              aria-label="Close about"
            >
              ×
            </button>

            <div className="result-header">
              <div>
                <span>ABOUT</span>
                <h3>CAUSA</h3>
              </div>
            </div>

            <div className="about-body">
              <p>
                CAUSA is a causal-knowledge search engine. Instead of returning a list of
                links, it traces the chain of ideas, discoveries and events behind a topic
                and shows what came next.
              </p>

              <div className="about-steps">
                <div>
                  <span>01</span>
                  <strong>Pick a domain</strong>
                  <p>
                    Click a node in the universe: Science, Philosophy, History, Technology,
                    Mathematics or Art.
                  </p>
                </div>
                <div>
                  <span>02</span>
                  <strong>Search anything</strong>
                  <p>
                    The topic is traced through the lens of that domain, so "printing press"
                    reads differently in Art than in History.
                  </p>
                </div>
                <div>
                  <span>03</span>
                  <strong>Walk the chain</strong>
                  <p>
                    Step through each cause and consequence, then share it as a PDF or QR
                    code.
                  </p>
                </div>
              </div>

              <div className="about-stack">
                REACT · VITE · THREE.JS / R3F · OPENROUTER AI (SERVERLESS) · JSPDF
              </div>

              <p className="about-note">
                Curated traces are hand-written. Everything else is generated by an AI model
                and may contain mistakes, so verify important facts.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}