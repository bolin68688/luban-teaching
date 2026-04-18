import { useState, useEffect, useRef } from 'react'

// 太阳系颜色配置
const SOLAR_COLORS = {
  sun: '#FFD700',
  mercury: '#B0B0B0',
  venus: '#E6C200',
  earth: '#4A90D9',
  mars: '#CD5C5C',
  orbit: 'rgba(255, 255, 255, 0.15)',
  text: '#D4AF37',
  background: '#050510'
}

export default function SolarSystemVisualization({ params, controls }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [solarParams, setSolarParams] = useState({
    sunMass: 1,
    initialVelocity: 1,
    gravityStrength: 1,
    showOrbit: true,
    showVelocity: false,
    planets: []
  })

  // 行星初始数据
  const initialPlanets = [
    { name: '水星', distance: 50, angle: 0, speed: 0.08, size: 4, color: SOLAR_COLORS.mercury },
    { name: '金星', distance: 80, angle: 2, speed: 0.06, size: 6, color: SOLAR_COLORS.venus },
    { name: '地球', distance: 115, angle: 4, speed: 0.05, size: 7, color: SOLAR_COLORS.earth },
    { name: '火星', distance: 150, angle: 1, speed: 0.04, size: 5, color: SOLAR_COLORS.mars }
  ]

  const [planets, setPlanets] = useState(initialPlanets)

  // 绑定控制器
  useEffect(() => {
    const handleSlider = (e) => {
      const { name, value } = e.detail
      setSolarParams(prev => ({ ...prev, [name]: parseFloat(value) }))
    }
    const handleToggle = (e) => {
      const { name, checked } = e.detail
      setSolarParams(prev => ({ ...prev, [name]: checked }))
    }
    window.addEventListener('solar-control', handleSlider)
    window.addEventListener('solar-toggle', handleToggle)
    return () => {
      window.removeEventListener('solar-control', handleSlider)
      window.removeEventListener('solar-toggle', handleToggle)
    }
  }, [])

  // 动画循环
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    let animationId

    const animate = () => {
      ctx.fillStyle = SOLAR_COLORS.background
      ctx.fillRect(0, 0, width, height)

      // 绘制星空背景
      drawStars(ctx, width, height)

      // 绘制太阳
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40 * solarParams.sunMass)
      sunGradient.addColorStop(0, '#fff')
      sunGradient.addColorStop(0.3, SOLAR_COLORS.sun)
      sunGradient.addColorStop(1, 'rgba(255, 150, 0, 0)')
      ctx.fillStyle = sunGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 40 * solarParams.sunMass, 0, Math.PI * 2)
      ctx.fill()

      // 太阳光晕
      for (let i = 0; i < 3; i++) {
        const glowGradient = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 60 + i * 15)
        glowGradient.addColorStop(0, `rgba(255, 200, 50, ${0.15 - i * 0.04})`)
        glowGradient.addColorStop(1, 'rgba(255, 200, 50, 0)')
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, 60 + i * 15, 0, Math.PI * 2)
        ctx.fill()
      }

      // 更新和绘制行星
      setPlanets(prevPlanets => {
        return prevPlanets.map((planet, index) => {
          const newAngle = planet.angle + planet.speed * solarParams.initialVelocity * (1 / Math.sqrt(planet.distance / 100))
          const x = centerX + Math.cos(newAngle) * planet.distance * solarParams.gravityStrength
          const y = centerY + Math.sin(newAngle) * planet.distance * solarParams.gravityStrength

          // 绘制轨道
          if (solarParams.showOrbit) {
            ctx.strokeStyle = SOLAR_COLORS.orbit
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(centerX, centerY, planet.distance * solarParams.gravityStrength, 0, Math.PI * 2)
            ctx.stroke()
          }

          // 绘制行星
          const planetGradient = ctx.createRadialGradient(x - planet.size / 3, y - planet.size / 3, 0, x, y, planet.size)
          planetGradient.addColorStop(0, '#fff')
          planetGradient.addColorStop(0.5, planet.color)
          planetGradient.addColorStop(1, `${planet.color}88`)
          ctx.fillStyle = planetGradient
          ctx.beginPath()
          ctx.arc(x, y, planet.size, 0, Math.PI * 2)
          ctx.fill()

          // 行星标签
          if (planet.distance < 130) {
            ctx.fillStyle = 'rgba(255,255,255,0.6)'
            ctx.font = '10px var(--font-mono)'
            ctx.fillText(planet.name, x + planet.size + 5, y + 3)
          }

          return { ...planet, angle: newAngle, x, y }
        })
      })

      // 绘制速度矢量
      if (solarParams.showVelocity) {
        planets.forEach(planet => {
          if (planet.x !== undefined) {
            const vx = -Math.sin(planet.angle) * planet.speed * 15
            const vy = Math.cos(planet.angle) * planet.speed * 15
            ctx.strokeStyle = '#4A90D9'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(planet.x, planet.y)
            ctx.lineTo(planet.x + vx, planet.y + vy)
            ctx.stroke()
            // 箭头
            ctx.beginPath()
            ctx.moveTo(planet.x + vx, planet.y + vy)
            ctx.lineTo(planet.x + vx - 4, planet.y + vy - 8)
            ctx.moveTo(planet.x + vx, planet.y + vy)
            ctx.lineTo(planet.x + vx + 4, planet.y + vy - 8)
            ctx.stroke()
          }
        })
      }

      // 中心标签
      ctx.fillStyle = SOLAR_COLORS.text
      ctx.font = 'bold 12px var(--font-serif)'
      ctx.fillText('☀ 太阳', centerX + 50, centerY - 30)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [solarParams])

  // 计算当前行星数据
  const selectedPlanet = planets[2] || {} // 默认地球

  return (
    <div style={{
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: SOLAR_COLORS.background
    }}>
      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />

      {/* 参数显示 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        padding: '16px',
        background: 'rgba(0,0,0,0.3)'
      }}>
        <ParameterDisplay
          label="地球公转周期"
          value={selectedPlanet.speed ? `${(2 * Math.PI / (selectedPlanet.speed * solarParams.initialVelocity)).toFixed(1)}s` : '-'}
          color={SOLAR_COLORS.earth}
        />
        <ParameterDisplay
          label="地球轨道速度"
          value={selectedPlanet.speed ? `${(selectedPlanet.speed * solarParams.initialVelocity * 100).toFixed(1)}` : '-'}
          color={SOLAR_COLORS.sun}
        />
        <ParameterDisplay
          label="太阳质量倍数"
          value={`${solarParams.sunMass.toFixed(1)}M☉`}
          color={SOLAR_COLORS.sun}
        />
        <ParameterDisplay
          label="引力强度"
          value={`${solarParams.gravityStrength.toFixed(1)}G`}
          color={SOLAR_COLORS.text}
        />
      </div>

      {/* 控制面板 */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <ControlSlider
            label="太阳质量"
            name="sunMass"
            min={0.5}
            max={2}
            step={0.1}
            value={solarParams.sunMass}
            unit="M☉"
            color={SOLAR_COLORS.sun}
          />
          <ControlSlider
            label="初始速度"
            name="initialVelocity"
            min={0.5}
            max={2}
            step={0.1}
            value={solarParams.initialVelocity}
            unit="v₀"
            color={SOLAR_COLORS.earth}
          />
          <ControlSlider
            label="引力强度"
            name="gravityStrength"
            min={0.1}
            max={2}
            step={0.1}
            value={solarParams.gravityStrength}
            unit="G"
            color={SOLAR_COLORS.text}
          />
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <ControlToggle
              label="显示轨道"
              checked={solarParams.showOrbit}
              color={SOLAR_COLORS.orbit}
            />
            <ControlToggle
              label="速度矢量"
              checked={solarParams.showVelocity}
              color={SOLAR_COLORS.earth}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// 绘制星空背景
function drawStars(ctx, width, height) {
  const starCount = 100
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

// 参数显示组件
function ParameterDisplay({ label, value, color }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '8px 12px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 'var(--radius-sm)',
      border: `1px solid ${color}30`
    }}>
      <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '16px', fontWeight: '600', color }}>{value}</div>
    </div>
  )
}

// 滑块控制器
function ControlSlider({ label, name, min, max, step, value, unit, color }) {
  const handleChange = (e) => {
    window.dispatchEvent(new CustomEvent('solar-control', {
      detail: { name, value: parseFloat(e.target.value) }
    }))
  }

  return (
    <div style={{ flex: '1 1 120px', minWidth: '110px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', color: '#aaa' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: '600', color }}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{
          width: '100%',
          height: '4px',
          appearance: 'none',
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #333 ${((value - min) / (max - min)) * 100}%, #333 100%)`,
          borderRadius: '2px',
          cursor: 'pointer'
        }}
      />
    </div>
  )
}

// 切换控制器
function ControlToggle({ label, checked, color }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
      <div style={{
        width: '36px',
        height: '20px',
        background: checked ? color : '#333',
        borderRadius: '10px',
        position: 'relative',
        transition: 'background 0.3s'
      }}>
        <div style={{
          width: '16px',
          height: '16px',
          background: '#fff',
          borderRadius: '50%',
          position: 'absolute',
          top: '2px',
          left: checked ? '18px' : '2px',
          transition: 'left 0.3s'
        }} />
      </div>
      <span style={{ fontSize: '12px', color: '#aaa' }}>{label}</span>
    </label>
  )
}