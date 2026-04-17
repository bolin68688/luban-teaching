import { useRef, useEffect } from 'react'

export default function EquationVisualization({ caseId, simParams, isFullscreen }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (caseId !== 'equation') return

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    let width = container.clientWidth
    let height = container.clientHeight
    canvas.width = width
    canvas.height = height

    // 获取参数
    const m1 = parseFloat(simParams['直线1斜率']) || 1
    const b1 = parseFloat(simParams['直线1截距']) || 0
    const m2 = parseFloat(simParams['直线2斜率']) || -1
    const b2 = parseFloat(simParams['直线2截距']) || 5

    // 计算交点
    let solution = null
    let solutionType = '唯一解'
    if (Math.abs(m1 - m2) < 0.0001) {
      if (Math.abs(b1 - b2) < 0.0001) {
        solutionType = '无数解（两直线重合）'
      } else {
        solutionType = '无解（两直线平行）'
      }
    } else {
      const x = (b2 - b1) / (m1 - m2)
      const y = m1 * x + b1
      solution = { x: x.toFixed(2), y: y.toFixed(2) }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // 背景
      ctx.fillStyle = '#1A1A2E'
      ctx.fillRect(0, 0, width, height)

      // 坐标系参数
      const padding = 50
      const graphWidth = width - padding * 2
      const graphHeight = height - padding * 2
      const unitX = graphWidth / 12 // x: -6 to 6
      const unitY = graphHeight / 12 // y: -6 to 6
      const originX = width / 2
      const originY = height / 2

      // 坐标转换
      const toCanvasX = (x) => originX + x * unitX
      const toCanvasY = (y) => originY - y * unitY

      // 绘制网格
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      for (let x = -6; x <= 6; x++) {
        ctx.beginPath()
        ctx.moveTo(toCanvasX(x), padding)
        ctx.lineTo(toCanvasX(x), height - padding)
        ctx.stroke()
      }
      for (let y = -6; y <= 6; y++) {
        ctx.beginPath()
        ctx.moveTo(padding, toCanvasY(y))
        ctx.lineTo(width - padding, toCanvasY(y))
        ctx.stroke()
      }

      // 绘制坐标轴
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.6)'
      ctx.lineWidth = 2
      // x轴
      ctx.beginPath()
      ctx.moveTo(padding, originY)
      ctx.lineTo(width - padding, originY)
      ctx.stroke()
      // y轴
      ctx.beginPath()
      ctx.moveTo(originX, padding)
      ctx.lineTo(originX, height - padding)
      ctx.stroke()

      // 坐标轴箭头和标签
      ctx.fillStyle = '#C9A227'
      ctx.font = 'bold 12px "JetBrains Mono", monospace'
      // x轴箭头
      ctx.beginPath()
      ctx.moveTo(width - padding, originY)
      ctx.lineTo(width - padding - 10, originY - 5)
      ctx.lineTo(width - padding - 10, originY + 5)
      ctx.closePath()
      ctx.fill()
      ctx.fillText('x', width - padding + 5, originY + 15)
      // y轴箭头
      ctx.beginPath()
      ctx.moveTo(originX, padding)
      ctx.lineTo(originX - 5, padding + 10)
      ctx.lineTo(originX + 5, padding + 10)
      ctx.closePath()
      ctx.fill()
      ctx.fillText('y', originX + 10, padding + 5)

      // 刻度标签
      ctx.font = '11px "JetBrains Mono", monospace'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      for (let x = -5; x <= 5; x++) {
        if (x !== 0) {
          ctx.fillText(x.toString(), toCanvasX(x) - 3, originY + 15)
        }
      }
      for (let y = -5; y <= 5; y++) {
        if (y !== 0) {
          ctx.fillText(y.toString(), originX + 8, toCanvasY(y) + 4)
        }
      }
      // 原点
      ctx.fillText('0', originX - 8, originY + 15)

      // 绘制直线1
      const drawLine = (m, b, color, label) => {
        const x1 = -6
        const x2 = 6
        const y1 = m * x1 + b
        const y2 = m * x2 + b

        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(toCanvasX(x1), toCanvasY(y1))
        ctx.lineTo(toCanvasX(x2), toCanvasY(y2))
        ctx.stroke()

        // 标签
        ctx.fillStyle = color
        ctx.font = 'bold 13px "Noto Sans SC", sans-serif'
        ctx.fillText(label, toCanvasX(4), toCanvasY(m * 4 + b - 0.5))
      }

      drawLine(m1, b1, '#C9A227', `y = ${m1}x + ${b1}`)
      drawLine(m2, b2, '#E94560', `y = ${m2}x + ${b2}`)

      // 绘制交点
      if (solution) {
        const sx = parseFloat(solution.x)
        const sy = parseFloat(solution.y)

        // 交点发光效果
        ctx.beginPath()
        ctx.arc(toCanvasX(sx), toCanvasY(sy), 20, 0, Math.PI * 2)
        const glowGradient = ctx.createRadialGradient(
          toCanvasX(sx), toCanvasY(sy), 0,
          toCanvasX(sx), toCanvasY(sy), 20
        )
        glowGradient.addColorStop(0, 'rgba(46, 213, 115, 0.6)')
        glowGradient.addColorStop(1, 'rgba(46, 213, 115, 0)')
        ctx.fillStyle = glowGradient
        ctx.fill()

        // 交点
        ctx.beginPath()
        ctx.arc(toCanvasX(sx), toCanvasY(sy), 8, 0, Math.PI * 2)
        ctx.fillStyle = '#2ED573'
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.stroke()

        // 交点坐标标签
        ctx.fillStyle = '#2ED573'
        ctx.font = 'bold 14px "JetBrains Mono", monospace'
        ctx.fillText(`(${sx}, ${sy})`, toCanvasX(sx) + 15, toCanvasY(sy) - 15)
      }

      // 标题信息
      ctx.font = '14px "Noto Sans SC", sans-serif'
      ctx.fillStyle = '#F5F5F0'
      ctx.fillText(`解的类型: ${solutionType}`, 20, 30)
      if (solution) {
        ctx.fillText(`交点坐标: (${solution.x}, ${solution.y})`, 20, 55)
      }
    }

    draw()

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width
      canvas.height = height
      draw()
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [caseId, simParams])

  if (caseId !== 'equation') return null

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  )
}