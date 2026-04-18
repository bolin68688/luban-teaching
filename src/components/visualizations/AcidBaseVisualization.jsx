import { useState, useEffect, useRef } from 'react'

// 酸碱滴定颜色配置
const ACID_COLORS = {
  acid: '#E74C3C',      // 强酸红
  base: '#3498DB',       // 强碱蓝
  neutral: '#27AE60',    // 中性绿
  phenolphthalein: '#FF69B4', // 酚酞粉红
  methylOrange: '#FFA500', // 甲基橙
  background: '#0a0a14'
}

export default function AcidBaseVisualization({ params, controls }) {
  const canvasRef = useRef(null)
  const [titrationParams, setTitrationParams] = useState({
    acidConcentration: 0.05,
    baseConcentration: 0.05,
    initialVolume: 25,
    indicator: 'phenolphthalein',
    showCurve: true,
    currentVolume: 0,
    currentPH: 7,
    isTitrating: false
  })

  const [displayParams, setDisplayParams] = useState({
    equivalencePoint: 7,
    titrantVolume: '25.00',
    phIndicator: '8.2-10.0',
    neutralizationHeat: '-57.3'
  })

  // 滴定动画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.fillStyle = ACID_COLORS.background
    ctx.fillRect(0, 0, width, height)

    const centerX = width / 2
    const beakerX = centerX - 120
    const beakerY = height / 2 + 30
    const beakerWidth = 180
    const beakerHeight = 200

    // 绘制烧杯
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(beakerX, beakerY - beakerHeight)
    ctx.lineTo(beakerX, beakerY)
    ctx.lineTo(beakerX + beakerWidth, beakerY)
    ctx.lineTo(beakerX + beakerWidth, beakerY - beakerHeight)
    ctx.stroke()

    // 烧杯液体
    const liquidHeight = (titrationParams.currentVolume / 50) * (beakerHeight - 20)
    const liquidY = beakerY - liquidHeight

    // 根据pH值计算颜色
    const ph = titrationParams.currentPH
    let liquidColor
    if (ph < 4) {
      liquidColor = ACID_COLORS.acid
    } else if (ph > 10) {
      liquidColor = titrationParams.indicator === 'phenolphthalein' ? ACID_COLORS.phenolphthalein : ACID_COLORS.methylOrange
    } else {
      // pH 4-10 渐变
      const t = (ph - 4) / 6
      liquidColor = interpolateColor(ACID_COLORS.acid, ACID_COLORS.neutral, t)
    }

    // 液体渐变
    const liquidGradient = ctx.createLinearGradient(beakerX, liquidY, beakerX, beakerY)
    liquidGradient.addColorStop(0, liquidColor)
    liquidGradient.addColorStop(1, `${liquidColor}88`)
    ctx.fillStyle = liquidGradient
    ctx.fillRect(beakerX + 2, liquidY, beakerWidth - 4, liquidY < beakerY ? beakerY - liquidY : 0)

    // 绘制滴定管
    const buretteX = centerX + 100
    const buretteTop = beakerY - beakerHeight - 50

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.strokeRect(buretteX - 15, buretteTop, 30, beakerY - buretteTop)

    // 滴定管液体（碱液蓝色）
    const buretteLiquidHeight = 150
    const buretteLiquidTop = beakerY - 30
    const buretteLiquidBottom = buretteLiquidTop - buretteLiquidHeight
    const filledRatio = 1 - (titrationParams.currentVolume / 100)
    const liquidInBuretteTop = buretteLiquidBottom + (buretteLiquidTop - buretteLiquidBottom) * filledRatio

    const baseGradient = ctx.createLinearGradient(buretteX - 13, liquidInBuretteTop, buretteX - 13, buretteLiquidTop)
    baseGradient.addColorStop(0, ACID_COLORS.base)
    baseGradient.addColorStop(1, `${ACID_COLORS.base}88`)
    ctx.fillStyle = baseGradient
    ctx.fillRect(buretteX - 13, liquidInBuretteTop, 26, buretteLiquidTop - liquidInBuretteTop)

    // 液滴
    if (titrationParams.isTitrating) {
      const dropY = beakerY - beakerHeight + 20
      const dropSize = 6
      ctx.fillStyle = ACID_COLORS.base
      ctx.beginPath()
      ctx.arc(centerX + 100, dropY, dropSize, 0, Math.PI * 2)
      ctx.fill()
    }

    // 滴定管刻度
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.font = '10px var(--font-mono)'
    for (let i = 0; i <= 10; i++) {
      const y = beakerY - 30 - (i * 15)
      ctx.fillText(`${10 - i}`, buretteX + 20, y + 3)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.beginPath()
      ctx.moveTo(buretteX + 15, y)
      ctx.lineTo(buretteX + 13, y)
      ctx.stroke()
    }

    // pH试纸显示
    const phStripY = beakerY - beakerHeight - 100
    const phGradient = ctx.createLinearGradient(phStripY, 0, phStripY + 100, 0)
    phGradient.addColorStop(0, '#E74C3C')
    phGradient.addColorStop(0.4, '#E74C3C')
    phGradient.addColorStop(0.5, '#27AE60')
    phGradient.addColorStop(0.6, '#3498DB')
    phGradient.addColorStop(1, '#3498DB')
    ctx.fillStyle = phGradient
    ctx.fillRect(beakerX - 60, phStripY, 15, 100)

    // 试纸框
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.strokeRect(beakerX - 60, phStripY, 15, 100)

    // 当前pH标记
    const phMarkerY = phStripY + 100 - (ph / 14) * 100
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.moveTo(beakerX - 60, phMarkerY)
    ctx.lineTo(beakerX - 70, phMarkerY - 5)
    ctx.lineTo(beakerX - 70, phMarkerY + 5)
    ctx.closePath()
    ctx.fill()

    // 标签
    ctx.fillStyle = ACID_COLORS.acid
    ctx.font = 'bold 14px var(--font-serif)'
    ctx.fillText('HCl', beakerX + 20, beakerY - beakerHeight - 10)

    ctx.fillStyle = ACID_COLORS.base
    ctx.fillText('NaOH', buretteX - 10, buretteTop - 10)

    ctx.fillStyle = '#fff'
    ctx.font = '12px var(--font-mono)'
    ctx.fillText(`pH: ${ph.toFixed(1)}`, beakerX - 50, phStripY - 20)
    ctx.fillText(`V: ${titrationParams.currentVolume.toFixed(1)}mL`, beakerX - 50, phStripY - 5)

  }, [titrationParams])

  // 开始滴定
  const startTitrating = () => {
    if (titrationParams.isTitrating) return
    setTitrationParams(prev => ({ ...prev, isTitrating: true }))

    const interval = setInterval(() => {
      setTitrationParams(prev => {
        if (prev.currentVolume >= 50) {
          clearInterval(interval)
          return { ...prev, isTitrating: false }
        }

        const newVolume = prev.currentVolume + 0.5
        // 简化pH计算
        const totalOH = newVolume * prev.baseConcentration
        const totalH = prev.initialVolume * prev.acidConcentration
        const netOH = totalOH - totalH

        let newPH
        if (netOH < 0) {
          // 酸过量
          const excessH = -netOH / (prev.initialVolume + newVolume) * 1000
          newPH = -Math.log10(excessH / 1000)
        } else if (netOH > 0) {
          // 碱过量
          const excessOH = netOH / (prev.initialVolume + newVolume) * 1000
          newPH = 14 + Math.log10(excessOH / 1000)
        } else {
          newPH = 7
        }

        newPH = Math.max(0, Math.min(14, newPH))

        return { ...prev, currentVolume: newVolume, currentPH: newPH }
      })
    }, 50)
  }

  const reset = () => {
    setTitrationParams(prev => ({
      ...prev,
      currentVolume: 0,
      currentPH: 1,
      isTitrating: false
    }))
  }

  // 绑定控制器
  useEffect(() => {
    const handleSlider = (e) => {
      const { name, value } = e.detail
      setTitrationParams(prev => ({ ...prev, [name]: parseFloat(value) }))
    }
    const handleSelect = (e) => {
      const { value } = e.detail
      setTitrationParams(prev => ({ ...prev, indicator: value }))
    }
    window.addEventListener('acid-control', handleSlider)
    window.addEventListener('acid-select', handleSelect)
    return () => {
      window.removeEventListener('acid-control', handleSlider)
      window.removeEventListener('acid-select', handleSelect)
    }
  }, [])

  return (
    <div style={{
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: ACID_COLORS.background
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
          label="等当点pH"
          value={displayParams.equivalencePoint.toFixed(1)}
          color={ACID_COLORS.neutral}
        />
        <ParameterDisplay
          label="滴定体积"
          value={`${titrationParams.currentVolume.toFixed(2)}mL`}
          color={ACID_COLORS.base}
        />
        <ParameterDisplay
          label="变色范围"
          value={displayParams.phIndicator}
          color={ACID_COLORS.phenolphthalein}
        />
        <ParameterDisplay
          label="当前pH"
          value={titrationParams.currentPH.toFixed(1)}
          color={getPHColor(titrationParams.currentPH)}
        />
      </div>

      {/* 控制面板 */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <ControlSlider
            label="酸浓度"
            name="acidConcentration"
            min={0.01}
            max={0.1}
            step={0.01}
            value={titrationParams.acidConcentration}
            unit="mol/L"
            color={ACID_COLORS.acid}
          />
          <ControlSlider
            label="碱浓度"
            name="baseConcentration"
            min={0.01}
            max={0.1}
            step={0.01}
            value={titrationParams.baseConcentration}
            unit="mol/L"
            color={ACID_COLORS.base}
          />
          <ControlSlider
            label="初始体积"
            name="initialVolume"
            min={10}
            max={50}
            step={1}
            value={titrationParams.initialVolume}
            unit="mL"
            color={ACID_COLORS.acid}
          />
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={startTitrating}
              disabled={titrationParams.isTitrating}
              style={{
                padding: '8px 24px',
                background: titrationParams.isTitrating ? '#333' : ACID_COLORS.base,
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: titrationParams.isTitrating ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {titrationParams.isTitrating ? '滴定中...' : '开始滴定'}
            </button>
            <button
              onClick={reset}
              style={{
                padding: '8px 24px',
                background: 'transparent',
                color: '#fff',
                border: '1px solid #666',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              重置
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 颜色插值
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

// 根据pH值获取颜色
function getPHColor(ph) {
  if (ph < 4) return '#E74C3C'
  if (ph < 6) return '#F39C12'
  if (ph < 8) return '#27AE60'
  if (ph < 10) return '#3498DB'
  return '#9B59B6'
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
    window.dispatchEvent(new CustomEvent('acid-control', {
      detail: { name, value: parseFloat(e.target.value) }
    }))
  }

  return (
    <div style={{ flex: '1 1 100px', minWidth: '100px' }}>
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