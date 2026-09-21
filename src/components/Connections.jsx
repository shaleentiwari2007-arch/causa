import { useMemo } from 'react'
import * as THREE from 'three'

function Connection({ start, end, color }) {
  const { position, rotation, length } = useMemo(() => {
    const startVector = new THREE.Vector3(...start)
    const endVector = new THREE.Vector3(...end)

    const direction = new THREE.Vector3()
      .subVectors(endVector, startVector)

    const length = direction.length()

    const midpoint = new THREE.Vector3()
      .addVectors(startVector, endVector)
      .multiplyScalar(0.5)

    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    )

    const rotation = new THREE.Euler().setFromQuaternion(
      quaternion,
    )

    return {
      position: midpoint,
      rotation,
      length,
    }
  }, [start, end])

  return (
    <group position={position} rotation={rotation}>
      {/* Main connection */}
      <mesh>
        <cylinderGeometry
          args={[0.008, 0.008, length, 8]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Soft glow around connection */}
      <mesh scale={[2.8, 1, 2.8]}>
        <cylinderGeometry
          args={[0.012, 0.012, length, 8]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.035}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default function Connections({ nodes }) {
  return (
    <group>
      {nodes.map((node) => (
        <Connection
          key={node.id}
          start={node.start}
          end={node.end}
          color={node.color}
        />
      ))}
    </group>
  )
}