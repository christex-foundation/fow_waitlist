import { useEffect, useRef, memo, type CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'

const TWO_PI = Math.PI * 2

type DotFieldProps = {
  dotRadius?: number
  dotSpacing?: number
  cursorRadius?: number
  bulgeStrength?: number
  /** Start colour of the dot fill gradient. */
  gradientFrom?: string
  /** End colour of the dot fill gradient. */
  gradientTo?: string
  className?: string
  style?: CSSProperties
}

/**
 * Cursor-reactive dot field, adapted from reactbits.dev/backgrounds/dot-field.
 *
 * Differences from the upstream component:
 * - Brand-aligned defaults (ink dots, accent glow) and TypeScript props.
 * - Mouse coordinates use clientX/clientY (no scroll offset) so the effect
 *   stays aligned when this is rendered as a `fixed` full-page layer.
 * - Honours `prefers-reduced-motion`: draws the grid once, no animation,
 *   no listeners.
 * - Pauses the animation loop while the tab is hidden.
 */
const DotField = memo(
  ({
    dotRadius = 1.5,
    dotSpacing = 14,
    cursorRadius = 500,
    bulgeStrength = 67,
    gradientFrom = 'rgba(28, 28, 28, 0.16)',
    gradientTo = 'rgba(28, 28, 28, 0.08)',
    className,
    style,
  }: DotFieldProps) => {
    const reduce = useReducedMotion()

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const dotsRef = useRef<
      { ax: number; ay: number; sx: number; sy: number }[]
    >([])
    const mouseRef = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 })
    const rafRef = useRef<number | null>(null)
    const sizeRef = useRef({ w: 0, h: 0, offsetX: 0, offsetY: 0 })
    const engagement = useRef(0)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d', { alpha: true })
      if (!ctx) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      let resizeTimer: ReturnType<typeof setTimeout>

      function buildDots(w: number, h: number) {
        const step = dotRadius + dotSpacing
        const cols = Math.floor(w / step)
        const rows = Math.floor(h / step)
        const padX = (w % step) / 2
        const padY = (h % step) / 2
        const dots = new Array(rows * cols)
        let idx = 0
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const ax = padX + col * step + step / 2
            const ay = padY + row * step + step / 2
            dots[idx++] = { ax, ay, sx: ax, sy: ay }
          }
        }
        dotsRef.current = dots
      }

      function drawStatic() {
        const { w, h } = sizeRef.current
        const dots = dotsRef.current
        ctx!.clearRect(0, 0, w, h)
        const grad = ctx!.createLinearGradient(0, 0, w, h)
        grad.addColorStop(0, gradientFrom)
        grad.addColorStop(1, gradientTo)
        ctx!.fillStyle = grad
        const rad = dotRadius / 2
        ctx!.beginPath()
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i]
          ctx!.moveTo(d.ax + rad, d.ay)
          ctx!.arc(d.ax, d.ay, rad, 0, TWO_PI)
        }
        ctx!.fill()
      }

      function doResize() {
        const parent = canvas!.parentElement
        if (!parent) return
        const rect = parent.getBoundingClientRect()
        const w = rect.width
        const h = rect.height

        canvas!.width = w * dpr
        canvas!.height = h * dpr
        canvas!.style.width = `${w}px`
        canvas!.style.height = `${h}px`
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

        // No scroll offset: this layer is `fixed`, so the canvas always
        // aligns to the viewport and clientX/clientY map directly.
        sizeRef.current = { w, h, offsetX: rect.left, offsetY: rect.top }

        buildDots(w, h)
        if (reduce) drawStatic()
      }

      function resize() {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(doResize, 100)
      }

      // Reduced motion: draw once, no listeners, no animation.
      if (reduce) {
        doResize()
        window.addEventListener('resize', resize)
        return () => {
          clearTimeout(resizeTimer)
          window.removeEventListener('resize', resize)
        }
      }

      function onMouseMove(e: MouseEvent) {
        const s = sizeRef.current
        mouseRef.current.x = e.clientX - s.offsetX
        mouseRef.current.y = e.clientY - s.offsetY
      }

      function updateMouseSpeed() {
        const m = mouseRef.current
        const dx = m.prevX - m.x
        const dy = m.prevY - m.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        m.speed += (dist - m.speed) * 0.5
        if (m.speed < 0.001) m.speed = 0
        m.prevX = m.x
        m.prevY = m.y
      }

      const speedInterval = setInterval(updateMouseSpeed, 20)

      let frameCount = 0

      function tick() {
        frameCount++
        const dots = dotsRef.current
        const m = mouseRef.current
        const { w, h } = sizeRef.current
        const len = dots.length

        const targetEngagement = Math.min(m.speed / 5, 1)
        engagement.current += (targetEngagement - engagement.current) * 0.06
        if (engagement.current < 0.001) engagement.current = 0
        const eng = engagement.current

        ctx!.clearRect(0, 0, w, h)

        const grad = ctx!.createLinearGradient(0, 0, w, h)
        grad.addColorStop(0, gradientFrom)
        grad.addColorStop(1, gradientTo)
        ctx!.fillStyle = grad

        const cr = cursorRadius
        const crSq = cr * cr
        const rad = dotRadius / 2

        ctx!.beginPath()

        for (let i = 0; i < len; i++) {
          const d = dots[i]
          const dx = m.x - d.ax
          const dy = m.y - d.ay
          const distSq = dx * dx + dy * dy

          if (distSq < crSq && eng > 0.01) {
            const dist = Math.sqrt(distSq)
            const t = 1 - dist / cr
            const push = t * t * bulgeStrength * eng
            const angle = Math.atan2(dy, dx)
            d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15
            d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15
          } else {
            d.sx += (d.ax - d.sx) * 0.1
            d.sy += (d.ay - d.sy) * 0.1
          }

          ctx!.moveTo(d.sx + rad, d.sy)
          ctx!.arc(d.sx, d.sy, rad, 0, TWO_PI)
        }

        ctx!.fill()

        rafRef.current = requestAnimationFrame(tick)
      }

      function start() {
        if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick)
      }

      function stop() {
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      }

      function onVisibility() {
        if (document.hidden) stop()
        else start()
      }

      doResize()
      window.addEventListener('resize', resize)
      window.addEventListener('mousemove', onMouseMove, { passive: true })
      document.addEventListener('visibilitychange', onVisibility)
      start()

      return () => {
        stop()
        clearInterval(speedInterval)
        clearTimeout(resizeTimer)
        window.removeEventListener('resize', resize)
        window.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('visibilitychange', onVisibility)
      }
    }, [
      reduce,
      dotRadius,
      dotSpacing,
      cursorRadius,
      bulgeStrength,
      gradientFrom,
      gradientTo,
    ])

    return (
      <div
        className={className}
        style={{ position: 'relative', width: '100%', height: '100%', ...style }}
      >
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      </div>
    )
  },
)

DotField.displayName = 'DotField'

export default DotField
