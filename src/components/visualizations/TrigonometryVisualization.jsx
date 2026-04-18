import { useState, useEffect, useRef } from 'react'

// 三角函数颜色配置
const TRIG_COLORS = {
  sin: '#E74C3C',      // 正弦红色
  cos: '#3498DB',      // 余弦蓝色
  tan: '#27AE60',      // 正切绿色
  unitCircle: '#F39C12', // 单位圆金色
  text: '#D4AF37',
  background: '#0a0a14',
  grid: 'rgba(255, 255, 255, 0.08)'
}

export default function TrigonometryVisualization({ params, controls }) {
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

  // 绑定控制器
  useEffect(() => {
    const handleSlider = (e) => {
      const { name, value } = e.detail
      setTrigParams(prev => ({ ...prev, [name]: parseFloat(value) }))
    }
    const handleToggle = (e) => {
      const { name, checked } = e.detail
      setTrigParams(prev => ({ ...prev, [name]: checked }))
    }
    window.addEventListener('trig-control', handleSlider)
    window.addEventListener('trig-toggle', handleToggle)
    return () => {
      window.removeEventListener('trig-control', handleSlider)
      window.removeEventListener('trig-toggle', handleToggle)
    }
  }, [])

  // 绘制三角函数
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.fillStyle = TRIG_COLORS.background
    ctx.fillRect(0, 0, width, height)

    // 画布布局：左侧单位圆，右侧函数图像
    const unitCircleCenterX = 150
    const unitCircleCenterY = height / 2
    const unitCircleRadius = 100
    const graphOriginX = 320
    const graphOriginY = height / 2
    const graphWidth = width - graphOriginX - 40
    const graphHeight = 160

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
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(pointX, pointY, 6, 0, Math.PI * 2)
    ctx.fill()

    // 标注
    ctx.fillStyle = '#fff'
    ctx.font = '12px var(--font-mono)'
    ctx.fillText(`P(${Math.cos(angleRad).toFixed(2)}, ${Math.sin(angleRad).toFixed(2)})`, pointX + 10, pointY - 10)

    // sin值（垂直线长度）
    const sinValue = Math.sin(angleRad) * unitCircleRadius
    ctx.fillStyle = TRIG_COLORS.sin
    ctx.font = 'bold 12px var(--font-mono)'
    ctx.fillText(`sin = ${Math.sin(angleRad).toFixed(3)}`, 30, unitCircleCenterY + sinValue + 20)

    // cos值（水平线长度）
    ctx.fillStyle = TRIG_COLORS.cos
    ctx.fillText(`cos = ${Math.cos(angleRad).toFixed(3)}`, unitCircleCenterX + Math.cos(angleRad) * unitCircleRadius / 2 - 20, unitCircleCenterY + 20)

    // 绘制三角函数图像
    const time = Date.now() / 1000

    if (trigParams.showSin) {
      drawSineWave(ctx, graphOriginX, graphOriginY, graphWidth, graphHeight, trigParams, TRIG_COLORS.sin, time, 'sin')
    }
    if (trigParams.showCos) {
      drawSineWave(ctx, graphOriginX, graphOriginY, graphWidth, graphHeight, trigParams, TRIG_COLORS.cos, time, 'cos')
    }
    if (trigParams.showTan) {
      drawSineWave(ctx, graphOriginX, graphOriginY, graphWidth, graphHeight, trigParams, TRIG_COLORS.tan, time, 'tan')
    }

    // 当前角度垂直线
    const currentX = graphOriginX + (angleRad / (4 * Math.PI)) * graphWidth
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(currentX, graphOriginY - graphHeight)
    ctx.lineTo(currentX, graphOriginY + graphHeight)
    ctx.stroke()
    ctx.setLineDash([])

    // 角度标签
    ctx.fillStyle = TRIG_COLORS.unitCircle
    ctx.font = 'bold 14px var(--font-serif)'
    ctx.fillText(`θ = ${trigParams.angle}°`, 30, 40)

  }, [trigParams])

  return (
    <div style={{
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: TRIG_COLORS.background
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
          label="sin(θ)"
          value={Math.sin(trigParams.angle * Math.PI / 180).toFixed(3)}
          color={TRIG_COLORS.sin}
        />
        <ParameterDisplay
          label="cos(θ)"
          value={Math.cos(trigParams.angle * Math.PI / 180).toFixed(3)}
          color={TRIG_COLORS.cos}
        />
        <ParameterDisplay
          label="tan(θ)"
          value={Math.tan(trigParams.angle * Math.PI / 180).toFixed(3)}
          color={TRIG_COLORS.tan}
        />
        <ParameterDisplay
          label="单位圆点"
          value={`(${Math.cos(trigParams.angle * Math.PI / 180).toFixed(2)}, ${Math.sin(trigParams.angle * Math.PI / 180).toFixed(2)})`}
          color={TRIG_COLORS.unitCircle}
        />
      </div>

      {/* 控制面板 */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <ControlSlider
            label="角度θ"
            name="angle"
            min={0}
            max={360}
            step={1}
            value={trigParams.angle}
            unit="°"
            color={TRIG_COLORS.unitCircle}
          />
          <ControlSlider
            label="振幅A"
            name="amplitude"
            min={0.5}
            max={3}
            step={0.1}
            value={trigParams.amplitude}
            unit=""
            color={TRIG_COLORS.sin}
          />
          <ControlSlider
            label="频率ω"
            name="frequency"
            min={0.5}
            max={3}
            step={0.1}
            value={trigParams.frequency}
            unit=""
            color={TRIG_COLORS.cos}
          />
          <ControlSlider
            label="相位φ"
            name="phase"
            min={0}
            max={360}
            step={15}
            value={trigParams.phase}
            unit="°"
            color={TRIG_COLORS.tan}
          />
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <ControlToggle
              label="正弦"
              checked={trigParams.showSin}
              color={TRIG_COLORS.sin}
            />
            <ControlToggle
              label="余弦"
              checked={trigParams.showCos}
              color={TRIG_COLORS.cos}
            />
            <ControlToggle
              label="正切"
              checked={trigParams.showTan}
              color={TRIG_COLORS.tan}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// 绘制坐标轴
function drawAxis(ctx, originX, originY, width, height) {
  ctx.strokeStyle = TRIG_COLORS.grid
  ctx.lineWidth = 1

  // 水平线
  ctx.beginPath()
  ctx.moveTo(originX, originY - height)
  ctx.lineTo(originX + width, originY - height)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(originX, originY + height)
  ctx.lineTo(originX + width, originY + height)
  ctx.stroke()

  // 垂直线（原点处加粗）
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.beginPath()
  ctx.moveTo(originX, originY - height)
  ctx.lineTo(originX, originY + height)
  ctx.stroke()

  // 坐标轴
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(originX - 10, originY)
  ctx.lineTo(originX + width, originY)
  ctx.stroke()

  // X轴标签
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.font = '10px var(--font-mono)'
  ctx.fillText('0', originX - 5, originY + 15)
  ctx.fillText('π/2', originX + width * 0.25, originY + 15)
  ctx.fillText('π', originX + width * 0.5, originY + 15)
  ctx.fillText('3π/2', originX + width * 0.75, originY + 15)
  ctx.fillText('2π', originX + width - 10, originY + 15)

  // Y轴标签
  ctx.fillText('1', originX - 20, originY - height + 5)
  ctx.fillText('-1', originX - 22, originY + height + 5)
}

// 绘制单位圆
function drawUnitCircle(ctx, cx, cy, r) {
  // 圆圈
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
  ctx.moveTo(cx - r - 20, cy)
  ctx.lineTo(cx + r + 20, cy)
  ctx.moveTo(cx, cy - r - 20)
  ctx.lineTo(cx, cy + r + 20)
  ctx.stroke()

  // 刻度点
  const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]
  angles.forEach(deg => {
    const rad = (deg * Math.PI) / 180
    const x = cx + Math.cos(rad) * r
    const y = cy - Math.sin(rad) * r
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, Math.PI * 2)
    ctx.fill()
  })
}

// 绘制三角函数波形
function drawSineWave(ctx, originX, originY, width, height, params, color, time, type) {
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
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
        // 限制tan值范围
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
  ctx.lineWidth = 6
  ctx.stroke()
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
      <div style={{ fontSize: '16px', fontWeight: '600', color, fontFamily: 'var(--font-mono)' }}>{value}</div>
    </div>
  )
}

// 滑块控制器
function ControlSlider({ label, name, min, max, step, value, unit, color }) {
  const handleChange = (e) => {
    window.dispatchEvent(new CustomEvent('trig-control', {
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