import { useState, useEffect, useRef } from 'react'

// 三角函数颜色配置
const TRIG_COLORS = {
  sin: '#E74C3C',
  cos: '#3498DB',
  tan: '#27AE60',
  unitCircle: '#F39C12',
  text: '#D4AF37',
  background: '#0a0a14',
  grid: 'rgba(255, 255, 255, 0.1)'
}

export default function TrigonometryVisualization() {
  const canvasRef = useRef(null)
  const [trigParams, setTrigParams] = useState({
    angle: 45,
    amplitude: 1,
    frequency: 1,
    phase: 0,
    showSin: true,
    showCos: true,
    showTan: false
  })

  // 绘制三角函数
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 设置高清Canvas
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

    // 清空画布
    ctx.fillStyle = TRIG_COLORS.background
    ctx.fillRect(0, 0, width, height)

    // 画布布局：左侧单位圆，右侧函数图像
    const unitCircleCenterX = Math.min(150, width * 0.22)
    const unitCircleCenterY = height / 2
    const unitCircleRadius = Math.min(80, width * 0.12)
    const graphOriginX = width * 0.4
    const graphOriginY = height / 2
    const graphWidth = width - graphOriginX - 40
    const graphHeight = Math.min(140, height * 0.4)

    // 绘制坐标轴
    drawAxis(ctx, graphOriginX, graphOriginY, graphWidth, graphHeight)

    // 绘制单位圆
    drawUnitCircle(ctx, unitCircleCenterX, unitCircleCenterY, unitCircleRadius)

    // 绘制角度点和线
    const angleRad = (trigParams.angle * Math.PI) / 180
    const pointX = unitCircleCenterX + Math.cos(angleRad) * unitCircleRadius
    const pointY = unitCircleCenterY - Math.sin(angleRad) * unitCircleRadius

    // 半径线
    ctx.strokeStyle = TRIG_COLORS.unitCircle
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(unitCircleCenterX, unitCircleCenterY)
    ctx.lineTo(pointX, pointY)
    ctx.stroke()

    // 垂直线（sin）
    ctx.strokeStyle = TRIG_COLORS.sin
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(pointX, unitCircleCenterY)
    ctx.lineTo(pointX, pointY)
    ctx.stroke()

    // 水平线（cos）
    ctx.strokeStyle = TRIG_COLORS.cos
    ctx.beginPath()
    ctx.moveTo(unitCircleCenterX, pointY)
    ctx.lineTo(pointX, pointY)
    ctx.stroke()
    ctx.setLineDash([])

    // 点
    const pointGradient = ctx.createRadialGradient(pointX - 2, pointY - 2, 0, pointX, pointY, 8)
    pointGradient.addColorStop(0, '#fff')
    pointGradient.addColorStop(1, TRIG_COLORS.unitCircle)
    ctx.fillStyle = pointGradient
    ctx.beginPath()
    ctx.arc(pointX, pointY, 8, 0, Math.PI * 2)
    ctx.fill()

    // 绘制三角函数图像
    if (trigParams.showSin) {
      drawSineWave(ctx, graphOriginX, graphOriginY, graphWidth, graphHeight, trigParams, TRIG_COLORS.sin, 'sin')
    }
    if (trigParams.showCos) {
      drawSineWave(ctx, graphOriginX, graphOriginY, graphWidth, graphHeight, trigParams, TRIG_COLORS.cos, 'cos')
    }
    if (trigParams.showTan) {
      drawSineWave(ctx, graphOriginX, graphOriginY, graphWidth, graphHeight, trigParams, TRIG_COLORS.tan, 'tan')
    }

    // 当前角度垂直线
    const currentX = graphOriginX + (angleRad / (4 * Math.PI)) * graphWidth
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(currentX, graphOriginY - graphHeight - 20)
    ctx.lineTo(currentX, graphOriginY + graphHeight + 20)
    ctx.stroke()
    ctx.setLineDash([])

    // 角度标签
    ctx.fillStyle = TRIG_COLORS.unitCircle
    ctx.font = 'bold 16px serif'
    ctx.fillText(`θ = ${trigParams.angle}°`, 20, 35)

    // sin/cos值标注
    ctx.font = 'bold 13px monospace'
    ctx.fillStyle = TRIG_COLORS.sin
    ctx.fillText(`sin = ${Math.sin(angleRad).toFixed(3)}`, 20, unitCircleCenterY + unitCircleRadius + 40)
    ctx.fillStyle = TRIG_COLORS.cos
    ctx.fillText(`cos = ${Math.cos(angleRad).toFixed(3)}`, 20, unitCircleCenterY + unitCircleRadius + 60)
    ctx.fillStyle = TRIG_COLORS.tan
    ctx.fillText(`tan = ${Math.tan(angleRad).toFixed(3)}`, 20, unitCircleCenterY + unitCircleRadius + 80)

  }, [trigParams])

  const updateParam = (key, value) => {
    setTrigParams(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: TRIG_COLORS.background,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Canvas区域 */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* 控制面板 */}
      <div style={{
        padding: '16px',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* 参数显示 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '12px'
        }}>
          <ParamDisplay label="sin(θ)" value={Math.sin(trigParams.angle * Math.PI / 180).toFixed(3)} color={TRIG_COLORS.sin} />
          <ParamDisplay label="cos(θ)" value={Math.cos(trigParams.angle * Math.PI / 180).toFixed(3)} color={TRIG_COLORS.cos} />
          <ParamDisplay label="tan(θ)" value={Math.tan(trigParams.angle * Math.PI / 180).toFixed(2)} color={TRIG_COLORS.tan} />
          <ParamDisplay label="单位圆点" value={`(${Math.cos(trigParams.angle * Math.PI / 180).toFixed(2)}, ${Math.sin(trigParams.angle * Math.PI / 180).toFixed(2)})`} color={TRIG_COLORS.unitCircle} />
        </div>

        {/* 滑块 */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <SliderControl label="角度θ" value={trigParams.angle} min={0} max={360} step={1} unit="°" onChange={v => updateParam('angle', v)} color={TRIG_COLORS.unitCircle} />
          <SliderControl label="振幅" value={trigParams.amplitude} min={0.5} max={3} step={0.1} onChange={v => updateParam('amplitude', v)} color={TRIG_COLORS.sin} />
          <SliderControl label="频率" value={trigParams.frequency} min={0.5} max={3} step={0.1} onChange={v => updateParam('frequency', v)} color={TRIG_COLORS.cos} />
        </div>

        {/* 切换 */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <ToggleControl label="正弦" checked={trigParams.showSin} onChange={v => updateParam('showSin', v)} color={TRIG_COLORS.sin} />
          <ToggleControl label="余弦" checked={trigParams.showCos} onChange={v => updateParam('showCos', v)} color={TRIG_COLORS.cos} />
          <ToggleControl label="正切" checked={trigParams.showTan} onChange={v => updateParam('showTan', v)} color={TRIG_COLORS.tan} />
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
    <div style={{ flex: '1 1 120px', minWidth: '100px' }}>
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

// 绘制坐标轴
function drawAxis(ctx, originX, originY, width, height) {
  ctx.strokeStyle = TRIG_COLORS.grid
  ctx.lineWidth = 1

  // X轴
  ctx.beginPath()
  ctx.moveTo(originX - 10, originY)
  ctx.lineTo(originX + width + 10, originY)
  ctx.stroke()

  // Y轴（原点处）
  ctx.beginPath()
  ctx.moveTo(originX, originY - height - 10)
  ctx.lineTo(originX, originY + height + 10)
  ctx.stroke()

  // 刻度标签
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.font = '10px monospace'
  ctx.fillText('0', originX - 12, originY + 12)
  ctx.fillText('π', originX + width * 0.5 - 3, originY + 12)
  ctx.fillText('2π', originX + width - 15, originY + 12)
  ctx.fillText('1', originX - 18, originY - height + 3)
  ctx.fillText('-1', originX - 20, originY + height + 10)
}

// 绘制单位圆
function drawUnitCircle(ctx, cx, cy, r) {
  // 外圈
  ctx.strokeStyle = TRIG_COLORS.unitCircle
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  // 内部网格
  ctx.strokeStyle = TRIG_COLORS.grid
  ctx.lineWidth = 1
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath()
    ctx.arc(cx, cy, r * i / 3, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 十字线
  ctx.beginPath()
  ctx.moveTo(cx - r - 10, cy)
  ctx.lineTo(cx + r + 10, cy)
  ctx.moveTo(cx, cy - r - 10)
  ctx.lineTo(cx, cy + r + 10)
  ctx.stroke()

  // 刻度点
  const angles = [0, 45, 90, 135, 180, 225, 270, 315]
  angles.forEach(deg => {
    const rad = (deg * Math.PI) / 180
    const x = cx + Math.cos(rad) * r
    const y = cy - Math.sin(rad) * r
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
  })

  // 圆心
  ctx.fillStyle = TRIG_COLORS.unitCircle
  ctx.beginPath()
  ctx.arc(cx, cy, 4, 0, Math.PI * 2)
  ctx.fill()
}

// 绘制三角函数波形
function drawSineWave(ctx, originX, originY, width, height, params, color, type) {
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()

  const amp = params.amplitude * height * 0.4
  const freq = params.frequency
  const phase = (params.phase * Math.PI) / 180
  const xScale = width / (4 * Math.PI)

  for (let px = 0; px <= width; px++) {
    const x = px / xScale
    let y

    switch (type) {
      case 'sin':
        y = Math.sin(freq * x + phase)
        break
      case 'cos':
        y = Math.cos(freq * x + phase)
        break
      case 'tan':
        y = Math.tan(freq * x + phase)
        if (Math.abs(y) > 3) y = y > 0 ? 3 : -3
        break
      default:
        y = 0
    }

    const py = originY - y * amp

    if (px === 0) {
      ctx.moveTo(originX + px, py)
    } else {
      ctx.lineTo(originX + px, py)
    }
  }
  ctx.stroke()

  // 发光效果
  ctx.strokeStyle = `${color}40`
  ctx.lineWidth = 8
  ctx.stroke()
}