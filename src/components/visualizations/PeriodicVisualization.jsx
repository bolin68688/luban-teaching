import { useRef, useEffect } from 'react'

export default function PeriodicVisualization({ caseId, simParams, isFullscreen }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

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

    // 简化的元素数据（代表性元素）
    const elements = [
      { symbol: 'H', name: '氢', num: 1, mass: 1.008, category: 'nonmetal' },
      { symbol: 'He', name: '氦', num: 2, mass: 4.003, category: 'noble' },
      { symbol: 'Li', name: '锂', num: 3, mass: 6.941, category: 'alkali' },
      { symbol: 'Be', name: '铍', num: 4, mass: 9.012, category: 'alkaline' },
      { symbol: 'B', name: '硼', num: 5, mass: 10.81, category: 'metalloid' },
      { symbol: 'C', name: '碳', num: 6, mass: 12.01, category: 'nonmetal' },
      { symbol: 'N', name: '氮', num: 7, mass: 14.01, category: 'nonmetal' },
      { symbol: 'O', name: '氧', num: 8, mass: 16.00, category: 'nonmetal' },
      { symbol: 'F', name: '氟', num: 9, mass: 19.00, category: 'halogen' },
      { symbol: 'Ne', name: '氖', num: 10, mass: 20.18, category: 'noble' },
      { symbol: 'Na', name: '钠', num: 11, mass: 22.99, category: 'alkali' },
      { symbol: 'Mg', name: '镁', num: 12, mass: 24.31, category: 'alkaline' },
      { symbol: 'Al', name: '铝', num: 13, mass: 26.98, category: 'metal' },
      { symbol: 'Si', name: '硅', num: 14, mass: 28.09, category: 'metalloid' },
      { symbol: 'P', name: '磷', num: 15, mass: 30.97, category: 'nonmetal' },
      { symbol: 'S', name: '硫', num: 16, mass: 32.07, category: 'nonmetal' },
      { symbol: 'Cl', name: '氯', num: 17, mass: 35.45, category: 'halogen' },
      { symbol: 'Ar', name: '氩', num: 18, mass: 39.95, category: 'noble' },
      { symbol: 'K', name: '钾', num: 19, mass: 39.10, category: 'alkali' },
      { symbol: 'Ca', name: '钙', num: 20, mass: 40.08, category: 'alkaline' },
      { symbol: 'Fe', name: '铁', num: 26, mass: 55.85, category: 'transition' },
      { symbol: 'Cu', name: '铜', num: 29, mass: 63.55, category: 'transition' },
      { symbol: 'Zn', name: '锌', num: 30, mass: 65.38, category: 'transition' },
      { symbol: 'Br', name: '溴', num: 35, mass: 79.90, category: 'halogen' },
      { symbol: 'Kr', name: '氪', num: 36, mass: 83.80, category: 'noble' },
      { symbol: 'Ag', name: '银', num: 47, mass: 107.87, category: 'transition' },
      { symbol: 'I', name: '碘', num: 53, mass: 126.90, category: 'halogen' },
      { symbol: 'Xe', name: '氙', num: 54, mass: 131.29, category: 'noble' },
      { symbol: 'Au', name: '金', num: 79, mass: 196.97, category: 'transition' },
      { symbol: 'Hg', name: '汞', num: 80, mass: 200.59, category: 'transition' },
      { symbol: 'Pb', name: '铅', num: 82, mass: 207.2, category: 'metal' },
      { symbol: 'Rn', name: '氡', num: 86, mass: 222, category: 'noble' }
    ]

    // 分类颜色
    const categoryColors = {
      alkali: '#E94560',
      alkaline: '#FF8C00',
      transition: '#C9A227',
      metal: '#4A90D9',
      metalloid: '#2ED573',
      nonmetal: '#9370DB',
      halogen: '#00CED1',
      noble: '#FF69B4'
    }

    // 计算电子排布
    const getElectronConfig = (num) => {
      const shells = [2, 8, 18, 32, 32, 18, 8]
      const config = []
      let remaining = num
      for (let i = 0; i < shells.length && remaining > 0; i++) {
        const electrons = Math.min(remaining, shells[i])
        config.push(electrons)
        remaining -= electrons
      }
      return config
    }

    // 绘制
    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // 背景
      ctx.fillStyle = '#1A1A2E'
      ctx.fillRect(0, 0, width, height)

      // 计算布局
      const cols = 6
      const rows = Math.ceil(elements.length / cols)
      const cellWidth = Math.min((width - 80) / cols, 90)
      const cellHeight = Math.min((height - 120) / rows, 70)
      const startX = (width - cellWidth * cols) / 2
      const startY = 40

      // 绘制元素
      elements.forEach((el, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = startX + col * cellWidth
        const y = startY + row * cellHeight

        // 元素格子
        const color = categoryColors[el.category] || '#888'
        ctx.fillStyle = color
        ctx.globalAlpha = 0.15
        ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4)
        ctx.globalAlpha = 1

        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.strokeRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4)

        // 原子序数
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.fillText(el.num.toString(), x + 6, y + 14)

        // 元素符号
        ctx.fillStyle = '#fff'
        ctx.font = `bold ${Math.min(cellWidth / 3, 20)}px "Noto Sans SC", sans-serif`
        ctx.fillText(el.symbol, x + cellWidth / 2 - ctx.measureText(el.symbol).width / 2, y + cellHeight / 2 + 5)

        // 元素名称
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = '10px "Noto Sans SC", sans-serif'
        ctx.fillText(el.name, x + cellWidth / 2 - ctx.measureText(el.name).width / 2, y + cellHeight - 8)
      })

      // 图例
      const legendY = height - 60
      const legendItems = Object.entries(categoryColors)
      const itemWidth = 80
      const legendStartX = (width - legendItems.length * itemWidth) / 2

      ctx.font = '11px "Noto Sans SC", sans-serif'
      legendItems.forEach(([cat, color], i) => {
        const lx = legendStartX + i * itemWidth
        ctx.fillStyle = color
        ctx.fillRect(lx, legendY, 12, 12)
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.strokeRect(lx, legendY, 12, 12)
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        const catNames = {
          alkali: '碱金属',
          alkaline: '碱土金属',
          transition: '过渡金属',
          metal: '其他金属',
          metalloid: '准金属',
          nonmetal: '非金属',
          halogen: '卤素',
          noble: '稀有气体'
        }
        ctx.fillText(catNames[cat] || cat, lx + 16, legendY + 10)
      })

      // 底部信息
      ctx.fillStyle = '#C9A227'
      ctx.font = 'bold 14px "Noto Sans SC", sans-serif'
      ctx.fillText('元素周期表 - 点击元素查看详情', width / 2 - 100, height - 15)
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

    // 点击选中元素
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      const cols = 6
      const cellWidth = Math.min((width - 80) / cols, 90)
      const cellHeight = Math.min((height - 120) / Math.ceil(elements.length / cols), 70)
      const startX = (width - cellWidth * cols) / 2
      const startY = 40

      elements.forEach((el, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = startX + col * cellWidth
        const y = startY + row * cellHeight

        if (clickX >= x && clickX <= x + cellWidth && clickY >= y && clickY <= y + cellHeight) {
          // 显示元素详情
          const config = getElectronConfig(el.num)
          alert(`元素信息\n\n${el.name} (${el.symbol})\n原子序数: ${el.num}\n相对原子质量: ${el.mass}\n电子排布: ${config.join('-')}\n分类: ${el.category}`)
        }
      })
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      resizeObserver.disconnect()
      canvas.removeEventListener('click', handleClick)
    }
  }, [caseId])

  if (caseId !== 'periodic') return null

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
          display: 'block',
          cursor: 'pointer'
        }}
      />
    </div>
  )
}