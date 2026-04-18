import { useState, useEffect, useRef } from 'react'

// 酸碱滴定颜色配置
const ACID_COLORS = {
  acid: '#E74C3C',
  base: '#3498DB',
  neutral: '#27AE60',
  phenolphthalein: '#FF69B4',
  methylOrange: '#FFA500',
  background: '#0a0a14'
}

export default function AcidBaseVisualization() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [params, setParams] = useState({
    acidConcentration: 0.05,
    baseConcentration: 0.05,
    initialVolume: 25,
    indicator: '酚酞(8.2-10.0)',
    currentVolume: 0,
    currentPH: 1,
    isTitrating: false
  })

  // 计算pH
  const calculatePH = (volume) => {
    const totalOH = volume * params.baseConcentration
    const totalH = params.initialVolume * params.acidConcentration
    const netOH = totalOH - totalH

    if (Math.abs(netOH) < 0.0001) return 7
    const totalVolume = params.initialVolume + volume

    if (netOH < 0) {
      // 酸过量
      const excessH = -netOH / totalVolume
      return -Math.log10(excessH)
    } else {
      // 碱过量
      const excessOH = netOH / totalVolume
      return 14 + Math.log10(excessOH)
    }
  }

  // 滴定动画
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

    const animate = () => {
      // 清空画布
      ctx.fillStyle = ACID_COLORS.background
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const beakerX = centerX - 100
      const beakerY = height / 2 + 50
      const beakerWidth = 160
      const beakerHeight = 180

      // 绘制烧杯
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(beakerX, beakerY - beakerHeight)
      ctx.lineTo(beakerX, beakerY)
      ctx.lineTo(beakerX + beakerWidth, beakerY)
      ctx.lineTo(beakerX + beakerWidth, beakerY - beakerHeight)
      ctx.stroke()

      // 烧杯底部弧线
      ctx.beginPath()
      ctx.arc(beakerX + beakerWidth / 2, beakerY, beakerWidth / 2, 0, Math.PI)
      ctx.stroke()

      // 液体高度
      const liquidHeight = Math.min((params.currentVolume / 60) * (beakerHeight - 10), beakerHeight - 10)
      const liquidY = beakerY - liquidHeight

      // 根据pH值计算颜色
      const ph = params.currentPH
      let liquidColor
      if (ph < 3) {
        liquidColor = ACID_COLORS.acid
      } else if (ph > 10) {
        liquidColor = params.indicator.includes('酚酞') ? ACID_COLORS.phenolphthalein : ACID_COLORS.methylOrange
      } else if (ph >= 6 && ph <= 8) {
        liquidColor = ACID_COLORS.neutral
      } else {
        const t = Math.min(1, Math.max(0, (ph - 3) / 10))
        liquidColor = interpolateColor(ACID_COLORS.acid, ACID_COLORS.neutral, t)
      }

      // 液体渐变
      const liquidGradient = ctx.createLinearGradient(beakerX, liquidY, beakerX, beakerY)
      liquidGradient.addColorStop(0, liquidColor)
      liquidGradient.addColorStop(1, `${liquidColor}88`)
      ctx.fillStyle = liquidGradient
      ctx.beginPath()
      ctx.moveTo(beakerX + 2, liquidY)
      ctx.lineTo(beakerX + beakerWidth - 2, liquidY)
      ctx.lineTo(beakerX + beakerWidth - 2, beakerY)
      ctx.arc(beakerX + beakerWidth / 2, beakerY, (beakerWidth - 4) / 2, 0, Math.PI, true)
      ctx.closePath()
      ctx.fill()

      // 气泡效果
      for (let i = 0; i < 5; i++) {
        const bubbleX = beakerX + 20 + (i * 25)
        const bubbleY = liquidY + 20 + Math.sin(Date.now() / 500 + i) * 10
        const bubbleSize = 3 + (i % 3)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.beginPath()
        ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2)
        ctx.fill()
      }

      // 绘制滴定管
      const buretteX = centerX + 80
      const buretteTop = beakerY - beakerHeight - 60
      const buretteWidth = 25
      const buretteHeight = beakerY - buretteTop

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 2
      ctx.strokeRect(buretteX - buretteWidth / 2, buretteTop, buretteWidth, buretteHeight)

      // 滴定管液面
      const filledRatio = Math.max(0, 1 - params.currentVolume / 100)
      const liquidInBurette = buretteHeight * filledRatio
      const buretteLiquidTop = buretteTop + (buretteHeight - liquidInBurette)

      const baseGradient = ctx.createLinearGradient(buretteX - buretteWidth / 2, buretteLiquidTop, buretteX - buretteWidth / 2, beakerY)
      baseGradient.addColorStop(0, ACID_COLORS.base)
      baseGradient.addColorStop(1, `${ACID_COLORS.base}88`)
      ctx.fillStyle = baseGradient
      ctx.fillRect(buretteX - buretteWidth / 2 + 2, buretteLiquidTop, buretteWidth - 4, liquidInBurette)

      // 滴管尖
      ctx.fillStyle = ACID_COLORS.base
      ctx.beginPath()
      ctx.moveTo(buretteX - 4, beakerY - 10)
      ctx.lineTo(buretteX + 4, beakerY - 10)
      ctx.lineTo(buretteX, beakerY)
      ctx.closePath()
      ctx.fill()

      // 液滴
      if (params.isTitrating && params.currentVolume < 50) {
        const dropProgress = (Date.now() % 1000) / 1000
        const dropY = beakerY - 10 - dropProgress * 30
        ctx.fillStyle = ACID_COLORS.base
        ctx.beginPath()
        ctx.arc(buretteX, dropY, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      // 滴定管刻度
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '9px monospace'
      for (let i = 0; i <= 10; i++) {
        const y = beakerY - 10 - (i * (buretteHeight - 20) / 10)
        ctx.fillText(`${10 - i}`, buretteX + buretteWidth / 2 + 5, y + 3)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.beginPath()
        ctx.moveTo(buretteX + buretteWidth / 2 - 3, y)
        ctx.lineTo(buretteX + buretteWidth / 2 + 3, y)
        ctx.stroke()
      }

      // pH试纸
      const phStripX = beakerX - 50
      const phStripY = beakerY - beakerHeight - 30
      const phGradient = ctx.createLinearGradient(phStripX, 0, phStripX, 100)
      phGradient.addColorStop(0, '#E74C3C')
      phGradient.addColorStop(0.3, '#F39C12')
      phGradient.addColorStop(0.5, '#27AE60')
      phGradient.addColorStop(0.7, '#3498DB')
      phGradient.addColorStop(1, '#9B59B6')
      ctx.fillStyle = phGradient
      ctx.fillRect(phStripX, phStripY, 12, 100)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.strokeRect(phStripX, phStripY, 12, 100)

      // pH标记线
      const phMarkerY = phStripY + 100 - (Math.min(14, Math.max(0, ph)) / 14) * 100
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.moveTo(phStripX - 5, phMarkerY)
      ctx.lineTo(phStripX - 12, phMarkerY - 5)
      ctx.lineTo(phStripX - 12, phMarkerY + 5)
      ctx.closePath()
      ctx.fill()

      // 标签
      ctx.fillStyle = ACID_COLORS.acid
      ctx.font = 'bold 14px serif'
      ctx.fillText('HCl', beakerX + beakerWidth / 2 - 15, beakerY - beakerHeight - 15)

      ctx.fillStyle = ACID_COLORS.base
      ctx.fillText('NaOH', buretteX - 15, buretteTop - 10)

      ctx.fillStyle = '#fff'
      ctx.font = '12px monospace'
      ctx.fillText(`pH: ${ph.toFixed(1)}`, beakerX - 60, phStripY - 10)
      ctx.fillText(`V: ${params.currentVolume.toFixed(1)}mL`, beakerX - 60, phStripY + 115)

      // pH标尺
      ctx.font = '9px monospace'
      ctx.fillStyle = '#888'
      for (let i = 0; i <= 14; i += 2) {
        const y = phStripY + 100 - (i / 14) * 100
        ctx.fillText(`${i}`, phStripX + 18, y + 3)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [params])

  const startTitrating = () => {
    if (params.isTitrating) return
    setParams(prev => ({ ...prev, isTitrating: true }))

    const interval = setInterval(() => {
      setParams(prev => {
        if (prev.currentVolume >= 50) {
          clearInterval(interval)
          return { ...prev, isTitrating: false }
        }
        const newVolume = prev.currentVolume + 0.3
        return { ...prev, currentVolume: newVolume, currentPH: calculatePH(newVolume) }
      })
    }, 30)
  }

  const reset = () => {
    setParams(prev => ({ ...prev, currentVolume: 0, currentPH: 1, isTitrating: false }))
  }

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: ACID_COLORS.background,
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
          <ParamDisplay label="当前pH" value={params.currentPH.toFixed(1)} color={getPHColor(params.currentPH)} />
          <ParamDisplay label="滴定体积" value={`${params.currentVolume.toFixed(1)}mL`} color={ACID_COLORS.base} />
          <ParamDisplay label="等当点" value="pH=7" color={ACID_COLORS.neutral} />
          <ParamDisplay label="变色范围" value={params.indicator.includes('酚酞') ? '8.2-10.0' : '3.1-4.4'} color={ACID_COLORS.phenolphthalein} />
        </div>

        {/* 滑块 */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <SliderControl label="酸浓度" value={params.acidConcentration} min={0.01} max={0.1} step={0.01} unit="mol/L" onChange={v => updateParam('acidConcentration', v)} color={ACID_COLORS.acid} />
          <SliderControl label="碱浓度" value={params.baseConcentration} min={0.01} max={0.1} step={0.01} unit="mol/L" onChange={v => updateParam('baseConcentration', v)} color={ACID_COLORS.base} />
          <SliderControl label="初始体积" value={params.initialVolume} min={10} max={50} step={1} unit="mL" onChange={v => updateParam('initialVolume', v)} color={ACID_COLORS.acid} />
        </div>

        {/* 按钮 */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button
            onClick={startTitrating}
            disabled={params.isTitrating}
            style={{
              padding: '10px 28px',
              background: params.isTitrating ? '#333' : ACID_COLORS.base,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: params.isTitrating ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {params.isTitrating ? '滴定中...' : '开始滴定'}
          </button>
          <button
            onClick={reset}
            style={{
              padding: '10px 28px',
              background: 'transparent',
              color: '#fff',
              border: '1px solid #666',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            重置
          </button>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="indicator"
                checked={params.indicator.includes('酚酞')}
                onChange={() => updateParam('indicator', '酚酞(8.2-10.0)')}
                style={{ accentColor: ACID_COLORS.phenolphthalein }}
              />
              <span style={{ fontSize: '12px', color: '#aaa' }}>酚酞</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="indicator"
                checked={params.indicator.includes('甲基橙')}
                onChange={() => updateParam('indicator', '甲基橙(3.1-4.4)')}
                style={{ accentColor: ACID_COLORS.methylOrange }}
              />
              <span style={{ fontSize: '12px', color: '#aaa' }}>甲基橙</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

function getPHColor(ph) {
  if (ph < 4) return '#E74C3C'
  if (ph < 6) return '#F39C12'
  if (ph < 8) return '#27AE60'
  if (ph < 10) return '#3498DB'
  return '#9B59B6'
}

function interpolateColor(color1, color2, t) {
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)
  const r = Math.round(c1.r + (c2.r - c1.r) * t)
  const g = Math.round(c1.g + (c2.g - c1.g) * t)
  const b = Math.round(c1.b + (c2.b - c1.b) * t)
  return `rgb(${r}, ${g}, ${b})`
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
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