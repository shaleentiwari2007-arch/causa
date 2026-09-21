import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Satellite() {
  const groupRef = useRef()
  const beaconMeshRef = useRef()
  const beaconMaterialRef = useRef()

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
      groupRef.current.rotation.x = Math.sin(time * 0.45) * 0.08
      groupRef.current.rotation.z = Math.cos(time * 0.35) * 0.06
    }

    const pulse = 0.65 + Math.sin(time * 4) * 0.35

    if (beaconMaterialRef.current) {
      beaconMaterialRef.current.opacity = pulse
    }

    if (beaconMeshRef.current) {
      beaconMeshRef.current.scale.setScalar(0.85 + pulse * 0.25)
    }
  })

  return (
    <group ref={groupRef} position={[4.4, 3.4, -1]}>
      <pointLight color="#4d8dff" intensity={1.8} distance={5} />

      <mesh scale={1.7}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshBasicMaterial color="#428dff" transparent opacity={0.035} />
      </mesh>

      <mesh>
        <boxGeometry args={[0.5, 0.28, 0.28]} />
        <meshStandardMaterial color="#c8d1df" metalness={0.9} roughness={0.22} />
      </mesh>

      <mesh position={[0, 0, 0.17]} ref={beaconMeshRef}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshBasicMaterial ref={beaconMaterialRef} color="#54b8ff" transparent opacity={0.9} />
      </mesh>

      <mesh position={[-0.58, 0, 0]}>
        <boxGeometry args={[0.72, 0.035, 0.3]} />
        <meshStandardMaterial color="#183d72" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh position={[0.58, 0, 0]}>
        <boxGeometry args={[0.72, 0.035, 0.3]} />
        <meshStandardMaterial color="#183d72" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh position={[-0.58, 0.022, 0]}>
        <boxGeometry args={[0.66, 0.008, 0.24]} />
        <meshBasicMaterial color="#4d83c9" transparent opacity={0.4} />
      </mesh>

      <mesh position={[0.58, 0.022, 0]}>
        <boxGeometry args={[0.66, 0.008, 0.24]} />
        <meshBasicMaterial color="#4d83c9" transparent opacity={0.4} />
      </mesh>

      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.45, 10]} />
        <meshBasicMaterial color="#d7dfed" />
      </mesh>

      <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.09, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#9eacc0" metalness={0.8} roughness={0.25} />
      </mesh>

      <mesh position={[0, -0.24, -0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />
        <meshBasicMaterial color="#b9c6da" />
      </mesh>
    </group>
  )
}