import { useState, useEffect, useRef } from 'react'

// 太阳系颜色配置
const SOLAR_COLORS = {
  sun: '#FFD700',
  mercury: '#B0B0B0',
  venus: '#E6C200',
  earth: '#4A90D9',
  mars: '#CD5C5C',
  jupiter: '#D4A574',
  saturn: '#F4D03F',
  orbit: 'rgba(255, 255, 255, 0.12)',
  text: '#D4AF37',
  background: '#050510'
}

export default function SolarSystemVisualization() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [params, setParams] = useState({
    sunMass: 1,
    initialVelocity: 1,
    gravityStrength: 1,
    showOrbit: true,
    showVelocity: false
  })

  // 行星初始数据
  const [planets, setPlanets] = useState([
    { name: '水星', distance: 45, angle: 0, speed: 0.12, size: 4, color: SOLAR_COLORS.mercury },
    { name: '金星', distance: 65, angle: 2.5, speed: 0.09, size: 6, color: SOLAR_COLORS.venus },
    { name: '地球', distance: 90, angle: 5, speed: 0.07, size: 7, color: SOLAR_COLORS.earth },
    { name: '火星', distance: 115, angle: 1.2, speed: 0.05, size: 5, color: SOLAR_COLORS.mars },
    { name: '木星', distance: 150, angle: 3.5, speed: 0.03, size: 14, color: SOLAR_COLORS.jupiter },
    { name: '土星', distance: 180, angle: 4.2, speed: 0.02, size: 11, color: SOLAR_COLORS.saturn }
  ])

  // 动画循环
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const displayWidth = canvas.clientWidth
    const displayHeight = canvas.clientHeight
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr
    canvas.style.width = displayWidth + 'px'
    canvas.style.height = displayHeight + 'px'

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const width = displayWidth
    const height = displayHeight
    const centerX = width / 2
    const centerY = height / 2

    // 适应画布的缩放因子
    const scale = Math.min(width, height) / 400

    let animationId

    const animate = () => {
      ctx.fillStyle = SOLAR_COLORS.background
      ctx.fillRect(0, 0, width, height)

      // 绘制星空背景
      drawStars(ctx, width, height)

      // 绘制太阳
      const sunSize = 35 * params.sunMass * scale
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunSize * 1.5)
      sunGradient.addColorStop(0, '#fff')
      sunGradient.addColorStop(0.2, '#fffacd')
      sunGradient.addColorStop(0.5, SOLAR_COLORS.sun)
      sunGradient.addColorStop(1, 'rgba(255, 150, 0, 0)')
      ctx.fillStyle = sunGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, sunSize * 1.5, 0, Math.PI * 2)
      ctx.fill()

      // 太阳光晕
      for (let i = 0; i < 3; i++) {
        const glowGradient = ctx.createRadialGradient(centerX, centerY, sunSize, centerX, centerY, sunSize * 2 + i * 10)
        glowGradient.addColorStop(0, `rgba(255, 200, 50, ${0.2 - i * 0.05})`)
        glowGradient.addColorStop(1, 'rgba(255, 200, 50, 0)')
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, sunSize * 2 + i * 10, 0, Math.PI * 2)
        ctx.fill()
      }

      // 更新和绘制行星
      setPlanets(prevPlanets => {
        return prevPlanets.map((planet) => {
          const newAngle = planet.angle + planet.speed * params.initialVelocity
          const scaledDistance = planet.distance * params.gravityStrength * scale
          const x = centerX + Math.cos(newAngle) * scaledDistance
          const y = centerY + Math.sin(newAngle) * scaledDistance

          // 绘制轨道
          if (params.showOrbit) {
            ctx.strokeStyle = SOLAR_COLORS.orbit
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(centerX, centerY, scaledDistance, 0, Math.PI * 2)
            ctx.stroke()
          }

          // 绘制行星
          const planetSize = planet.size * scale * 0.8
          const planetGradient = ctx.createRadialGradient(x - planetSize / 3, y - planetSize / 3, 0, x, y, planetSize)
          planetGradient.addColorStop(0, '#fff')
          planetGradient.addColorStop(0.5, planet.color)
          planetGradient.addColorStop(1, `${planet.color}88`)
          ctx.fillStyle = planetGradient
          ctx.beginPath()
          ctx.arc(x, y, planetSize, 0, Math.PI * 2)
          ctx.fill()

          // 土星环
          if (planet.name === '土星') {
            ctx.strokeStyle = 'rgba(244, 208, 63, 0.6)'
            ctx.lineWidth = 3 * scale
            ctx.beginPath()
            ctx.ellipse(x, y, planetSize * 2, planetSize * 0.6, Math.PI / 6, 0, Math.PI * 2)
            ctx.stroke()
          }

          // 行星标签
          ctx.fillStyle = 'rgba(255,255,255,0.7)'
          ctx.font = `${10 * scale}px monospace`
          ctx.fillText(planet.name, x + planetSize + 5, y + 3)

          // 速度矢量
          if (params.showVelocity) {
            const vx = -Math.sin(newAngle) * planet.speed * 30 * scale
            const vy = Math.cos(newAngle) * planet.speed * 30 * scale
            ctx.strokeStyle = '#4A90D9'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + vx, y + vy)
            ctx.stroke()
          }

          return { ...planet, angle: newAngle, x, y }
        })
      })

      // 中心标签
      ctx.fillStyle = SOLAR_COLORS.text
      ctx.font = `bold ${12 * scale}px serif`
      ctx.fillText('☀ 太阳', centerX + sunSize + 10, centerY - sunSize / 2)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [params])

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  // 计算地球相关数据
  const earthPlanet = planets[2] || {}
  const earthSpeed = (earthPlanet.speed * params.initialVelocity * 100).toFixed(1)

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: SOLAR_COLORS.background,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Canvas区域 */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      {/* 控制面板 */}
      <div style={{
        padding: '16px',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* 参数显示 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
          <ParamDisplay label="太阳质量" value={`${params.sunMass.toFixed(1)}M☉`} color={SOLAR_COLORS.sun} />
          <ParamDisplay label="引力强度" value={`${params.gravityStrength.toFixed(1)}G`} color={SOLAR_COLORS.text} />
          <ParamDisplay label="地球速度" value={earthSpeed} color={SOLAR_COLORS.earth} />
          <ParamDisplay label="行星数量" value="6颗" color={SOLAR_COLORS.jupiter} />
        </div>

        {/* 滑块 */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <SliderControl label="太阳质量" value={params.sunMass} min={0.5} max={2} step={0.1} unit="M☉" onChange={v => updateParam('sunMass', v)} color={SOLAR_COLORS.sun} />
          <SliderControl label="初始速度" value={params.initialVelocity} min={0.5} max={2} step={0.1} unit="v₀" onChange={v => updateParam('initialVelocity', v)} color={SOLAR_COLORS.earth} />
          <SliderControl label="引力强度" value={params.gravityStrength} min={0.1} max={2} step={0.1} unit="G" onChange={v => updateParam('gravityStrength', v)} color={SOLAR_COLORS.text} />
        </div>

        {/* 切换 */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <ToggleControl label="显示轨道" checked={params.showOrbit} onChange={v => updateParam('showOrbit', v)} color={SOLAR_COLORS.orbit} />
          <ToggleControl label="速度矢量" checked={params.showVelocity} onChange={v => updateParam('showVelocity', v)} color={SOLAR_COLORS.earth} />
        </div>
      </div>
    </div>
  )
}

// 绘制星空背景
function drawStars(ctx, width, height) {
  const starCount = 150
  for (let i = 0; i < starCount; i++) {
    const x = (i * 7919) % width
    const y = (i * 6571) % height
    const size = ((i * 13) % 3) / 2 + 0.5
    const brightness = 0.3 + ((i * 37) % 70) / 100
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
}

function ParamDisplay({ label, value, color }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '6px 8px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '6px',
      border: `1px solid ${color}30`
    }}>
      <div style={{ fontSize: '9px', color: '#888', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: '600', color, fontFamily: 'monospace' }}>{value}</div>
    </div>
  )
}

function SliderControl({ label, value, min, max, step, unit = '', onChange, color }) {
  return (
    <div style={{ flex: '1 1 100px', minWidth: '90px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: '#aaa' }}>{label}</span>
        <span style={{ fontSize: '11px', fontWeight: '600', color }}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          height: '4px',
          appearance: 'none',
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #444 ${((value - min) / (max - min)) * 100}%, #444 100%)`,
          borderRadius: '2px',
          cursor: 'pointer'
        }}
      />
    </div>
  )
}

function ToggleControl({ label, checked, onChange, color }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
      <div style={{
        width: '32px',
        height: '18px',
        background: checked ? color : '#333',
        borderRadius: '9px',
        position: 'relative',
        transition: 'background 0.3s'
      }}>
        <div style={{
          width: '14px',
          height: '14px',
          background: '#fff',
          borderRadius: '50%',
          position: 'absolute',
          top: '2px',
          left: checked ? '16px' : '2px',
          transition: 'left 0.3s'
        }} />
      </div>
      <span style={{ fontSize: '11px', color: '#aaa' }}>{label}</span>
    </label>
  )
}