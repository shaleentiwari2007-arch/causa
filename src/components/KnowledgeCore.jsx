import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Torus } from '@react-three/drei'

export default function KnowledgeCore() {
  const coreRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.3
      coreRef.current.rotation.x =
        Math.sin(time * 0.5) * 0.15
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.2
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.15
    }
  })

  return (
    <group position={[0, 0, 0]}>

      {/* MAIN CORE */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.5, 64, 64]} />

        <meshBasicMaterial
          color="#246bff"
        />
      </mesh>

      {/* INNER CORE */}
      <mesh scale={0.65}>
        <sphereGeometry args={[1.5, 48, 48]} />

        <meshBasicMaterial
          color="#9c5cff"
        />
      </mesh>

      {/* OUTER ORBIT */}
      <Torus
        ref={ring1Ref}
        args={[2.1, 0.025, 16, 128]}
        rotation={[Math.PI / 2.5, 0.2, 0]}
      >
        <meshBasicMaterial
          color="#42a5ff"
        />
      </Torus>

      {/* SECOND ORBIT */}
      <Torus
        ref={ring2Ref}
        args={[2.5, 0.018, 16, 128]}
        rotation={[0.8, 0.4, 0.3]}
      >
        <meshBasicMaterial
          color="#b05cff"
        />
      </Torus>

    </group>
  )
}