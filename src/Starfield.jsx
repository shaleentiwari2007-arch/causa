import { useEffect, useRef } from 'react'

const STAR_COUNT = 850
const STREAK_COUNT = 70

function Starfield() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetMouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })

    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1

    const stars = []
    const streaks = []

    const random = (min, max) =>
      Math.random() * (max - min) + min

    const createStar = () => ({
      x: Math.random(),
      y: Math.random(),
      z: random(0.15, 1),
      size: random(0.35, 1.65),
      twinkle: random(0, Math.PI * 2),
      twinkleSpeed: random(0.002, 0.008),
      drift: random(0.00001, 0.000045),
      hue: Math.random() > 0.9 ? random(190, 235) : 0,
    })

    const createStreak = () => ({
      x: Math.random(),
      y: Math.random(),
      length: random(15, 70),
      speed: random(0.00015, 0.00045),
      opacity: random(0.08, 0.3),
      angle: random(-0.18, 0.18),
    })

    const setup = () => {
      const rect = canvas.getBoundingClientRect()

      width = rect.width
      height = rect.height

      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      stars.length = 0
      streaks.length = 0

      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(createStar())
      }

      for (let i = 0; i < STREAK_COUNT; i++) {
        streaks.push(createStreak())
      }
    }

    const handleMouseMove = (event) => {
      targetMouseRef.current.x =
        event.clientX / window.innerWidth - 0.5

      targetMouseRef.current.y =
        event.clientY / window.innerHeight - 0.5
    }

    const handleMouseLeave = () => {
      targetMouseRef.current.x = 0
      targetMouseRef.current.y = 0
    }

    const drawStar = (star, time) => {
      const depth = star.z

      const parallaxX =
        mouseRef.current.x * depth * 34

      const parallaxY =
        mouseRef.current.y * depth * 22

      const x =
        star.x * width +
        parallaxX

      const y =
        star.y * height +
        parallaxY

      const pulse =
        0.55 +
        Math.sin(
          time * star.twinkleSpeed + star.twinkle
        ) * 0.35

      const alpha =
        Math.max(0.08, depth * pulse)

      const size =
        star.size *
        (0.65 + depth * 0.75)

      if (
        x < -20 ||
        x > width + 20 ||
        y < -20 ||
        y > height + 20
      ) {
        return
      }

      ctx.beginPath()

      ctx.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2
      )

      if (star.hue) {
        ctx.fillStyle = `hsla(${star.hue}, 85%, 82%, ${alpha})`
      } else {
        ctx.fillStyle = `rgba(225, 235, 255, ${alpha})`
      }

      ctx.fill()
    }

    const drawStreak = (streak) => {
      const x =
        streak.x * width +
        mouseRef.current.x * 12

      const y =
        streak.y * height +
        mouseRef.current.y * 8

      const endX =
        x -
        streak.length

      const endY =
        y +
        streak.length * streak.angle

      const gradient =
        ctx.createLinearGradient(
          endX,
          endY,
          x,
          y
        )

      gradient.addColorStop(
        0,
        'rgba(120, 150, 255, 0)'
      )

      gradient.addColorStop(
        1,
        `rgba(160, 190, 255, ${streak.opacity})`
      )

      ctx.beginPath()

      ctx.moveTo(endX, endY)
      ctx.lineTo(x, y)

      ctx.strokeStyle = gradient
      ctx.lineWidth = 0.6

      ctx.stroke()
    }

    const animate = (time) => {
      mouseRef.current.x +=
        (targetMouseRef.current.x -
          mouseRef.current.x) *
        0.045

      mouseRef.current.y +=
        (targetMouseRef.current.y -
          mouseRef.current.y) *
        0.045

      ctx.clearRect(
        0,
        0,
        width,
        height
      )

      for (const star of stars) {
        star.y -= star.drift * star.z

        if (star.y < -0.02) {
          star.y = 1.02
          star.x = Math.random()
        }

        drawStar(star, time)
      }

      for (const streak of streaks) {
        streak.x += streak.speed

        if (streak.x > 1.08) {
          streak.x = -0.08
          streak.y = Math.random()
        }

        drawStreak(streak)
      }

      animationRef.current =
        requestAnimationFrame(animate)
    }

    setup()

    window.addEventListener(
      'resize',
      setup
    )

    window.addEventListener(
      'mousemove',
      handleMouseMove,
      { passive: true }
    )

    window.addEventListener(
      'mouseleave',
      handleMouseLeave
    )

    animationRef.current =
      requestAnimationFrame(animate)

    return () => {
      window.removeEventListener(
        'resize',
        setup
      )

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      )

      window.removeEventListener(
        'mouseleave',
        handleMouseLeave
      )

      cancelAnimationFrame(
        animationRef.current
      )
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="starfield"
      aria-hidden="true"
    />
  )
}

export default Starfield