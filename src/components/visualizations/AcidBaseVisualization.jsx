import { useEffect, useRef, useState } from 'react'

const ACID_COLORS = {
  acid: '#E74C3C',
  base: '#3498DB',
  neutral: '#27AE60',
  phenolphthalein: '#FF69B4',
  methylOrange: '#FFA500',
  background: '#0a0a14'
}

export default function AcidBaseVisualization({ params = {}, actions = {} }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [internalState, setInternalState] = useState({
    currentVolume: 0,
    currentPH: 1,
    isTitrating: false
  })

  // 从props获取参数，内部状态管理滴定过程
  const acidParams = {
    acidConcentration: params['酸浓度'] ?? 0.05,
    baseConcentration: params['碱浓度'] ?? 0.05,
    initialVolume: params['初始体积'] ?? 25,
    indicator: params['指示剂'] ?? '酚酞(8.2-10.0)',
    ...internalState
  }

  const calculatePH = (volume) => {
    const totalOH = volume * acidParams.baseConcentration
    const totalH = acidParams.initialVolume * acidParams.acidConcentration
    const netOH = totalOH - totalH

    if (Math.abs(netOH) < 0.0001) return 7
    const totalVolume = acidParams.initialVolume + volume
    if (netOH < 0) {
      const excessH = -netOH / totalVolume
      return -Math.log10(excessH)
    } else {
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

    let animationId

    const animate = () => {
      ctx.fillStyle = ACID_COLORS.background
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const beakerX = centerX - 100
      const beakerY = height / 2 + 50
      const beakerWidth = 160
      const beakerHeight = 180

      // 烧杯
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(beakerX, beakerY - beakerHeight)
      ctx.lineTo(beakerX, beakerY)
      ctx.lineTo(beakerX + beakerWidth, beakerY)
      ctx.lineTo(beakerX + beakerWidth, beakerY - beakerHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(beakerX + beakerWidth / 2, beakerY, beakerWidth / 2, 0, Math.PI)
      ctx.stroke()

      // 液体
      const liquidHeight = Math.min((acidParams.currentVolume / 60) * (beakerHeight - 10), beakerHeight - 10)
      const liquidY = beakerY - liquidHeight

      const ph = acidParams.currentPH
      let liquidColor
      if (ph < 3) {
        liquidColor = ACID_COLORS.acid
      } else if (ph > 10) {
        liquidColor = acidParams.indicator.includes('酚酞') ? ACID_COLORS.phenolphthalein : ACID_COLORS.methylOrange
      } else if (ph >= 6 && ph <= 8) {
        liquidColor = ACID_COLORS.neutral
      } else {
        const t = Math.min(1, Math.max(0, (ph - 3) / 10))
        liquidColor = interpolateColor(ACID_COLORS.acid, ACID_COLORS.neutral, t)
      }

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

      // 气泡
      for (let i = 0; i < 5; i++) {
        const bubbleX = beakerX + 20 + (i * 25)
        const bubbleY = liquidY + 20 + Math.sin(Date.now() / 500 + i) * 10
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.beginPath()
        ctx.arc(bubbleX, bubbleY, 3 + (i % 3), 0, Math.PI * 2)
        ctx.fill()
      }

      // 滴定管
      const buretteX = centerX + 80
      const buretteTop = beakerY - beakerHeight - 60
      const buretteWidth = 25
      const buretteHeight = beakerY - buretteTop

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 2
      ctx.strokeRect(buretteX - buretteWidth / 2, buretteTop, buretteWidth, buretteHeight)

      // 滴定管液面
      const filledRatio = Math.max(0, 1 - acidParams.currentVolume / 100)
      const liquidInBurette = buretteHeight * filledRatio
      const baseGradient = ctx.createLinearGradient(buretteX - buretteWidth / 2, buretteTop + (buretteHeight - liquidInBurette), buretteX - buretteWidth / 2, beakerY)
      baseGradient.addColorStop(0, ACID_COLORS.base)
      baseGradient.addColorStop(1, `${ACID_COLORS.base}88`)
      ctx.fillStyle = baseGradient
      ctx.fillRect(buretteX - buretteWidth / 2 + 2, buretteTop + (buretteHeight - liquidInBurette), buretteWidth - 4, liquidInBurette)

      // 滴管尖
      ctx.fillStyle = ACID_COLORS.base
      ctx.beginPath()
      ctx.moveTo(buretteX - 4, beakerY - 10)
      ctx.lineTo(buretteX + 4, beakerY - 10)
      ctx.lineTo(buretteX, beakerY)
      ctx.closePath()
      ctx.fill()

      // 液滴动画
      if (acidParams.isTitrating && acidParams.currentVolume < 50) {
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
      ctx.fillText(`V: ${acidParams.currentVolume.toFixed(1)}mL`, beakerX - 60, phStripY + 115)

      // pH标尺
      ctx.font = '9px monospace'
      ctx.fillStyle = '#888'
      for (let i = 0; i <= 14; i += 2) {
        const y = phStripY + 100 - (i / 14) * 100
        ctx.fillText(`${i}`, phStripX + 18, y + 3)
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      cancelAnimationFrame(animationId)
    }
  }, [acidParams.acidConcentration, acidParams.baseConcentration, acidParams.initialVolume, acidParams.indicator, acidParams.currentVolume, acidParams.currentPH, acidParams.isTitrating])

  // 暴露滴定操作给外部
  useEffect(() => {
    if (!actions) return
    actions.startTitrating = () => {
      setInternalState(prev => ({ ...prev, isTitrating: true }))
      const interval = setInterval(() => {
        setInternalState(prev => {
          if (prev.currentVolume >= 50) {
            clearInterval(interval)
            return { ...prev, isTitrating: false }
          }
          const newVol = prev.currentVolume + 0.3
          return { ...prev, currentVolume: newVol, currentPH: calculatePH(newVol) }
        })
      }, 30)
    }
    actions.reset = () => {
      setInternalState(prev => ({ ...prev, currentVolume: 0, currentPH: 1, isTitrating: false }))
    }
  }, [])

  // 持续更新pH值（当浓度变化时）
  useEffect(() => {
    setInternalState(prev => ({
      ...prev,
      currentPH: calculatePH(prev.currentVolume)
    }))
  }, [acidParams.acidConcentration, acidParams.baseConcentration, acidParams.initialVolume])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: ACID_COLORS.background,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
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
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 }
}
