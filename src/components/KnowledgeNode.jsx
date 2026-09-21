import { useRef, useState } from 'react'
import { Float, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function KnowledgeNode({
  name,
  color,
  position,
  index = 0,
}) {
  const groupRef = useRef()
  const orbRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(time * 0.7 + index) * 0.08
    }

    if (orbRef.current) {
      orbRef.current.rotation.y += delta * (hovered ? 1.4 : 0.7)
      orbRef.current.rotation.x =
        Math.sin(time * 0.5 + index) * 0.15
    }
  })

  return (
    <Float
      speed={1.4}
      rotationIntensity={0.12}
      floatIntensity={0.25}
    >
      <group ref={groupRef} position={position}>

        {/* Outer atmospheric glow */}
        <mesh scale={hovered ? 1.8 : 1.45}>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.12 : 0.055}
          />
        </mesh>

        {/* Main node */}
        <mesh
          ref={orbRef}
          scale={hovered ? 1.12 : 1}
          onPointerOver={(event) => {
            event.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'default'
          }}
        >
          <sphereGeometry args={[0.32, 32, 32]} />

          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 5 : 2.8}
            roughness={0.18}
            metalness={0.7}
          />
        </mesh>

        {/* Wireframe shell */}
        <mesh scale={hovered ? 1.3 : 1.18}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.5 : 0.25}
            wireframe
          />
        </mesh>

        {/* Node light */}
        <pointLight
          color={color}
          intensity={hovered ? 3.2 : 1.4}
          distance={hovered ? 5 : 3.5}
        />

        {/* Domain label */}
        <Html
          center
          distanceFactor={9}
          position={[0, -0.72, 0]}
          style={{
            pointerEvents: 'none',
          }}
        >
          <div
            className={`knowledge-node-label ${
              hovered ? 'knowledge-node-label-active' : ''
            }`}
            style={{
              '--node-color': color,
            }}
          >
            <span className="knowledge-node-line" />
            <span className="knowledge-node-name">
              {name}
            </span>
          </div>
        </Html>

      </group>
    </Float>
  )
}