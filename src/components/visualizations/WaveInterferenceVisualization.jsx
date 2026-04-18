import { useState, useEffect, useRef } from 'react'

// 波形颜色配置
const WAVE_COLORS = {
  wave1: '#D4AF37',      // 金色
  wave2: '#E6C200',      // 亮金
  constructive: '#FFD700', // 加强区
  destructive: '#1a1a2e',  // 相消区
  background: '#0a0a14'
}

export default function WaveInterferenceVisualization({ params, controls }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [waveParams, setWaveParams] = useState({
    wavelength: 1.5,
    slitDistance: 4,
    screenDistance: 10,
    showConstructive: true,
    showDestructive: true
  })

  // 解析controls参数
  useEffect(() => {
    const newParams = { ...waveParams }
    controls?.forEach(ctrl => {
      if (ctrl.type === 'slider') {
        const key = ctrl.label === '波长' ? 'wavelength' :
                   ctrl.label === '双缝间距' ? 'slitDistance' : 'screenDistance'
        newParams[key] = ctrl.default
      }
      if (ctrl.type === 'toggle') {
        if (ctrl.label === '显示加强区') newParams.showConstructive = ctrl.default
        if (ctrl.label === '显示相消区') newParams.showDestructive = ctrl.default
      }
    })
    setWaveParams(newParams)
  }, [controls])

  // 绑定控制器
  useEffect(() => {
    const handleSlider = (e) => {
      const { name, value } = e.detail
      setWaveParams(prev => ({ ...prev, [name]: parseFloat(value) }))
    }
    window.addEventListener('wave-control', handleSlider)
    return () => window.removeEventListener('wave-control', handleSlider)
  }, [])

  // 绘制干涉图样
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = WAVE_COLORS.background
    ctx.fillRect(0, 0, width, height)

    const centerY = height / 2
    const leftX = 80  // 双缝位置
    const rightX = width - 80  // 屏幕位置

    // 绘制双缝
    const slitY1 = centerY - waveParams.slitDistance * 15
    const slitY2 = centerY + waveParams.slitDistance * 15

    // 光源
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(leftX, centerY, 8, 0, Math.PI * 2)
    ctx.fill()

    // 发光效果
    const gradient = ctx.createRadialGradient(leftX, centerY, 0, leftX, centerY, 30)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(leftX, centerY, 30, 0, Math.PI * 2)
    ctx.fill()

    // 绘制双缝线条
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(leftX - 10, slitY1 - 30)
    ctx.lineTo(leftX + 10, slitY1 - 30)
    ctx.moveTo(leftX - 10, slitY1 + 30)
    ctx.lineTo(leftX + 10, slitY1 + 30)
    ctx.stroke()

    // 绘制干涉波纹
    const time = Date.now() / 1000
    const k = (2 * Math.PI) / (waveParams.wavelength * 30)

    // 绘制从双缝到屏幕的干涉区域
    const numLines = 200
    for (let i = 0; i < numLines; i++) {
      const y = (i / numLines) * height
      const dist1 = Math.sqrt((rightX - leftX) ** 2 + (y - slitY1) ** 2)
      const dist2 = Math.sqrt((rightX - leftX) ** 2 + (y - slitY2) ** 2)
      const phaseDiff = k * (dist1 - dist2)

      // 干涉强度
      const intensity = Math.cos(phaseDiff / 2) ** 2

      // 颜色映射：相消(暗) -> 中性 -> 加强(亮)
      const brightness = 20 + intensity * 80
      const r = Math.floor(brightness)
      const g = Math.floor(brightness * 0.95)
      const b = Math.floor(brightness * 0.3)

      ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(leftX + 20, y)
      ctx.lineTo(rightX - 20, y)
      ctx.stroke()
    }

    // 绘制屏幕
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(rightX - 10, 0, 20, height)

    // 绘制干涉条纹（屏幕上的明暗相间条纹）
    const numFringes = 30
    for (let i = 0; i < numFringes; i++) {
      const fringeY = (i / numFringes) * height
      const dist1 = Math.sqrt((rightX - leftX) ** 2 + (fringeY - slitY1) ** 2)
      const dist2 = Math.sqrt((rightX - leftX) ** 2 + (fringeY - slitY2) ** 2)
      const phaseDiff = k * (dist1 - dist2)

      const intensity = Math.cos(phaseDiff / 2) ** 2

      if (intensity > 0.7 && waveParams.showConstructive) {
        // 加强区（金色亮纹）
        ctx.fillStyle = `rgba(212, 175, 55, ${intensity})`
        ctx.fillRect(rightX, fringeY - 3, 30, 6)
      } else if (intensity < 0.3 && waveParams.showDestructive) {
        // 相消区（暗纹）
        ctx.fillStyle = 'rgba(26, 26, 46, 0.8)'
        ctx.fillRect(rightX, fringeY - 3, 30, 6)
      }
    }

    // 绘制波源动态效果
    const waveRadius = ((time * 100) % 200)
    ctx.strokeStyle = `rgba(212, 175, 55, ${0.5 - waveRadius / 400})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(leftX, slitY1, waveRadius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(leftX, slitY2, waveRadius, 0, Math.PI * 2)
    ctx.stroke()

    // 标注
    ctx.fillStyle = '#888'
    ctx.font = '12px var(--font-mono)'
    ctx.fillText('双缝', leftX - 20, 30)
    ctx.fillText('屏幕', rightX + 5, 30)

    // 绘制箭头表示干涉路径
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(leftX + 5, slitY1)
    ctx.lineTo(rightX - 20, height / 2)
    ctx.moveTo(leftX + 5, slitY2)
    ctx.lineTo(rightX - 20, height / 2)
    ctx.stroke()
    ctx.setLineDash([])

    animationRef.current = requestAnimationFrame(() => {})
  }, [waveParams])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div style={{
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: WAVE_COLORS.background
    }}>
      <canvas
        ref={canvasRef}
        width={700}
        height={350}
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
          label="条纹间距"
          value={`${(waveParams.wavelength * waveParams.screenDistance / waveParams.slitDistance * 2).toFixed(2)} px`}
          color={WAVE_COLORS.wave1}
        />
        <ParameterDisplay
          label="最大级次"
          value={Math.floor(waveParams.slitDistance / waveParams.wavelength * 2)}
          color={WAVE_COLORS.wave2}
        />
        <ParameterDisplay
          label="加强区"
          value={waveParams.showConstructive ? '显示' : '隐藏'}
          color={WAVE_COLORS.constructive}
        />
        <ParameterDisplay
          label="相消区"
          value={waveParams.showDestructive ? '显示' : '隐藏'}
          color={WAVE_COLORS.destructive}
        />
      </div>

      {/* 控制面板 */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <ControlSlider
            label="波长"
            name="wavelength"
            min={0.5}
            max={3}
            step={0.1}
            value={waveParams.wavelength}
            unit="λ"
            color={WAVE_COLORS.wave1}
          />
          <ControlSlider
            label="双缝间距"
            name="slitDistance"
            min={1}
            max={10}
            step={0.5}
            value={waveParams.slitDistance}
            unit="d"
            color={WAVE_COLORS.wave2}
          />
          <ControlSlider
            label="屏幕距离"
            name="screenDistance"
            min={5}
            max={20}
            step={0.5}
            value={waveParams.screenDistance}
            unit="L"
            color={WAVE_COLORS.wave1}
          />
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <ControlToggle
              label="加强区"
              checked={waveParams.showConstructive}
              color={WAVE_COLORS.constructive}
            />
            <ControlToggle
              label="相消区"
              checked={waveParams.showDestructive}
              color={WAVE_COLORS.destructive}
            />
          </div>
        </div>
      </div>
    </div>
  )
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
    window.dispatchEvent(new CustomEvent('wave-control', {
      detail: { name, value: parseFloat(e.target.value) }
    }))
  }

  return (
    <div style={{ flex: '1 1 150px', minWidth: '140px' }}>
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