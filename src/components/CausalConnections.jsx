import { useEffect, useRef } from 'react'

export default function CausalConnections({
  count = 0,
  activeIndex = -1,
}) {
  const canvasRef = useRef(null)
  const animationRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      ctx.clearRect(0, 0, width, height)

      if (count < 2) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }

      const padding = 70
      const usableWidth = width - padding * 2
      const gap = usableWidth / (count - 1)
      const y = height / 2
      const time = performance.now() * 0.001

      /*
       * Draw every causal connection
       */

      for (let i = 0; i < count - 1; i += 1) {
        const x1 = padding + gap * i
        const x2 = padding + gap * (i + 1)

        const isActive =
          i === activeIndex ||
          i + 1 === activeIndex

        const gradient = ctx.createLinearGradient(
          x1,
          y,
          x2,
          y,
        )

        gradient.addColorStop(
          0,
          isActive
            ? 'rgba(91, 132, 255, 0.25)'
            : 'rgba(72, 169, 255, 0.12)',
        )

        gradient.addColorStop(
          0.5,
          isActive
            ? 'rgba(150, 175, 255, 0.95)'
            : 'rgba(125, 150, 255, 0.35)',
        )

        gradient.addColorStop(
          1,
          isActive
            ? 'rgba(91, 132, 255, 0.25)'
            : 'rgba(72, 169, 255, 0.12)',
        )

        ctx.beginPath()
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)

        ctx.strokeStyle = gradient
        ctx.lineWidth = isActive ? 2 : 1
        ctx.shadowBlur = isActive ? 16 : 5
        ctx.shadowColor = '#6f8cff'
        ctx.stroke()

        ctx.shadowBlur = 0

        /*
         * Direction arrow
         */

        const arrowX = x1 + (x2 - x1) * 0.5

        ctx.beginPath()
        ctx.moveTo(arrowX - 5, y - 4)
        ctx.lineTo(arrowX + 2, y)
        ctx.lineTo(arrowX - 5, y + 4)

        ctx.strokeStyle = isActive
          ? 'rgba(205, 220, 255, 0.95)'
          : 'rgba(150, 170, 230, 0.48)'

        ctx.lineWidth = 1
        ctx.stroke()

        /*
         * Continuous causal energy
         *
         * The particle travels across every connection.
         */

        const progress =
          (time * 0.28 + i * 0.17) % 1

        const particleX =
          x1 + (x2 - x1) * progress

        const glow = ctx.createRadialGradient(
          particleX,
          y,
          0,
          particleX,
          y,
          isActive ? 15 : 9,
        )

        glow.addColorStop(
          0,
          isActive
            ? 'rgba(255, 255, 255, 1)'
            : 'rgba(145, 174, 255, 0.75)',
        )

        glow.addColorStop(
          0.25,
          isActive
            ? 'rgba(151, 181, 255, 0.95)'
            : 'rgba(110, 145, 255, 0.5)',
        )

        glow.addColorStop(
          1,
          'rgba(91, 132, 255, 0)',
        )

        ctx.beginPath()
        ctx.arc(
          particleX,
          y,
          isActive ? 15 : 9,
          0,
          Math.PI * 2,
        )

        ctx.fillStyle = glow
        ctx.fill()

        /*
         * Bright particle core
         */

        ctx.beginPath()
        ctx.arc(
          particleX,
          y,
          isActive ? 2.5 : 1.5,
          0,
          Math.PI * 2,
        )

        ctx.fillStyle = '#ffffff'
        ctx.shadowBlur = isActive ? 16 : 8
        ctx.shadowColor = '#8caeff'
        ctx.fill()

        ctx.shadowBlur = 0
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)

      cancelAnimationFrame(
        animationRef.current,
      )
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