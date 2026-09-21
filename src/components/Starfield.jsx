import { useMemo } from 'react'
import { Points, PointMaterial } from '@react-three/drei'

export default function Starfield({ count = 4500 }) {
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      const radius = 8 + Math.random() * 30
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      data[i * 3] =
        radius * Math.sin(phi) * Math.cos(theta)

      data[i * 3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta)

      data[i * 3 + 2] =
        radius * Math.cos(phi)
    }

    return data
  }, [count])

  return (
    <Points
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#dbe7ff"
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        opacity={0.82}
      />
    </Points>
  )
}