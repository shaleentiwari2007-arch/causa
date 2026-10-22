import { useEffect, useRef, useState } from 'react'
import { Float, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const ICONS = {
  SCIENCE: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
      <ellipse cx="12" cy="12" rx="9" ry="3.5" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.6" fill="white" stroke="none" />
    </svg>
  ),
  PHILOSOPHY: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3.5c-2.4 0-4 1.8-4 3.8 0 1-.5 1.4-1 2-.7.8-.7 2 .2 2.6-.5.7-.4 1.8.4 2.3-.3.9.2 1.9 1.2 2.1.2 1.3 1.4 2.2 2.7 2h.5" />
      <path d="M15 3.5c2.4 0 4 1.8 4 3.8 0 1 .5 1.4 1 2 .7.8.7 2-.2 2.6.5.7.4 1.8-.4 2.3.3.9-.2 1.9-1.2 2.1-.2 1.3-1.4 2.2-2.7 2h-.5" />
      <path d="M12 4v14" />
    </svg>
  ),
  HISTORY: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-5 9 5" />
      <path d="M4 9v9M9 9v9M15 9v9M20 9v9" />
      <path d="M2 20h20" />
    </svg>
  ),
  TECHNOLOGY: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  ),
  ART: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a9 9 0 100 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-.9.7-1.5 1.5-1.5H16a4 4 0 004-4c0-4.4-3.6-8-8-8z" />
      <circle cx="7.5" cy="10.5" r="1" fill="white" stroke="none" />
      <circle cx="11" cy="7.5" r="1" fill="white" stroke="none" />
      <circle cx="15" cy="8.5" r="1" fill="white" stroke="none" />
    </svg>
  ),
}

export default function KnowledgeNode({
  name,
  color,
  position,
  index = 0,
  onSelect,
  onHoverChange,
}) {
  const groupRef = useRef()
  const orbRef = useRef()
  const [hovered, setHovered] = useState(false)

  // never leave the pointer cursor behind when the scene unmounts
  useEffect(
    () => () => {
      document.body.style.cursor = 'default'
    },
    [],
  )

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(time * 0.7 + index) * 0.08
    }

    if (orbRef.current) {
      orbRef.current.rotation.y += delta * (hovered ? 1.4 : 0.7)
      orbRef.current.rotation.x = Math.sin(time * 0.5 + index) * 0.15
    }
  })

  const hoverOn = () => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
    onHoverChange?.(name)
  }

  const hoverOff = () => {
    setHovered(false)
    document.body.style.cursor = 'default'
    onHoverChange?.(null)
  }

  return (
    <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.25}>
      <group ref={groupRef} position={position}>
        <mesh scale={hovered ? 1.8 : 1.45}>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.12 : 0.055} />
        </mesh>

        <mesh ref={orbRef} scale={hovered ? 1.12 : 1}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 5 : 2.8}
            roughness={0.18}
            metalness={0.7}
          />
        </mesh>

        <mesh scale={hovered ? 1.3 : 1.18}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.5 : 0.25} wireframe />
        </mesh>

        {/* larger invisible hit area so nodes are easy to click */}
        <mesh
          onClick={(event) => {
            event.stopPropagation()
            onSelect?.(name)
          }}
          onPointerOver={(event) => {
            event.stopPropagation()
            hoverOn()
          }}
          onPointerOut={hoverOff}
        >
          <sphereGeometry args={[0.62, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <pointLight color={color} intensity={hovered ? 3.2 : 1.4} distance={hovered ? 5 : 3.5} />

        <Html center distanceFactor={9} position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className={`node-icon ${hovered ? 'node-icon-active' : ''}`}
            style={{ '--node-color': color }}
          >
            {name === 'MATHEMATICS' ? <span className="node-icon-glyph">π</span> : ICONS[name]}
          </div>
        </Html>

        <Html center distanceFactor={9} position={[0, -0.72, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className={`knowledge-node-label ${hovered ? 'knowledge-node-label-active' : ''}`}
            style={{ '--node-color': color }}
            onClick={() => onSelect?.(name)}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            <span className="knowledge-node-line" />
            <span className="knowledge-node-name">{name}</span>
            {hovered && <span className="knowledge-node-hint">OPEN ↗</span>}
          </div>
        </Html>
      </group>
    </Float>
  )
}