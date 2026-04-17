import { useRef, useEffect, useState } from 'react'

export default function RefractionVisualization({ caseId, simParams, isFullscreen }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animationRef = useRef(null)

  // 介质折射率映射
  const mediaIndex = {
    '空气→水(n=1.33)': 1.33,
    '空气→玻璃(n=1.50)': 1.50,
    '空气→钻石(n=2.42)': 2.42
  }

  useEffect(() => {
    if (caseId !== 'refraction') return

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    let width = container.clientWidth
    let height = container.clientHeight
    canvas.width = width
    canvas.height = height

    // 获取当前参数
    const incidentAngle = parseFloat(simParams['入射角']) || 45
    const media = simParams['介质组合'] || '空气→水(n=1.33)'
    const n = mediaIndex[media] || 1.33

    // 斯涅尔定律计算折射角
    const incidentRad = (incidentAngle * Math.PI) / 180
    const sinRefracted = Math.sin(incidentRad) / n
    const refractionAngle = sinRefracted > 1 ? null : Math.asin(sinRefracted) * 180 / Math.PI
    const criticalAngle = Math.asin(1 / n) * 180 / Math.PI
    const isTotalReflection = sinRefracted > 1

    // 绘图函数
    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // 背景渐变 - 模拟介质
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      if (media.includes('水')) {
        gradient.addColorStop(0, '#0a1628')
        gradient.addColorStop(0.5, '#0d2847')
        gradient.addColorStop(0.5, 'rgba(30, 80, 120, 0.3)')
        gradient.addColorStop(1, 'rgba(30, 80, 120, 0.3)')
      } else if (media.includes('玻璃')) {
        gradient.addColorStop(0, '#0a1628')
        gradient.addColorStop(0.5, 'rgba(80, 120, 100, 0.2)')
        gradient.addColorStop(0.5, 'rgba(80, 120, 100, 0.3)')
        gradient.addColorStop(1, 'rgba(80, 120, 100, 0.3)')
      } else {
        gradient.addColorStop(0, '#0a1628')
        gradient.addColorStop(0.5, 'rgba(100, 80, 120, 0.2)')
        gradient.addColorStop(0.5, 'rgba(100, 80, 120, 0.3)')
        gradient.addColorStop(1, 'rgba(100, 80, 120, 0.3)')
      }
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // 界面线
      const horizonY = height / 2
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.5)'
      ctx.lineWidth = 2
      ctx.setLineDash([10, 5])
      ctx.beginPath()
      ctx.moveTo(0, horizonY)
      ctx.lineTo(width, horizonY)
      ctx.stroke()
      ctx.setLineDash([])

      // 标注
      ctx.font = '12px "Noto Sans SC", sans-serif'
      ctx.fillStyle = 'rgba(201, 162, 39, 0.8)'
      ctx.fillText('空气', 20, 30)
      ctx.fillText(media.includes('水') ? '水' : media.includes('玻璃') ? '玻璃' : '钻石', 20, horizonY + 30)

      // 入射点
      const cx = width / 2
      const cy = horizonY

      // 入射光 (从左上方射入)
      const incidentLength = Math.min(width, height) * 0.4
      const incidentEndX = cx - Math.cos(incidentRad) * incidentLength
      const incidentEndY = cy - Math.sin(incidentRad) * incidentLength

      // 绘制入射光
      const incidentGradient = ctx.createLinearGradient(incidentEndX, incidentEndY, cx, cy)
      incidentGradient.addColorStop(0, '#FFD700')
      incidentGradient.addColorStop(1, '#FFA500')
      ctx.strokeStyle = incidentGradient
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(incidentEndX, incidentEndY)
      ctx.lineTo(cx, cy)
      ctx.stroke()

      // 箭头
      const arrowSize = 12
      const angle = Math.atan2(cy - incidentEndY, cx - incidentEndX)
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(
        cx - arrowSize * Math.cos(angle - Math.PI / 6),
        cy - arrowSize * Math.sin(angle - Math.PI / 6)
      )
      ctx.lineTo(
        cx - arrowSize * Math.cos(angle + Math.PI / 6),
        cy - arrowSize * Math.sin(angle + Math.PI / 6)
      )
      ctx.closePath()
      ctx.fill()

      // 法线（虚线）
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(cx, cy - Math.min(width, height) * 0.45)
      ctx.lineTo(cx, cy + Math.min(width, height) * 0.45)
      ctx.stroke()
      ctx.setLineDash([])

      // 标注入射角
      ctx.font = '14px "JetBrains Mono", monospace'
      ctx.fillStyle = '#FFD700'
      ctx.fillText(`θ₁ = ${incidentAngle}°`, cx - 80, cy - 20)

      if (!isTotalReflection && refractionAngle !== null) {
        // 折射光
        const refractedRad = (refractionAngle * Math.PI) / 180
        const refractedLength = Math.min(width, height) * 0.4
        const refractedEndX = cx + Math.cos(refractedRad) * refractedLength
        const refractedEndY = cy + Math.sin(refractedRad) * refractedLength

        // 折射光颜色根据介质变化
        const refractedGradient = ctx.createLinearGradient(cx, cy, refractedEndX, refractedEndY)
        if (media.includes('水')) {
          refractedGradient.addColorStop(0, '#00BFFF')
          refractedGradient.addColorStop(1, '#1E90FF')
        } else if (media.includes('玻璃')) {
          refractedGradient.addColorStop(0, '#98FB98')
          refractedGradient.addColorStop(1, '#32CD32')
        } else {
          refractedGradient.addColorStop(0, '#E6E6FA')
          refractedGradient.addColorStop(1, '#9370DB')
        }
        ctx.strokeStyle = refractedGradient
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(refractedEndX, refractedEndY)
        ctx.stroke()

        // 折射角标注
        ctx.fillStyle = media.includes('水') ? '#00BFFF' : media.includes('玻璃') ? '#32CD32' : '#9370DB'
        ctx.fillText(`θ₂ = ${refractionAngle.toFixed(1)}°`, cx + 20, cy + 40)
      }

      // 全反射
      if (isTotalReflection) {
        const reflectedLength = Math.min(width, height) * 0.4
        const reflectedAngle = 180 - incidentAngle
        const reflectedRad = (reflectedAngle * Math.PI) / 180
        const reflectedEndX = cx + Math.cos(reflectedRad) * reflectedLength
        const reflectedEndY = cy - Math.sin(reflectedRad) * reflectedLength

        ctx.strokeStyle = '#E94560'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(reflectedEndX, reflectedEndY)
        ctx.stroke()

        ctx.fillStyle = '#E94560'
        ctx.font = 'bold 16px "Noto Sans SC", sans-serif'
        ctx.fillText('全反射!', cx + 30, cy - 30)
      }

      // 入射点高亮
      ctx.beginPath()
      ctx.arc(cx, cy, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#FFD700'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx, cy, 10, 0, Math.PI * 2)
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 2
      ctx.stroke()

      // 标题信息
      ctx.font = 'bold 16px "Noto Sans SC", sans-serif'
      ctx.fillStyle = '#F5F5F0'
      ctx.fillText(`n = ${n}`, width - 80, 30)
      ctx.fillText(`临界角 = ${criticalAngle.toFixed(1)}°`, width - 150, 55)
    }

    draw()

    // 响应式处理
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

  if (caseId !== 'refraction') return null

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