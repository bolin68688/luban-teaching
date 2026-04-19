import { useEffect, useRef } from 'react'

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

export default function TrigonometryVisualization({ params = {} }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const sizeRef = useRef({ width: 0, height: 0 })

  // 从props获取参数，带默认值
  const trigParams = {
    angle: params['角度θ'] ?? 45,
    amplitude: params['振幅A'] ?? 1,
    frequency: params['频率ω'] ?? 1,
    phase: params['相位φ'] ?? 0,
    showSin: params['正弦'] !== false,
    showCos: params['余弦'] !== false,
    showTan: params['正切'] === true
  }

  // 绘制三角函数
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const dpr = window.devicePixelRatio || 1
    const ctx = canvas.getContext('2d')

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === sizeRef.current.width && h === sizeRef.current.height) return
      sizeRef.current = { width: w, height: h }
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    const draw = () => {
      resize()
      const width = sizeRef.current.width
      const height = sizeRef.current.height

      ctx.fillStyle = TRIG_COLORS.background
      ctx.fillRect(0, 0, width, height)

      const unitCircleCenterX = Math.min(150, width * 0.22)
      const unitCircleCenterY = height / 2
      const unitCircleRadius = Math.min(80, width * 0.12)
      const graphOriginX = width * 0.4
      const graphOriginY = height / 2
      const graphWidth = width - graphOriginX - 40
      const graphHeight = Math.min(140, height * 0.4)

      drawAxis(ctx, graphOriginX, graphOriginY, graphWidth, graphHeight)
      drawUnitCircle(ctx, unitCircleCenterX, unitCircleCenterY, unitCircleRadius)

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
      ctx.font = `bold ${Math.max(14, 16 * Math.min(1, width/800))}px serif`
      ctx.fillText(`θ = ${trigParams.angle}°`, 20, 35)

      // sin/cos值标注
      ctx.font = `bold ${Math.max(11, 13 * Math.min(1, width/800))}px monospace`
      ctx.fillStyle = TRIG_COLORS.sin
      ctx.fillText(`sin = ${Math.sin(angleRad).toFixed(3)}`, 20, unitCircleCenterY + unitCircleRadius + 40)
      ctx.fillStyle = TRIG_COLORS.cos
      ctx.fillText(`cos = ${Math.cos(angleRad).toFixed(3)}`, 20, unitCircleCenterY + unitCircleRadius + 60)
      ctx.fillStyle = TRIG_COLORS.tan
      ctx.fillText(`tan = ${Math.tan(angleRad).toFixed(2)}`, 20, unitCircleCenterY + unitCircleRadius + 80)
    }

    draw()

    const ro = new ResizeObserver(draw)
    ro.observe(container)

    return () => ro.disconnect()
  }, [trigParams.angle, trigParams.amplitude, trigParams.frequency, trigParams.phase, trigParams.showSin, trigParams.showCos, trigParams.showTan])

  return (
    <div ref={containerRef} style={{
      width: '100%',
      height: '100%',
      background: TRIG_COLORS.background,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}

function drawAxis(ctx, originX, originY, width, height) {
  ctx.strokeStyle = TRIG_COLORS.grid
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(originX - 10, originY)
  ctx.lineTo(originX + width + 10, originY)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(originX, originY - height - 10)
  ctx.lineTo(originX, originY + height + 10)
  ctx.stroke()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.font = '10px monospace'
  ctx.fillText('0', originX - 12, originY + 12)
  ctx.fillText('π', originX + width * 0.5 - 3, originY + 12)
  ctx.fillText('2π', originX + width - 15, originY + 12)
  ctx.fillText('1', originX - 18, originY - height + 3)
  ctx.fillText('-1', originX - 20, originY + height + 10)
}

function drawUnitCircle(ctx, cx, cy, r) {
  ctx.strokeStyle = TRIG_COLORS.unitCircle
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = TRIG_COLORS.grid
  ctx.lineWidth = 1
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath()
    ctx.arc(cx, cy, r * i / 3, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.moveTo(cx - r - 10, cy)
  ctx.lineTo(cx + r + 10, cy)
  ctx.moveTo(cx, cy - r - 10)
  ctx.lineTo(cx, cy + r + 10)
  ctx.stroke()
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
  ctx.fillStyle = TRIG_COLORS.unitCircle
  ctx.beginPath()
  ctx.arc(cx, cy, 4, 0, Math.PI * 2)
  ctx.fill()
}

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
      case 'sin': y = Math.sin(freq * x + phase); break
      case 'cos': y = Math.cos(freq * x + phase); break
      case 'tan':
        y = Math.tan(freq * x + phase)
        if (Math.abs(y) > 3) y = y > 0 ? 3 : -3
        break
      default: y = 0
    }
    const py = originY - y * amp
    if (px === 0) ctx.moveTo(originX + px, py)
    else ctx.lineTo(originX + px, py)
  }
  ctx.stroke()
  ctx.strokeStyle = `${color}40`
  ctx.lineWidth = 8
  ctx.stroke()
}
