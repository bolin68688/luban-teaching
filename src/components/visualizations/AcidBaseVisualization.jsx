import { useEffect, useRef } from 'react'

const COLORS = {
  acid: '#E74C3C',
  base: '#3498DB',
  neutral: '#27AE60',
  phenolphthalein: '#FF69B4',
  methylOrange: '#FFA500',
  background: '#0a0a14'
}

export default function AcidBaseVisualization({ params = {}, actions = {} }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  // 所有状态用 ref 管理，动画循环实时读取，零重渲染
  const stateRef = useRef({
    currentVolume: 0,
    currentPH: 1,
    isTitrating: false,
    // 参数（从props同步）
    acidConc: 0.05,
    baseConc: 0.05,
    initVol: 25,
    indicator: '酚酞(8.2-10.0)'
  })

  // 滴定时钟引用，用于取消
  const titrateTimerRef = useRef(null)

  // ===== 同步外部参数到 ref =====
  useEffect(() => {
    const s = stateRef.current
    s.acidConc = params['酸浓度'] ?? 0.05
    s.baseConc = params['碱浓度'] ?? 0.05
    s.initVol = params['初始体积'] ?? 25
    s.indicator = params['指示剂'] ?? '酚酞(8.2-10.0)'

    // 浓度变化时重新计算当前pH
    s.currentPH = calcPH(s.currentVolume, s.acidConc, s.baseConc, s.initVol)
  }, [params])

  // ===== 操作处理（通过 actions 回调）=====
  // 用 ref 存储操作函数，让外部能调用
  useEffect(() => {
    const startTitration = () => {
      if (stateRef.current.isTitrating) return // 防止重复启动
      stateRef.current.isTitrating = true

      if (titrateTimerRef.current) clearInterval(titrateTimerRef.current)

      titrateTimerRef.current = setInterval(() => {
        const s = stateRef.current
        if (s.currentVolume >= 50) {
          s.isTitrating = false
          clearInterval(titrateTimerRef.current)
          titrateTimerRef.current = null
          return
        }
        s.currentVolume += 0.3
        s.currentPH = calcPH(s.currentVolume, s.acidConc, s.baseConc, s.initVol)
      }, 30)
    }

    const resetTitration = () => {
      stateRef.current.isTitrating = false
      stateRef.currentVolume = 0
      stateRef.currentPH = calcPH(0, stateRef.current.acidConc, stateRef.current.baseConc, stateRef.current.initVol)
      if (titrateTimerRef.current) {
        clearInterval(titrateTimerRef.current)
        titrateTimerRef.current = null
      }
    }

    // 按钮名必须与 cases.js 中 options 完全一致
    actions['开始滴定'] = startTitration
    actions['重置'] = resetTitration

    return () => {
      if (titrateTimerRef.current) {
        clearInterval(titrateTimerRef.current)
        titrateTimerRef.current = null
      }
    }
  }, [actions])

  // ===== pH 计算函数 =====
  function calcPH(volume, acidC, baseC, initV) {
    const totalOH = volume * baseC
    const totalH = initV * acidC
    const netOH = totalOH - totalH

    if (Math.abs(netOH) < 0.0001) return 7
    const totalV = initV + volume
    if (netOH < 0) {
      return -Math.log10(-netOH / totalV)
    } else {
      return 14 + Math.log10(netOH / totalV)
    }
  }

  // ===== Canvas 绘制 =====
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      ctx.fillStyle = COLORS.background
      ctx.fillRect(0, 0, width, height)

      const cx = width / 2
      const beakerX = cx - 100
      const beakerY = height / 2 + 50
      const beakerW = 160
      const beakerH = 180

      const s = stateRef.current

      // ---- 烧杯轮廓 ----
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(beakerX, beakerY - beakerH)
      ctx.lineTo(beakerX, beakerY)
      ctx.lineTo(beakerX + beakerW, beakerY)
      ctx.lineTo(beakerX + beakerW, beakerY - beakerH)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(beakerX + beakerW / 2, beakerY, beakerW / 2, 0, Math.PI)
      ctx.stroke()

      // ---- 液体 ----
      const liquidH = Math.min((s.currentVolume / 60) * (beakerH - 10), beakerH - 10)
      const liquidY = beakerY - liquidH
      const ph = s.currentPH

      let liquidColor
      if (ph < 3) {
        liquidColor = COLORS.acid
      } else if (ph > 10) {
        liquidColor = s.indicator.includes('酚酞') ? COLORS.phenolphthalein : COLORS.methylOrange
      } else if (ph >= 6 && ph <= 8) {
        liquidColor = COLORS.neutral
      } else {
        const t = Math.min(1, Math.max(0, (ph - 3) / 7))
        liquidColor = lerpColor(COLORS.acid, COLORS.neutral, t)
      }

      const lg = ctx.createLinearGradient(beakerX, liquidY, beakerX, beakerY)
      lg.addColorStop(0, liquidColor)
      lg.addColorStop(1, liquidColor + '88')
      ctx.fillStyle = lg
      ctx.beginPath()
      ctx.moveTo(beakerX + 2, liquidY)
      ctx.lineTo(beakerX + beakerW - 2, liquidY)
      ctx.lineTo(beakerX + beakerW - 2, beakerY)
      ctx.arc(beakerX + beakerW / 2, beakerY, (beakerW - 4) / 2, 0, Math.PI, true)
      ctx.closePath()
      ctx.fill()

      // ---- 气泡 ----
      for (let i = 0; i < 5; i++) {
        const bx = beakerX + 20 + i * 25
        const by = liquidY + 20 + Math.sin(Date.now() / 400 + i * 1.5) * 8
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.beginPath()
        ctx.arc(bx, by, 2 + (i % 3), 0, Math.PI * 2)
        ctx.fill()
      }

      // ---- 滴定管 ----
      const buretteX = cx + 80
      const buretteTop = beakerY - beakerH - 60
      const bw = 25
      const bh = beakerY - buretteTop

      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 2
      ctx.strokeRect(buretteX - bw / 2, buretteTop, bw, bh)

      // 滴定管液面
      const fillR = Math.max(0, 1 - s.currentVolume / 100)
      const liqInB = bh * fillR
      const bg = ctx.createLinearGradient(buretteX - bw / 2, buretteTop + bh - liqInB, buretteX - bw / 2, beakerY)
      bg.addColorStop(0, COLORS.base)
      bg.addColorStop(1, COLORS.base + '88')
      ctx.fillStyle = bg
      ctx.fillRect(buretteX - bw / 2 + 2, buretteTop + bh - liqInB, bw - 4, liqInB)

      // 滴管尖
      ctx.fillStyle = COLORS.base
      ctx.beginPath()
      ctx.moveTo(buretteX - 4, beakerY - 10)
      ctx.lineTo(buretteX + 4, beakerY - 10)
      ctx.lineTo(buretteX, beakerY)
      ctx.closePath()
      ctx.fill()

      // ---- 液滴动画 ----
      if (s.isTitrating && s.currentVolume < 50) {
        const dp = (Date.now() % 800) / 800
        const dy = beakerY - 10 - dp * 35
        ctx.fillStyle = COLORS.base
        ctx.beginPath()
        ctx.arc(buretteX, dy, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      // ---- 滴定管刻度 ----
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.font = '9px monospace'
      for (let i = 0; i <= 10; i++) {
        const y = beakerY - 10 - (i * (bh - 20) / 10)
        ctx.fillText(String(10 - i), buretteX + bw / 2 + 5, y + 3)
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.beginPath()
        ctx.moveTo(buretteX + bw / 2 - 3, y)
        ctx.lineTo(buretteX + bw / 2 + 3, y)
        ctx.stroke()
      }

      // ---- pH 试纸条 ----
      const psX = beakerX - 50
      const psY = beakerY - beakerH - 30
      const pg = ctx.createLinearGradient(psX, 0, psX, 100)
      pg.addColorStop(0, '#E74C3C')
      pg.addColorStop(0.28, '#F39C12')
      pg.addColorStop(0.5, '#27AE60')
      pg.addColorStop(0.72, '#3498DB')
      pg.addColorStop(1, '#9B59B6')
      ctx.fillStyle = pg
      ctx.fillRect(psX, psY, 12, 100)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.strokeRect(psX, psY, 12, 100)

      // pH 标记箭头
      const phVal = Math.max(0, Math.min(14, ph))
      const pmY = psY + 100 - (phVal / 14) * 100
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.moveTo(psX - 5, pmY)
      ctx.lineTo(psX - 12, pmY - 5)
      ctx.lineTo(psX - 12, pmY + 5)
      ctx.closePath()
      ctx.fill()

      // ---- 文字标注 ----
      ctx.fillStyle = COLORS.acid
      ctx.font = 'bold 14px serif'
      ctx.fillText('HCl', beakerX + beakerW / 2 - 15, beakerY - beakerH - 15)
      ctx.fillStyle = COLORS.base
      ctx.fillText('NaOH', buretteX - 15, buretteTop - 10)

      ctx.fillStyle = '#fff'
      ctx.font = '13px monospace'
      ctx.fillText(`pH: ${ph.toFixed(1)}`, beakerX - 65, psY - 10)
      ctx.fillText(`V: ${s.currentVolume.toFixed(1)} mL`, beakerX - 65, psY + 118)

      // pH 刻度数字
      ctx.font = '9px monospace'
      ctx.fillStyle = '#888'
      for (let i = 0; i <= 14; i += 2) {
        const y = psY + 100 - (i / 14) * 100
        ctx.fillText(String(i), psX + 18, y + 3)
      }

      // 等当点提示
      if (Math.abs(ph - 7) < 0.5 && s.currentVolume > 0.1) {
        ctx.fillStyle = 'rgba(39, 174, 96, 0.8)'
        ctx.font = 'bold 11px serif'
        ctx.fillText('⚡ 等当点!', beakerX + beakerW / 2 - 30, beakerY + 20)
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (titrateTimerRef.current) {
        clearInterval(titrateTimerRef.current)
        titrateTimerRef.current = null
      }
    }
  }, []) // 只挂载一次，所有参数通过ref读取

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: COLORS.background,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : { r: 0, g: 0, b: 0 }
}

function lerpColor(c1, c2, t) {
  const a = hexToRgb(c1)
  const b = hexToRgb(c2)
  return `rgb(${Math.round(a.r + (b.r - a.r) * t)},${Math.round(a.g + (b.g - a.g) * t)},${Math.round(a.b + (b.b - a.b) * t)})`
}
