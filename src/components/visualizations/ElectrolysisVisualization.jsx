import { useEffect, useRef } from 'react'

const COLORS = {
  water: 'rgba(64, 164, 223, 0.25)',
  waterDeep: 'rgba(30, 100, 180, 0.4)',
  electrodePos: '#E74C3C',   // 阳极（正极）- 氧气 - 红色
  electrodeNeg: '#3498DB',   // 阴极（负极）- 氢气 - 蓝色
  h2Bubble: '#7FDBFF',       // 氢气泡
  o2Bubble: '#FF6B6B',       // 氧气泡
  tubeH2: 'rgba(127, 219, 255, 0.15)',
  tubeO2: 'rgba(255, 107, 107, 0.15)',
  gasH2: '#4FC3F7',
  gasO2: '#EF5350',
  electron: '#FFD700',
  bg: '#080818',
  text: '#D4AF37'
}

export default function ElectrolysisVisualization({ params = {}, actions = {} }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  // 全部状态用 ref 管理，零重渲染
  const stateRef = useRef({
    running: false,
    time: 0,
    h2Volume: 0,     // 收集到的氢气体积
    o2Volume: 0,     // 收集到的氧气体积
    // 参数
    voltage: 6,
    concentration: 15,
    electrolyte: 'Na₂SO₄(中性)',
    showMolecules: true,
    showElectrons: false
  })

  const bubblesRef = useRef([])  // 活跃气泡数组

  let timerRef = null

  // ===== 同步参数 =====
  useEffect(() => {
    const s = stateRef.current
    s.voltage = params['电压'] ?? 6
    s.concentration = params['电解质浓度'] ?? 15
    s.electrolyte = params['电解质类型'] ?? 'Na₂SO₄(中性)'
    s.showMolecules = params['显示分子式'] !== false
    s.showElectrons = params['显示电子流向'] === true || params['显示电子流向'] === true
  }, [params])

  // ===== 操作按钮 =====
  useEffect(() => {
    actions['通电开始'] = () => {
      stateRef.current.running = true
    }
    actions['暂停'] = () => {
      stateRef.current.running = false
      if (timerRef) { clearInterval(timerRef); timerRef = null }
    }
    actions['重置'] = () => {
      stateRef.current.running = false
      stateRef.current.time = 0
      stateRef.current.h2Volume = 0
      stateRef.current.o2Volume = 0
      bubblesRef.current = []
      if (timerRef) { clearInterval(timerRef); timerRef = null }
    }

    return () => {
      if (timerRef) clearInterval(timerRef)
    }
  }, [actions])

  // ===== 主绘制循环 =====
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

    // 更新逻辑定时器（每50ms更新一次状态）
    timerRef = setInterval(() => {
      const s = stateRef.current
      if (!s.running) return
      s.time += 0.05

      // 产气速率与电压和浓度相关
      const rate = Math.max(0, (s.voltage - 1.23)) * (s.concentration / 15) * 0.08
      if (rate > 0) {
        s.h2Volume += rate * 2   // H₂ 是 O₂ 的两倍
        s.o2Volume += rate * 1

        // 产生新气泡
        if (Math.random() < rate * 1.5) {
          bubblesRef.current.push({
            x: 0, y: 0, r: 0, vx: 0, vy: 0,
            side: 'neg', age: 0, type: 'h2'
          })
        }
        if (Math.random() < rate * 0.75) {
          bubblesRef.current.push({
            x: 0, y: 0, r: 0, vx: 0, vy: 0,
            side: 'pos', age: 0, type: 'o2'
          })
        }

        // 限制气泡数量
        if (bubblesRef.current.length > 120) {
          bubblesRef.current = bubblesRef.current.slice(-80)
        }
      }
    }, 50)

    const draw = () => {
      const W = canvas.clientWidth
      const H = canvas.clientHeight
      const cx = W / 2
      const s = stateRef.current

      // 清屏
      ctx.fillStyle = COLORS.bg
      ctx.fillRect(0, 0, W, H)

      // ========== 布局参数 ==========
      const tankW = Math.min(W * 0.5, 300)
      const tankH = H * 0.42
      const tankX = cx - tankW / 2
      const tankY = H * 0.35
      const waterLevel = tankY + 10 // 液面位置

      // 电极
      const electrodeGap = tankW * 0.55
      const posElectrodeX = cx - electrodeGap / 2  // 阳极(+)
      const negElectrodeX = cx + electrodeGap / 2  // 阴极(-)

      // 气体收集管
      const tubeW = tankW * 0.18
      const tubeH = H * 0.28
      const posTubeX = posElectrodeX - tubeW / 2 - tubeW * 0.3
      const negTubeX = negElectrodeX - tubeW / 2 + tubeW * 0.3
      const tubeBottomY = waterLevel - 5

      // ========== 1. 绘制电源/电路 ==========
      drawPowerSupply(ctx, cx, 45, s.voltage, s.running)

      // ========== 2. 导线 ==========
      ctx.strokeStyle = s.running ? COLORS.electron : '#444'
      ctx.lineWidth = 2
      ctx.setLineDash(s.showElectrons ? [] : [6, 4])
      // 正极导线
      ctx.beginPath()
      ctx.moveTo(cx, 70)
      ctx.lineTo(cx, 90)
      ctx.lineTo(posElectrodeX, 90)
      ctx.lineTo(posElectrodeX, tankY + 20)
      ctx.stroke()
      // 负极导线
      ctx.beginPath()
      ctx.moveTo(cx, 70)
      ctx.lineTo(negElectrodeX, 90)
      ctx.lineTo(negElectrodeX, tankY + 20)
      ctx.stroke()
      ctx.setLineDash([])

      // 电子流动动画
      if (s.showElectrons && s.running) {
        const t = Date.now() / 200
        for (let i = 0; i < 5; i++) {
          const et = ((t + i * 0.3) % 3) / 3
          // 负极方向（电子从负极流出）
          const ex = negElectrodeX + (cx - negElectrodeX) * et
          const ey = 90 - 20 * Math.sin(et * Math.PI)
          ctx.fillStyle = COLORS.electron
          ctx.beginPath()
          ctx.arc(ex, ey, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.font = '9px sans-serif'
          ctx.fillText('e⁻', ex - 5, ey - 6)
        }
      }

      // ========== 3. 气体收集管 ==========
      // 正极收集管（氧气）
      drawTube(ctx, posTubeX, tubeBottomY - tubeH, tubeW, tubeH, s.o2Volume, 40, COLORS.gasO2, COLORS.tubeO2, 'O₂')
      // 负极收集管（氢气）
      drawTube(ctx, negTubeX, tubeBottomY - tubeH, tubeW, tubeH, s.h2Volume, 80, COLORS.gasH2, COLORS.tubeH2, 'H₂')

      // 连接管（倒扣在电极上方的管子）
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 2
      // 左管连接到阳极
      ctx.beginPath()
      ctx.moveTo(posTubeX + tubeW * 0.3, tubeBottomY)
      ctx.quadraticCurveTo(posTubeX + tubeW * 0.3, waterLevel - 20, posElectrodeX, waterLevel - 25)
      ctx.stroke()
      // 右管连接到阴极
      ctx.beginPath()
      ctx.moveTo(negTubeX + tubeW * 0.7, tubeBottomY)
      ctx.quadraticCurveTo(negTubeX + tubeW * 0.7, waterLevel - 20, negElectrodeX, waterLevel - 25)
      ctx.stroke()

      // ========== 4. 水槽 ==========
      // 水槽轮廓
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(tankX, tankY)
      ctx.lineTo(tankX, tankY + tankH)
      ctx.lineTo(tankX + tankW, tankY + tankH)
      ctx.lineTo(tankX + tankW, tankY)
      ctx.stroke()
      // 底部圆角
      ctx.beginPath()
      ctx.arc(tankX + tankW / 2, tankY + tankH, tankW / 2, 0, Math.PI, false)
      ctx.stroke()

      // 水（填充）
      const wg = ctx.createLinearGradient(tankX, waterLevel, tankX, tankY + tankH)
      wg.addColorStop(0, COLORS.water)
      wg.addColorStop(1, COLORS.waterDeep)
      ctx.fillStyle = wg
      ctx.beginPath()
      ctx.moveTo(tankX + 2, waterLevel)
      ctx.lineTo(tankX + 2, tankY + tankH - 2)
      ctx.arc(tankX + tankW / 2, tankY + tankH, tankW / 2 - 2, Math.PI, 0, true)
      ctx.lineTo(tankX + tankW - 2, waterLevel)
      ctx.closePath()
      ctx.fill()

      // 水面波纹
      if (s.running) {
        ctx.strokeStyle = 'rgba(150, 210, 255, 0.2)'
        ctx.lineWidth = 1
        const waveT = Date.now() / 500
        ctx.beginPath()
        for (let x = tankX + 5; x < tankX + tankW - 5; x++) {
          const wy = waterLevel + Math.sin((x - tankX) * 0.06 + waveT) * 1.5
          if (x === tankX + 5) ctx.moveTo(x, wy)
          else ctx.lineTo(x, wy)
        }
        ctx.stroke()
      }

      // ========== 5. 电极 ==========
      const elecTop = tankY + 25
      const elecBottom = tankY + tankH - 15
      const elecW = 6

      // 阳极 (+)
      const posGrad = ctx.createLinearGradient(posElectrodeX - elecW / 2, 0, posElectrodeX + elecW / 2, 0)
      posGrad.addColorStop(0, '#c0392b')
      posGrad.addColorStop(0.5, COLORS.electrodePos)
      posGrad.addColorStop(1, '#c0392b')
      ctx.fillStyle = posGrad
      roundRect(ctx, posElectrodeX - elecW / 2, elecTop, elecW, elecBottom - elecTop, 3)
      ctx.fill()

      // 阴极 (-)
      const negGrad = ctx.createLinearGradient(negElectrodeX - elecW / 2, 0, negElectrodeX + elecW / 2, 0)
      negGrad.addColorStop(0, '#2980b9')
      negGrad.addColorStop(0.5, COLORS.electrodeNeg)
      negGrad.addColorStop(1, '#2980b9')
      ctx.fillStyle = negGrad
      roundRect(ctx, negElectrodeX - elecW / 2, elecTop, elecW, elecBottom - elecTop, 3)
      ctx.fill()

      // 电极标签
      ctx.fillStyle = COLORS.electrodePos
      ctx.font = 'bold 13px serif'
      ctx.fillText('(+)', posElectrodeX - 8, elecTop - 8)
      ctx.fillStyle = COLORS.electrodeNeg
      ctx.fillText('(−)', negElectrodeX - 8, elecTop - 8)

      // ========== 6. 气泡系统 ==========
      updateAndDrawBubbles(ctx, s, posElectrodeX, negElectrodeX, elecBottom, waterLevel)

      // ========== 7. 分子式标注 ==========
      if (s.showMolecules) {
        ctx.font = 'bold 12px monospace'
        // 阳极反应
        ctx.fillStyle = COLORS.electrodePos
        ctx.fillText('4OH⁻ − 4e⁻ → 2H₂O + O₂↑', posElectrodeX - 60, elecBottom + 18)
        // 阴极反应
        ctx.fillStyle = COLORS.electrodeNeg
        ctx.fillText('2H⁺ + 2e⁻ → H₂↑', negElectrodeX - 38, elecBottom + 18)
        // 总反应
        ctx.fillStyle = COLORS.text
        ctx.font = 'bold 14px serif'
        ctx.textAlign = 'center'
        ctx.fillText('2H₂O  →  2H₂↑  +  O₂↑', cx, H - 35)
        ctx.textAlign = 'left'
      }

      // ========== 8. 数据面板 ==========
      drawDataPanel(ctx, W, H, s)

      // ========== 9. 电解质信息 ==========
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.font = '11px monospace'
      const elecLabel = `电解液: ${s.electrolyte.split('(')[0]} (${s.concentration}%)`
      ctx.fillText(elecLabel, tankX, tankY + tankH + 22)

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (timerRef) clearInterval(timerRef)
    }
  }, [])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: COLORS.bg,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}

// ===== 辅助绘制函数 =====

function drawPowerSupply(ctx, x, y, voltage, isOn) {
  const w = 70, h = 36
  ctx.fillStyle = isOn ? 'rgba(212,175,55,0.15)' : 'rgba(80,80,80,0.3)'
  ctx.strokeStyle = isOn ? COLORS.text : '#555'
  ctx.lineWidth = 1.5
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 6)
  ctx.fill()
  ctx.stroke()

  // 直流电源符号
  ctx.strokeStyle = isOn ? '#fff' : '#666'
  ctx.lineWidth = 2
  // 长线 = 正极
  ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.lineTo(x - 4, y); ctx.stroke()
  // 短线 = 负极
  ctx.beginPath(); ctx.moveTo(x + 4, y); ctx.lineTo(x + 12, y); ctx.stroke()
  // 标注
  ctx.fillStyle = isOn ? COLORS.electrodePos : '#666'
  ctx.font = 'bold 11px serif'; ctx.fillText('+', x - 16, y - 8)
  ctx.fillStyle = isOn ? COLORS.electrodeNeg : '#666'
  ctx.fillText('−', x + 10, y - 8)

  // 电压值
  ctx.fillStyle = isOn ? COLORS.text : '#555'
  ctx.font = 'bold 12px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`${voltage.toFixed(1)}V`, x, y + 14)
  ctx.textAlign = 'left'
}

function drawTube(ctx, x, y, w, h, volume, maxVol, gasColor, bgColor, label) {
  // 管壁
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 2
  roundRect(ctx, x, y, w, h, 4)
  ctx.stroke()

  // 内部背景
  ctx.fillStyle = bgColor
  roundRect(ctx, x + 2, y + 2, w - 4, h - 4, 3)
  ctx.fill()

  // 气体填充（从底部往上）
  const fillRatio = Math.min(volume / maxVol, 1)
  const gasH = (h - 4) * fillRatio
  if (gasH > 1) {
    const gg = ctx.createLinearGradient(x, y + h - 4 - gasH, x, y + h - 4)
    gg.addColorStop(0, gasColor + '44')
    gg.addColorStop(1, gasColor + 'aa')
    ctx.fillStyle = gg
    roundRect(ctx, x + 3, y + h - 4 - gasH, w - 6, gasH, 2)
    ctx.fill()
  }

  // 刻度
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.font = '8px monospace'
  for (let i = 0; i <= 4; i++) {
    const ky = y + h - 4 - ((h - 4) * i / 4)
    ctx.fillRect(x + w - 5, ky, 3, 1)
    if (i > 0) ctx.fillText(`${maxVol * i / 4}`, x + w + 4, ky + 3)
  }

  // 标签
  ctx.fillStyle = gasColor
  ctx.font = 'bold 12px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(label, x + w / 2, y - 8)
  ctx.textAlign = 'left'

  // 体积数字
  if (volume > 0.5) {
    ctx.font = 'bold 11px monospace'
    ctx.fillStyle = '#fff'
    ctx.fillText(`${volume.toFixed(1)}mL`, x + w / 2 - 18, y + h - 8)
  }
}

function updateAndDrawBubbles(ctx, s, posX, negX, bottomY, surfaceY) {
  const bubbles = bubblesRef.current
  const now = Date.now()

  // 更新每个气泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i]
    b.age++

    // 初始化位置
    if (b.y === 0) {
      b.x = b.side === 'pos' ? posX : negX
      b.y = bottomY - Math.random() * (bottomY - surfaceY) * 0.6
      b.r = (b.type === 'h2' ? 2.5 : 2) + Math.random() * 2
      b.vx = (Math.random() - 0.5) * 0.6
      b.vy = -(0.6 + Math.random() * 0.8) * (s.voltage / 6)
    }

    // 运动
    b.x += b.vx
    b.y += b.vy
    b.vy *= 0.995 // 稍微减速
    b.vx += (Math.random() - 0.5) * 0.15 // 左右漂移

    // 移除超出范围的
    if (b.y < surfaceY - 15) {
      bubbles.splice(i, 1)
      continue
    }

    // 绘制气泡
    const alpha = Math.max(0.2, 1 - b.age / 120)
    const color = b.type === 'h2' ? COLORS.h2Bubble : COLORS.o2Bubble
    const grad = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 0, b.x, b.y, b.r)
    grad.addColorStop(0, `rgba(255,255,255,${alpha})`)
    grad.addColorStop(0.4, color.replace(')', `,${alpha})`).replace('rgb', 'rgba'))
    grad.addColorStop(1, `${color}00`)

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawDataPanel(ctx, W, H, s) {
  const px = W - 130, py = H * 0.12

  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  roundRect(ctx, px - 10, py - 10, 125, 95, 8)
  ctx.fill()
  ctx.strokeStyle = 'rgba(212,175,55,0.3)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = COLORS.text
  ctx.font = 'bold 12px serif'
  ctx.fillText('⚡ 实验数据', px, py + 6)

  ctx.font = '11px monospace'
  ctx.fillStyle = COLORS.gasH2
  ctx.fillText(`H₂: ${s.h2Volume.toFixed(1)} mL`, px, py + 26)
  ctx.fillStyle = COLORS.gasO2
  ctx.fillText(`O₂: ${s.o2Volume.toFixed(1)} mL`, px, py + 44)
  ctx.fillStyle = '#ccc'
  const ratio = s.o2Volume > 0.5 ? (s.h2Volume / s.o2Volume).toFixed(2) : '--'
  ctx.fillText(`体积比(H₂/O₂): ${ratio}`, px, py + 62)

  // 电流指示
  const current = s.running ? Math.max(0, (s.voltage - 1.23)) * (s.concentration / 15) * 0.5 : 0
  ctx.fillStyle = s.running ? '#4CAF50' : '#666'
  ctx.fillText(`${s.running ? '▶' : '⏸'} I=${current.toFixed(2)}A`, px, py + 80)
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}
