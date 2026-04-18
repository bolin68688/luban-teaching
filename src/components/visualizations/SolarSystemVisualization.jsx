import { useEffect, useRef } from 'react'

// 太阳系颜色配置
const COLORS = {
  sun: '#FFD700',
  mercury: '#B0B0B0',
  venus: '#E6C200',
  earth: '#4A90D9',
  mars: '#CD5C5C',
  jupiter: '#D4A574',
  saturn: '#F4D03F',
  uranus: '#7FDBFF',
  neptune: '#4169E1',
  orbit: 'rgba(255, 255, 255, 0.1)',
  text: '#D4AF37',
  bg: '#050510'
}

// 8大行星数据（距离按比例缩放，确保全部可见）
const PLANETS = [
  { name: '水星', dist: 0.12, speed: 0.025, size: 2.5, color: COLORS.mercury },
  { name: '金星', dist: 0.18, speed: 0.018, size: 4, color: COLORS.venus },
  { name: '地球', dist: 0.25, speed: 0.014, size: 4.5, color: COLORS.earth },
  { name: '火星', dist: 0.32, speed: 0.011, size: 3.5, color: COLORS.mars },
  { name: '木星', dist: 0.45, speed: 0.006, size: 10, color: COLORS.jupiter },
  { name: '土星', dist: 0.58, speed: 0.004, size: 8.5, color: COLORS.saturn },
  { name: '天王星', dist: 0.72, speed: 0.003, size: 6, color: COLORS.uranus },
  { name: '海王星', dist: 0.88, speed: 0.002, size: 5.5, color: COLORS.neptune }
]

// 星空数据（固定，避免每帧重新生成）
const STARS = Array.from({ length: 200 }, (_, i) => ({
  x: (i * 7919 + 3571) % 1000 / 1000,
  y: (i * 6571 + 2143) % 1000 / 1000,
  size: ((i * 13) % 30) / 20 + 0.3,
  bright: 0.2 + ((i * 37) % 80) / 100
}))

export default function SolarSystemVisualization() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const planetsRef = useRef(
    PLANETS.map((p, i) => ({
      ...p,
      angle: i * 0.8 + Math.random() * 2
    }))
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const cx = width / 2
      const cy = height / 2
      const maxR = Math.min(cx, cy) - 20 // 留出标签空间

      // 清除背景
      ctx.fillStyle = COLORS.bg
      ctx.fillRect(0, 0, width, height)

      // 绘制星空
      STARS.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.bright})`
        ctx.beginPath()
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // 绘制轨道
      PLANETS.forEach(p => {
        const r = p.dist * maxR
        ctx.strokeStyle = COLORS.orbit
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()
      })

      // 绘制太阳（小的，不遮挡行星）
      const sunR = Math.max(8, maxR * 0.04)
      const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 2)
      sunGrad.addColorStop(0, '#ffffff')
      sunGrad.addColorStop(0.3, '#fffacd')
      sunGrad.addColorStop(0.6, COLORS.sun)
      sunGrad.addColorStop(1, 'rgba(255, 150, 0, 0)')
      ctx.fillStyle = sunGrad
      ctx.beginPath()
      ctx.arc(cx, cy, sunR * 2, 0, Math.PI * 2)
      ctx.fill()

      // 太阳光晕（小范围）
      const glowGrad = ctx.createRadialGradient(cx, cy, sunR, cx, cy, sunR * 3)
      glowGrad.addColorStop(0, 'rgba(255, 200, 50, 0.12)')
      glowGrad.addColorStop(1, 'rgba(255, 200, 50, 0)')
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(cx, cy, sunR * 3, 0, Math.PI * 2)
      ctx.fill()

      // 更新和绘制行星（使用ref，不触发React重渲染）
      planetsRef.current.forEach(planet => {
        planet.angle += planet.speed

        const orbitR = planet.dist * maxR
        const px = cx + Math.cos(planet.angle) * orbitR
        const py = cy + Math.sin(planet.angle) * orbitR
        const pr = Math.max(2, planet.size * (maxR / 250))

        // 行星本体
        const pGrad = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, 0, px, py, pr)
        pGrad.addColorStop(0, '#ffffff')
        pGrad.addColorStop(0.4, planet.color)
        pGrad.addColorStop(1, planet.color + '88')
        ctx.fillStyle = pGrad
        ctx.beginPath()
        ctx.arc(px, py, pr, 0, Math.PI * 2)
        ctx.fill()

        // 土星环
        if (planet.name === '土星') {
          ctx.save()
          ctx.strokeStyle = 'rgba(244, 208, 63, 0.5)'
          ctx.lineWidth = Math.max(1.5, pr * 0.25)
          ctx.beginPath()
          ctx.ellipse(px, py, pr * 2, pr * 0.5, Math.PI / 6, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }

        // 行星名称标签
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
        ctx.font = `${Math.max(9, 10 * maxR / 250)}px monospace`
        ctx.fillText(planet.name, px + pr + 4, py + 3)
      })

      // 太阳标签
      ctx.fillStyle = COLORS.text
      ctx.font = `bold ${Math.max(10, 11 * maxR / 250)}px serif`
      ctx.fillText('太阳', cx + sunR * 2.5, cy - 4)

      // 右上角标题
      ctx.fillStyle = 'rgba(212, 175, 55, 0.6)'
      ctx.font = '14px serif'
      ctx.textAlign = 'right'
      ctx.fillText('太阳系 · 8大行星', width - 16, 24)
      ctx.textAlign = 'left'

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: COLORS.bg,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
      {/* 左下角行星图例 */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        pointerEvents: 'none'
      }}>
        {PLANETS.map(p => (
          <div key={p.name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            background: 'rgba(0,0,0,0.5)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            color: '#aaa'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: p.color,
              display: 'inline-block'
            }} />
            {p.name}
          </div>
        ))}
      </div>
    </div>
  )
}
