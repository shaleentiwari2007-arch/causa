import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export default function CameraRig() {
  const target = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    const { camera, pointer } = state

    target.current.x = pointer.x * 0.45
    target.current.y = pointer.y * 0.28

    camera.position.x +=
      (target.current.x - camera.position.x) * 0.025

    camera.position.y +=
      (target.current.y - camera.position.y) * 0.025

    camera.lookAt(0, 0, 0)
  })

  return null
}