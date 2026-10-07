import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Torus, Html } from '@react-three/drei'

export default function KnowledgeCore() {
  const coreRef = useRef()
  const wireRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  const surfacePoints = useMemo(() => {
    const count = 260
    const data = new Float32Array(count * 3)
    const radius = 1.56

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      data[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      data[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      data[i * 3 + 2] = radius * Math.cos(phi)
    }

    return data
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15
    }

    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.08
      wireRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
    }

    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.2
    if (ring2Ref.current) ring2Ref.current.rotation.y -= delta * 0.15
    if (ring3Ref.current) ring3Ref.current.rotation.x += delta * 0.12
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshBasicMaterial color="#1c5fff" transparent opacity={0.28} />
      </mesh>

      <mesh ref={wireRef}>
        <sphereGeometry args={[1.52, 20, 14]} />
        <meshBasicMaterial color="#9fd0ff" wireframe transparent opacity={0.28} />
      </mesh>

      <mesh scale={0.6}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#a86bff" transparent opacity={0.4} />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={surfacePoints.length / 3}
            array={surfacePoints}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.02}
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <Torus ref={ring1Ref} args={[2.1, 0.02, 16, 128]} rotation={[Math.PI / 2.5, 0.2, 0]}>
        <meshBasicMaterial color="#5aa9ff" transparent opacity={0.55} />
      </Torus>

      <Torus ref={ring2Ref} args={[2.4, 0.015, 16, 128]} rotation={[0.8, 0.4, 0.3]}>
        <meshBasicMaterial color="#b98cff" transparent opacity={0.4} />
      </Torus>

      <Torus ref={ring3Ref} args={[2.65, 0.012, 16, 128]} rotation={[1.3, -0.3, 0.6]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </Torus>

      <Html center distanceFactor={7.5} position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
        <div className="core-label">
          <span>EXPLORE</span>
          <strong>THE WHY</strong>
        </div>
      </Html>
    </group>
  )
}