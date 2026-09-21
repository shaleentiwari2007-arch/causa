import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

import Starfield from './Starfield'
import KnowledgeCore from './KnowledgeCore'
import KnowledgeNode from './KnowledgeNode'
import Connections from './Connections'

const nodes = [
  {
    id: 'science',
    name: 'SCIENCE',
    color: '#48a9ff',
    position: [-3.2, 1.7, 0],
  },
  {
    id: 'philosophy',
    name: 'PHILOSOPHY',
    color: '#b47cff',
    position: [3.2, 1.7, 0],
  },
  {
    id: 'history',
    name: 'HISTORY',
    color: '#ffb45c',
    position: [-3.5, -1.1, 0.2],
  },
  {
    id: 'technology',
    name: 'TECHNOLOGY',
    color: '#35e0c0',
    position: [3.5, -1.1, 0.2],
  },
  {
    id: 'mathematics',
    name: 'MATHEMATICS',
    color: '#789cff',
    position: [-1.8, -2.8, 0],
  },
  {
    id: 'art',
    name: 'ART',
    color: '#ff65bd',
    position: [1.8, -2.8, 0],
  },
]

const connectionData = nodes.map((node) => ({
  id: node.id,
  start: [0, 0, 0],
  end: node.position,
  color: node.color,
}))

export default function Universe() {
  return (
    <div className="universe">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 10]}
          fov={48}
        />

        <ambientLight intensity={0.15} />

        <Starfield count={4500} />

        <Connections nodes={connectionData} />

        <KnowledgeCore />

        {nodes.map((node, index) => (
          <KnowledgeNode
            key={node.id}
            name={node.name}
            color={node.color}
            position={node.position}
            index={index}
          />
        ))}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  )
}