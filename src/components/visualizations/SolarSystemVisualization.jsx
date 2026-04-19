import { useEffect, useRef } from 'react'

const COLORS = {
  sun: '#FFD700',
  mercury: '#B0B0B0', venus: '#E6C200', earth: '#4A90D9',
  mars: '#CD5C5C', jupiter: '#D4A574', saturn: '#F4D03F',
  uranus: '#7FDBFF', neptune: '#4169E1',
  pluto: '#DEB887', ceres: '#A0522D', eris: '#DDD',
  orbit: 'rgba(255, 255, 255, 0.12)', orbitDashed: 'rgba(255,255,255,0.06)',
  text: '#D4AF37', bg: '#050510'
}

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

// 矮行星（可选显示）
const DWARF_PLANETS = [
  { name: '冥王星', dist: 0.96, speed: 0.0013, size: 2, color: COLORS.pluto },
  { name: '谷神星', dist: 0.22, speed: 0.017, size: 1.8, color: COLORS.ceres },
  { name: '阋神星', dist: 1.02, speed: 0.001, size: 1.8, color: COLORS.eris }
]

const STARS = Array.from({ length: 200 }, (_, i) => ({
  x: (i * 7919 + 3571) % 1000 / 1000,
  y: (i * 6571 + 2143) % 1000 / 1000,
  size: ((i * 13) % 30) / 20 + 0.3,
  bright: 0.2 + ((i * 37) % 80) / 100
}))

export default function SolarSystemVisualization({ params = {}, actions = {} }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animRef = useRef(null)

  // 用 ref 存储参数，让动画循环实时读取而不触发重渲染
  const optionsRef = useRef({
    sunMass: 1,
    speedMultiplier: 1,
    gravity: 1,
    showOrbits: true,
    showDwarfs: false,
    orbitStyle: 'circular' // circular | elliptical | realistic
  })

  // 行星状态 ref（角度等）
  const planetsRef = useRef(
    PLANETS.map((p, i) => ({ ...p, angle: i * 0.8 + Math.random() * 2 }))
  )
  const dwarfsRef = useRef(
    DWARF_PLANETS.map((p, i) => ({ ...p, angle: i * 1.2 + Math.random() * 3 }))
  )

  // 同步外部参数到 ref（不触发重渲染）
  useEffect(() => {
    const o = optionsRef.current
    o.sunMass = params['太阳质量'] ?? 1
    o.speedMultiplier = params['初始速度'] ?? 1
    o.gravity = params['引力强度'] ?? 1
    o.showOrbits = params['显示轨道'] !== false
    o.showDwarfs = params['显示矮行星'] === true || params['显示矮行星'] === true
  }, [params])

  // 处理操作按钮（重置/轨道切换）
  useEffect(() => {
    if (actions['圆形轨道']) {
      optionsRef.current.orbitStyle = 'circular'
      // 重置所有行星角度
      planetsRef.current.forEach((p, i) => { p.angle = i * 0.8 })
      dwarfsRef.current.forEach((p, i) => { p.angle = i * 1.2 })
    }
    if (actions['椭圆轨道']) {
      optionsRef.current.orbitStyle = 'elliptical'
    }
    if (actions['抛物线轨道']) {
      optionsRef.current.orbitStyle = 'realistic'
    }
    if (actions['重置']) {
      optionsRef.current.orbitStyle = 'circular'
      planetsRef.current.forEach((p, i) => { p.angle = i * 0.8 + Math.random() * 2 })
      dwarfsRef.current.forEach((p, i) => { p.angle = i * 1.2 + Math.random() * 3 })
    }
  }, [actions])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    let time = 0

    const draw = () => {
      time += 0.016
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const cx = width / 2
      const cy = height / 2
      const maxR = Math.min(cx, cy) - 20

      const opt = optionsRef.current

      // 速度因子：太阳质量越大转越慢（引力大），初始速度越快转越快
      const massFactor = 1 / Math.sqrt(opt.sunMass)
      const speedFactor = opt.speedMultiplier * massFactor
      const gravityEffect = opt.gravity

      // 清除背景
      ctx.fillStyle = COLORS.bg
      ctx.fillRect(0, 0, width, height)

      // 星空
      STARS.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.bright})`
        ctx.beginPath()
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // 绘制轨道
      if (opt.showOrbits) {
        PLANETS.forEach(p => {
          const r = p.dist * maxR
          ctx.strokeStyle = COLORS.orbit
          ctx.lineWidth = 0.8
          ctx.beginPath()
          if (opt.orbitStyle === 'circular') {
            ctx.arc(cx, cy, r, 0, Math.PI * 2)
          } else if (opt.orbitStyle === 'elliptical') {
            ctx.ellipse(cx, cy, r, r * 0.85, 0, 0, Math.PI * 2)
          } else {
            // 抛物线/真实感：略微偏心
            ctx.ellipse(cx, cy, r, r * (0.7 + p.dist * 0.25), p.dist * 0.3, 0, Math.PI * 2)
          }
          ctx.stroke()
        })

        // 矮行星轨道（虚线）
        if (opt.showDwarfs) {
          DWARF_PLANETS.forEach(p => {
            const r = p.dist * maxR
            ctx.strokeStyle = COLORS.orbitDashed
            ctx.lineWidth = 0.5
            ctx.setLineDash([3, 4])
            ctx.beginPath()
            ctx.arc(cx, cy, r, 0, Math.PI * 2)
            ctx.stroke()
            ctx.setLineDash([])
          })
        }
      }

      // 太阳（大小随质量变化）
      const sunR = Math.max(8, maxR * (0.03 + opt.sunMass * 0.015))
      const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 2.5)
      sunGrad.addColorStop(0, '#ffffff')
      sunGrad.addColorStop(0.25, '#fffacd')
      sunGrad.addColorStop(0.55, COLORS.sun)
      sunGrad.addColorStop(1, 'rgba(255, 150, 0, 0)')
      ctx.fillStyle = sunGrad
      ctx.beginPath()
      ctx.arc(cx, cy, sunR * 2.5, 0, Math.PI * 2)
      ctx.fill()

      // 太阳光晕
      const glowR = sunR * (3 + gravityEffect)
      const glowGrad = ctx.createRadialGradient(cx, cy, sunR, cx, cy, glowR)
      glowGrad.addColorStop(0, `rgba(255, 200, 50, ${0.10 + gravityEffect * 0.04})`)
      glowGrad.addColorStop(1, 'rgba(255, 200, 50, 0)')
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2)
      ctx.fill()

      // 更新和绘制行星
      planetsRef.current.forEach((planet) => {
        const dynamicSpeed = planet.speed * speedFactor * (0.8 + gravityEffect * 0.4)
        planet.angle += dynamicSpeed

        let orbitR = planet.dist * maxR
        let px, py

        if (opt.orbitStyle === 'circular') {
          px = cx + Math.cos(planet.angle) * orbitR
          py = cy + Math.sin(planet.angle) * orbitR
        } else if (opt.orbitStyle === 'elliptical') {
          const eR = orbitR * 0.85
          px = cx + Math.cos(planet.angle) * orbitR
          py = cy + Math.sin(planet.angle) * eR
        } else {
          const eR = orbitR * (0.7 + planet.dist * 0.25)
          const tilt = planet.dist * 0.3
          px = cx + Math.cos(planet.angle) * orbitR - Math.sin(planet.angle) * eR * Math.sin(tilt) * 0.1
          py = cy + Math.sin(planet.angle) * eR
        }

        const pr = Math.max(2, planet.size * (maxR / 250))

        // 行星光晕（引力强时更明显）
        if (gravityEffect > 1) {
          const pg = ctx.createRadialGradient(px, py, 0, px, py, pr * 2)
          pg.addColorStop(0, `${planet.color}22`)
          pg.addColorStop(1, 'transparent')
          ctx.fillStyle = pg
          ctx.beginPath()
          ctx.arc(px, py, pr * 2, 0, Math.PI * 2)
          ctx.fill()
        }

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

        // 标签
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
        ctx.font = `${Math.max(9, 10 * maxR / 250)}px monospace`
        ctx.fillText(planet.name, px + pr + 4, py + 3)
      })

      // 矮行星
      if (opt.showDwarfs) {
        dwarfsRef.current.forEach(dwarf => {
          dwarf.angle += dwarf.speed * speedFactor

          let orbitR = dwarf.dist * maxR
          let px, py
          if (opt.orbitStyle === 'circular') {
            px = cx + Math.cos(dwarf.angle) * orbitR
            py = cy + Math.sin(dwarf.angle) * orbitR
          } else {
            px = cx + Math.cos(dwarf.angle) * orbitR
            py = cy + Math.sin(dwarf.angle) * orbitR * 0.85
          }

          const pr = Math.max(1.5, dwarf.size * (maxR / 280))
          ctx.fillStyle = dwarf.color
          ctx.globalAlpha = 0.7
          ctx.beginPath()
          ctx.arc(px, py, pr, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1

          ctx.fillStyle = 'rgba(200, 200, 200, 0.5)'
          ctx.font = '9px monospace'
          ctx.fillText(dwarf.name, px + pr + 3, py + 2)
        })
      }

      // 太阳标签
      ctx.fillStyle = COLORS.text
      ctx.font = `bold ${Math.max(10, 11 * maxR / 250)}px serif`
      ctx.fillText('太阳', cx + sunR * 2.5, cy - 4)

      // 右上角标题
      ctx.fillStyle = 'rgba(212, 175, 55, 0.6)'
      ctx.font = '14px serif'
      ctx.textAlign = 'right'
      const styleLabel = opt.orbitStyle === 'circular' ? '圆轨' : opt.orbitStyle === 'elliptical' ? '椭圆' : '开普勒'
      const dwarfLabel = opt.showDwarfs ? ' +矮' : ''
      ctx.fillText(`太阳系 · 8大行星${dwarfLabel} [${styleLabel}]`, width - 16, 24)
      ctx.textAlign = 'left'

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      ro.disconnect()
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, []) // 只挂载一次，通过ref实时读取参数变化

  return (
    <div ref={containerRef} style={{
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
      {/* 左下角图例 */}
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
            display: 'flex', alignItems: 'center', gap: '3px',
            background: 'rgba(0,0,0,0.5)',
            padding: '2px 6px', borderRadius: '4px',
            fontSize: '10px', color: '#aaa'
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%', background: p.color,
              display: 'inline-block'
            }} />
            {p.name}
          </div>
        ))}
      </div>
    </div>
  )
}
