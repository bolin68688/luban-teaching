import { useEffect, useRef } from 'react'

const WAVE_COLORS = {
  wave1: '#D4AF37',
  wave2: '#E6C200',
  constructive: '#FFD700',
  destructive: '#1a1a2e',
  background: '#0a0a14'
}

export default function WaveInterferenceVisualization({ params = {} }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  const waveParams = {
    wavelength: params['波长'] ?? 1.5,
    slitDistance: params['双缝间距'] ?? 4,
    screenDistance: params['屏幕距离'] ?? 10,
    showConstructive: params['显示加强区'] !== false,
    showDestructive: params['显示相消区'] !== false
  }

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
    const height = height
    const centerY = displayHeight / 2

    const leftX = width * 0.1
    const rightX = width * 0.85

    let animationId

    const animate = () => {
      // 清空画布
      ctx.fillStyle = WAVE_COLORS.background
      ctx.fillRect(0, 0, width, displayHeight)

      const slitDistance = waveParams.slitDistance * 12
      const slitY1 = centerY - slitDistance
      const slitY2 = centerY + slitDistance

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

      // 干涉区域
      const k = (2 * Math.PI) / (waveParams.wavelength * 25)
      const numLines = 150

      for (let i = 0; i < numLines; i++) {
        const y = (i / numLines) * displayHeight
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

      // 屏幕
      ctx.fillStyle = 'rgba(20, 20, 40, 0.9)'
      ctx.fillRect(rightX - 15, 0, 20, displayHeight)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.strokeRect(rightX - 15, 0, 20, displayHeight)

      // 屏幕干涉条纹
      const numFringes = 20
      for (let i = 0; i <= numFringes; i++) {
        const fringeY = (i / numFringes) * displayHeight
        const dist1 = Math.sqrt((rightX - leftX - 50) ** 2 + (fringeY - slitY1) ** 2)
        const dist2 = Math.sqrt((rightX - leftX - 50) ** 2 + (fringeY - slitY2) ** 2)
        const phaseDiff = k * (dist1 - dist2)
        const intensity = Math.cos(phaseDiff / 2) ** 2

        if (intensity > 0.7 && waveParams.showConstructive) {
          ctx.fillStyle = `rgba(212, 175, 55, ${intensity * 0.9})`
          ctx.fillRect(rightX, fringeY - 4, 35, 8)
        } else if (intensity < 0.3 && waveParams.showDestructive) {
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

      // 相位指示箭头
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
  }, [waveParams.wavelength, waveParams.slitDistance, waveParams.screenDistance, waveParams.showConstructive, waveParams.showDestructive])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: WAVE_COLORS.background,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
