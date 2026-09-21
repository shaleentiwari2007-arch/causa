import { useEffect, useRef } from 'react'

export default function CausalConnections({
  count = 0,
  activeIndex = -1,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    const draw = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      ctx.clearRect(0, 0, width, height)

      if (count < 2) return

      const padding = 70
      const usableWidth = width - padding * 2
      const gap = usableWidth / (count - 1)

      for (let i = 0; i < count - 1; i += 1) {
        const x1 = padding + gap * i
        const x2 = padding + gap * (i + 1)
        const y = height / 2

        const isActive =
          i === activeIndex ||
          i + 1 === activeIndex

        const gradient = ctx.createLinearGradient(x1, y, x2, y)

        gradient.addColorStop(0, 'rgba(72, 169, 255, 0.15)')
        gradient.addColorStop(0.5, isActive
          ? 'rgba(125, 150, 255, 0.95)'
          : 'rgba(125, 150, 255, 0.38)')
        gradient.addColorStop(1, 'rgba(72, 169, 255, 0.15)')

        ctx.beginPath()
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)

        ctx.strokeStyle = gradient
        ctx.lineWidth = isActive ? 2 : 1
        ctx.shadowBlur = isActive ? 16 : 6
        ctx.shadowColor = '#6f8cff'
        ctx.stroke()

        ctx.shadowBlur = 0

        const arrowX = x1 + (x2 - x1) * 0.5

        ctx.beginPath()
        ctx.moveTo(arrowX - 5, y - 4)
        ctx.lineTo(arrowX + 2, y)
        ctx.lineTo(arrowX - 5, y + 4)

        ctx.strokeStyle = isActive
          ? 'rgba(180, 200, 255, 1)'
          : 'rgba(150, 170, 230, 0.55)'

        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    draw()

    window.addEventListener('resize', resize)
    window.addEventListener('resize', draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', draw)
    }
  }, [count, activeIndex])

  return (
    <canvas
      ref={canvasRef}
      className="causal-connections"
      aria-hidden="true"
    />
  )
}
