import { useRef, useEffect, useState } from 'react'

export default function PeriodicVisualization({ caseId, simParams, isFullscreen }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [selectedElement, setSelectedElement] = useState(null)

  useEffect(() => {
    if (caseId !== 'periodic') return

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    let width = container.clientWidth
    let height = container.clientHeight
    canvas.width = width
    canvas.height = height

    const elements = [
      { symbol: 'H', name: '氢', num: 1, mass: 1.008, category: 'nonmetal', electron: [1] },
      { symbol: 'He', name: '氦', num: 2, mass: 4.003, category: 'noble', electron: [2] },
      { symbol: 'Li', name: '锂', num: 3, mass: 6.941, category: 'alkali', electron: [2, 1] },
      { symbol: 'Be', name: '铍', num: 4, mass: 9.012, category: 'alkaline', electron: [2, 2] },
      { symbol: 'B', name: '硼', num: 5, mass: 10.81, category: 'metalloid', electron: [2, 3] },
      { symbol: 'C', name: '碳', num: 6, mass: 12.01, category: 'nonmetal', electron: [2, 4] },
      { symbol: 'N', name: '氮', num: 7, mass: 14.01, category: 'nonmetal', electron: [2, 5] },
      { symbol: 'O', name: '氧', num: 8, mass: 16.00, category: 'nonmetal', electron: [2, 6] },
      { symbol: 'F', name: '氟', num: 9, mass: 19.00, category: 'halogen', electron: [2, 7] },
      { symbol: 'Ne', name: '氖', num: 10, mass: 20.18, category: 'noble', electron: [2, 8] },
      { symbol: 'Na', name: '钠', num: 11, mass: 22.99, category: 'alkali', electron: [2, 8, 1] },
      { symbol: 'Mg', name: '镁', num: 12, mass: 24.31, category: 'alkaline', electron: [2, 8, 2] },
      { symbol: 'Al', name: '铝', num: 13, mass: 26.98, category: 'metal', electron: [2, 8, 3] },
      { symbol: 'Si', name: '硅', num: 14, mass: 28.09, category: 'metalloid', electron: [2, 8, 4] },
      { symbol: 'P', name: '磷', num: 15, mass: 30.97, category: 'nonmetal', electron: [2, 8, 5] },
      { symbol: 'S', name: '硫', num: 16, mass: 32.07, category: 'nonmetal', electron: [2, 8, 6] },
      { symbol: 'Cl', name: '氯', num: 17, mass: 35.45, category: 'halogen', electron: [2, 8, 7] },
      { symbol: 'Ar', name: '氩', num: 18, mass: 39.95, category: 'noble', electron: [2, 8, 8] },
      { symbol: 'K', name: '钾', num: 19, mass: 39.10, category: 'alkali', electron: [2, 8, 8, 1] },
      { symbol: 'Ca', name: '钙', num: 20, mass: 40.08, category: 'alkaline', electron: [2, 8, 8, 2] },
      { symbol: 'Fe', name: '铁', num: 26, mass: 55.85, category: 'transition', electron: [2, 8, 14, 2] },
      { symbol: 'Cu', name: '铜', num: 29, mass: 63.55, category: 'transition', electron: [2, 8, 18, 1] },
      { symbol: 'Zn', name: '锌', num: 30, mass: 65.38, category: 'transition', electron: [2, 8, 18, 2] },
      { symbol: 'Br', name: '溴', num: 35, mass: 79.90, category: 'halogen', electron: [2, 8, 18, 7] },
      { symbol: 'Kr', name: '氪', num: 36, mass: 83.80, category: 'noble', electron: [2, 8, 18, 8] },
      { symbol: 'Ag', name: '银', num: 47, mass: 107.87, category: 'transition', electron: [2, 8, 18, 18, 1] },
      { symbol: 'I', name: '碘', num: 53, mass: 126.90, category: 'halogen', electron: [2, 8, 18, 18, 7] },
      { symbol: 'Xe', name: '氙', num: 54, mass: 131.29, category: 'noble', electron: [2, 8, 18, 18, 8] },
      { symbol: 'Au', name: '金', num: 79, mass: 196.97, category: 'transition', electron: [2, 8, 18, 32, 18, 1] },
      { symbol: 'Hg', name: '汞', num: 80, mass: 200.59, category: 'transition', electron: [2, 8, 18, 32, 18, 2] },
      { symbol: 'Pb', name: '铅', num: 82, mass: 207.2, category: 'metal', electron: [2, 8, 18, 32, 18, 4] },
      { symbol: 'Rn', name: '氡', num: 86, mass: 222, category: 'noble', electron: [2, 8, 18, 32, 18, 8] }
    ]

    const categoryColors = {
      alkali: '#E94560',
      alkaline: '#FF8C00',
      transition: '#D4AF37',
      metal: '#4A90D9',
      metalloid: '#2ED573',
      nonmetal: '#9370DB',
      halogen: '#00CED1',
      noble: '#FF69B4'
    }

    const categoryNames = {
      alkali: '碱金属',
      alkaline: '碱土金属',
      transition: '过渡金属',
      metal: '其他金属',
      metalloid: '准金属',
      nonmetal: '非金属',
      halogen: '卤素',
      noble: '稀有气体'
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // 渐变背景
      const bgGrad = ctx.createLinearGradient(0, 0, width, height)
      bgGrad.addColorStop(0, '#0D0D14')
      bgGrad.addColorStop(0.5, '#12121C')
      bgGrad.addColorStop(1, '#0D0D14')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // 网格背景
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke()
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
      }

      const cols = 8
      const rows = 5
      const cellW = Math.min((width - 60) / cols, 85)
      const cellH = Math.min((height - 140) / rows, 65)
      const startX = (width - cellW * cols) / 2
      const startY = 50

      elements.forEach((el, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = startX + col * cellW
        const y = startY + row * cellH
        const color = categoryColors[el.category] || '#888'
        const isSelected = selectedElement && selectedElement.num === el.num

        // 选中效果
        if (isSelected) {
          ctx.shadowColor = color
          ctx.shadowBlur = 20
        }

        // 卡片背景
        const cardGrad = ctx.createLinearGradient(x, y, x, y + cellH)
        cardGrad.addColorStop(0, color + '25')
        cardGrad.addColorStop(1, color + '10')
        ctx.fillStyle = cardGrad
        ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4)

        // 边框
        ctx.strokeStyle = isSelected ? color : color + '60'
        ctx.lineWidth = isSelected ? 2 : 1
        ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4)

        ctx.shadowBlur = 0

        // 原子序数
        ctx.fillStyle = color
        ctx.font = 'bold 10px "JetBrains Mono", monospace'
        ctx.fillText(el.num.toString(), x + 6, y + 14)

        // 元素符号
        ctx.fillStyle = '#F8F6F0'
        ctx.font = `bold ${Math.min(cellW / 2.5, 18)}px "Noto Serif SC", serif`
        ctx.fillText(el.symbol, x + cellW / 2, y + cellH / 2 + 5)
        ctx.textAlign = 'center'

        // 元素名称
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.font = '9px "Noto Sans SC", sans-serif'
        ctx.fillText(el.name, x + cellW / 2, y + cellH - 8)

        ctx.textAlign = 'left'
      })

      // 图例
      const legendY = height - 55
      const legendItems = Object.entries(categoryColors)
      const legendItemW = (width - 40) / legendItems.length

      legendItems.forEach(([cat, color], i) => {
        const lx = 20 + i * legendItemW
        ctx.fillStyle = color
        ctx.fillRect(lx, legendY, 10, 10)
        ctx.strokeStyle = color
        ctx.lineWidth = 0.5
        ctx.strokeRect(lx, legendY, 10, 10)
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = '10px "Noto Sans SC", sans-serif'
        ctx.fillText(categoryNames[cat], lx + 14, legendY + 9)
      })

      // 标题
      ctx.fillStyle = '#D4AF37'
      ctx.font = '13px "Noto Serif SC", serif'
      ctx.textAlign = 'center'
      ctx.fillText('元素周期表 · 点击元素查看电子排布', width / 2, height - 18)
      ctx.textAlign = 'left'
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

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const clickX = (e.clientX - rect.left) * scaleX
      const clickY = (e.clientY - rect.top) * scaleY

      const cols = 8
      const cellW = Math.min((width - 60) / cols, 85)
      const cellH = Math.min((height - 140) / 5, 65)
      const startX = (width - cellW * cols) / 2
      const startY = 50

      elements.forEach((el, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = startX + col * cellW
        const y = startY + row * cellH

        if (clickX >= x && clickX <= x + cellW && clickY >= y && clickY <= y + cellH) {
          setSelectedElement(el)
        }
      })
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      resizeObserver.disconnect()
      canvas.removeEventListener('click', handleClick)
    }
  }, [caseId, selectedElement])

  if (caseId !== 'periodic') return null

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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
            display: 'block',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* 元素详情面板 */}
      {selectedElement && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '220px',
          background: 'rgba(26, 26, 40, 0.95)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: categoryColors[selectedElement.category] || '#D4AF37',
                fontFamily: 'var(--font-serif)'
              }}>
                {selectedElement.symbol}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {selectedElement.name}
              </div>
            </div>
            <div style={{
              background: `${categoryColors[selectedElement.category]}20`,
              border: `1px solid ${categoryColors[selectedElement.category]}40`,
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '12px',
              color: categoryColors[selectedElement.category]
            }}>
              {selectedElement.num}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>相对原子质量</span>
              <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {selectedElement.mass}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>分类</span>
              <span style={{ fontSize: '12px', color: categoryColors[selectedElement.category] }}>
                {categoryNames[selectedElement.category]}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>电子排布</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {selectedElement.electron.map((count, i) => (
                <div key={i} style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  color: 'var(--accent-gold)'
                }}>
                  {count}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setSelectedElement(null)}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '8px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            关闭
          </button>
        </div>
      )}
    </div>
  )
}

const categoryColors = {
  alkali: '#E94560',
  alkaline: '#FF8C00',
  transition: '#D4AF37',
  metal: '#4A90D9',
  metalloid: '#2ED573',
  nonmetal: '#9370DB',
  halogen: '#00CED1',
  noble: '#FF69B4'
}

const categoryNames = {
  alkali: '碱金属',
  alkaline: '碱土金属',
  transition: '过渡金属',
  metal: '其他金属',
  metalloid: '准金属',
  nonmetal: '非金属',
  halogen: '卤素',
  noble: '稀有气体'
}
