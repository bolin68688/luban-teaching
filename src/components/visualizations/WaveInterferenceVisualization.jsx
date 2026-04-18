import { useState, useEffect, useRef } from 'react'

// 波形颜色配置
const WAVE_COLORS = {
  wave1: '#D4AF37',
  wave2: '#E6C200',
  constructive: '#FFD700',
  destructive: '#1a1a2e',
  background: '#0a0a14'
}

export default function WaveInterferenceVisualization() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [params, setParams] = useState({
    wavelength: 1.5,
    slitDistance: 4,
    screenDistance: 10,
    showConstructive: true,
    showDestructive: true
  })

  // 绘制干涉图样
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
    const centerY = height / 2

    const leftX = width * 0.1
    const rightX = width * 0.85
    const slitDistance = params.slitDistance * 12
    const slitY1 = centerY - slitDistance
    const slitY2 = centerY + slitDistance

    let animationId

    const animate = () => {
      // 清空画布
      ctx.fillStyle = WAVE_COLORS.background
      ctx.fillRect(0, 0, width, height)

      // 绘制双缝装置
      // 光源
      const sourceGradient = ctx.createRadialGradient(leftX, centerY, 0, leftX, centerY, 25)
      sourceGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
      sourceGradient.addColorStop(0.5, 'rgba(255, 200, 100, 0.4)')
      sourceGradient.addColorStop(1, 'rgba(255, 200, 100, 0)')
      ctx.fillStyle = sourceGradient
      ctx.beginPath()
      ctx.arc(leftX, centerY, 25, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(leftX, centerY, 10, 0, Math.PI * 2)
      ctx.fill()

      // 双缝板
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.fillRect(leftX + 20, centerY - slitDistance - 40, 15, 80)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 1
      ctx.strokeRect(leftX + 20, centerY - slitDistance - 40, 15, 80)

      // 双缝缝隙
      ctx.fillStyle = WAVE_COLORS.background
      ctx.fillRect(leftX + 30, slitY1 - 8, 10, 16)
      ctx.fillRect(leftX + 30, slitY2 - 8, 10, 16)

      // 动态波纹
      const time = Date.now() / 800
      for (let r = 0; r < 5; r++) {
        const radius = ((time + r * 0.2) % 3) * 60
        const alpha = 0.4 - ((time + r * 0.2) % 3) * 0.12
        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(leftX + 35, slitY1, radius, -Math.PI / 2, Math.PI / 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(leftX + 35, slitY2, radius, -Math.PI / 2, Math.PI / 2)
        ctx.stroke()
      }

      // 绘制干涉区域
      const k = (2 * Math.PI) / (params.wavelength * 25)
      const numLines = 150

      for (let i = 0; i < numLines; i++) {
        const y = (i / numLines) * height
        const dist1 = Math.sqrt((rightX - leftX - 50) ** 2 + (y - slitY1) ** 2)
        const dist2 = Math.sqrt((rightX - leftX - 50) ** 2 + (y - slitY2) ** 2)
        const phaseDiff = k * (dist1 - dist2)
        const intensity = Math.cos(phaseDiff / 2) ** 2

        const brightness = 15 + intensity * 85
        const r = Math.floor(brightness * 0.95)
        const g = Math.floor(brightness * 0.85)
        const b = Math.floor(brightness * 0.2)

        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(leftX + 55, y)
        ctx.lineTo(rightX - 20, y)
        ctx.stroke()
      }

      // 绘制屏幕
      ctx.fillStyle = 'rgba(20, 20, 40, 0.9)'
      ctx.fillRect(rightX - 15, 0, 20, height)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.strokeRect(rightX - 15, 0, 20, height)

      // 屏幕干涉条纹
      const numFringes = 20
      for (let i = 0; i <= numFringes; i++) {
        const fringeY = (i / numFringes) * height
        const dist1 = Math.sqrt((rightX - leftX - 50) ** 2 + (fringeY - slitY1) ** 2)
        const dist2 = Math.sqrt((rightX - leftX - 50) ** 2 + (fringeY - slitY2) ** 2)
        const phaseDiff = k * (dist1 - dist2)
        const intensity = Math.cos(phaseDiff / 2) ** 2

        if (intensity > 0.7 && params.showConstructive) {
          ctx.fillStyle = `rgba(212, 175, 55, ${intensity * 0.9})`
          ctx.fillRect(rightX, fringeY - 4, 35, 8)
        } else if (intensity < 0.3 && params.showDestructive) {
          ctx.fillStyle = 'rgba(10, 10, 20, 0.8)'
          ctx.fillRect(rightX, fringeY - 4, 35, 8)
        }
      }

      // 标注
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '11px monospace'
      ctx.fillText('光源', leftX - 20, 25)
      ctx.fillText('双缝', leftX + 15, 25)
      ctx.fillText('屏幕', rightX + 5, 25)

      // 绘制相位指示箭头
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(leftX + 35, slitY1)
      ctx.lineTo(rightX - 30, centerY)
      ctx.moveTo(leftX + 35, slitY2)
      ctx.lineTo(rightX - 30, centerY)
      ctx.stroke()
      ctx.setLineDash([])

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [params])

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  // 计算条纹间距
  const fringeSpacing = (params.wavelength * params.screenDistance / params.slitDistance * 4).toFixed(2)
  const maxOrder = Math.floor(params.slitDistance / params.wavelength * 2.5)

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: WAVE_COLORS.background,
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
          <ParamDisplay label="条纹间距" value={`${fringeSpacing} px`} color={WAVE_COLORS.constructive} />
          <ParamDisplay label="最大级次" value={maxOrder} color={WAVE_COLORS.wave1} />
          <ParamDisplay label="加强区" value={params.showConstructive ? '显示' : '隐藏'} color={WAVE_COLORS.constructive} />
          <ParamDisplay label="相消区" value={params.showDestructive ? '显示' : '隐藏'} color={WAVE_COLORS.destructive} />
        </div>

        {/* 滑块 */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <SliderControl label="波长" value={params.wavelength} min={0.5} max={3} step={0.1} unit="λ" onChange={v => updateParam('wavelength', v)} color={WAVE_COLORS.wave1} />
          <SliderControl label="双缝间距" value={params.slitDistance} min={1} max={10} step={0.5} unit="d" onChange={v => updateParam('slitDistance', v)} color={WAVE_COLORS.wave2} />
          <SliderControl label="屏幕距离" value={params.screenDistance} min={5} max={20} step={0.5} unit="L" onChange={v => updateParam('screenDistance', v)} color={WAVE_COLORS.wave1} />
        </div>

        {/* 切换 */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <ToggleControl label="加强区" checked={params.showConstructive} onChange={v => updateParam('showConstructive', v)} color={WAVE_COLORS.constructive} />
          <ToggleControl label="相消区" checked={params.showDestructive} onChange={v => updateParam('showDestructive', v)} color={WAVE_COLORS.destructive} />
        </div>
      </div>
    </div>
  )
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