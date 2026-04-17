import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Maximize2, Minimize2, Sun, Moon, X, BookOpen, Sliders, HelpCircle } from 'lucide-react'
import { getCaseById } from '../../data/cases.js'
import LeverVisualization from '../visualizations/LeverVisualization.jsx'
import RefractionVisualization from '../visualizations/RefractionVisualization.jsx'
import EquationVisualization from '../visualizations/EquationVisualization.jsx'
import PeriodicVisualization from '../visualizations/PeriodicVisualization.jsx'

const TABS = [
  { id: 'xinfa', label: '鲁班心法', icon: BookOpen },
  { id: 'kaiwu', label: '鲁班开物', icon: Sliders },
  { id: 'wenda', label: '鲁班问答', icon: HelpCircle }
]

function TabButton({ tab, isActive, onClick }) {
  const Icon = tab.icon
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 20px',
        background: isActive ? 'var(--highlight)' : 'transparent',
        border: isActive ? '1px solid var(--border-gold)' : '1px solid transparent',
        borderRadius: 'var(--radius-md)',
        color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.3s var(--ease-out)',
        fontFamily: 'var(--font-sans)'
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'var(--highlight)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }
      }}
    >
      <Icon size={16} />
      {tab.label}
    </button>
  )
}

function XinfaPanel({ caseData }) {
  const { xinfa } = caseData
  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      <h3 style={{
        fontSize: '22px',
        fontFamily: 'var(--font-serif)',
        color: 'var(--accent-gold)',
        marginBottom: '16px',
        fontWeight: '600'
      }}>
        鲁班心法
      </h3>

      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-gold)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--accent-gold)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '8px'
        }}>
          核心理论
        </div>
        <div style={{
          fontSize: '18px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary)',
          fontWeight: '500'
        }}>
          {xinfa.theory}
        </div>
      </div>

      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--accent-gold)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '8px'
        }}>
          鲁班视角
        </div>
        <div style={{
          fontSize: '15px',
          fontFamily: 'var(--font-serif)',
          color: 'var(--text-secondary)',
          lineHeight: '1.7',
          fontStyle: 'italic'
        }}>
          "{xinfa.luBanView}"
        </div>
      </div>

      <div>
        <div style={{
          fontSize: '12px',
          color: 'var(--accent-gold)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '12px'
        }}>
          生活场景
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
          {xinfa.scenarios.map((s, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-gold)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '4px'
              }}>
                {s.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KaiwuPanel({ caseData, simParams, onParamChange, displayValues }) {
  const { kaiwu } = caseData

  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      <h3 style={{
        fontSize: '22px',
        fontFamily: 'var(--font-serif)',
        color: 'var(--accent-gold)',
        marginBottom: '16px',
        fontWeight: '600'
      }}>
        鲁班开物
      </h3>

      {/* 控件区 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '12px'
        }}>
          交互控制
        </div>
        <div style={{ display: 'grid', gap: '16px' }}>
          {kaiwu.controls.map((ctrl, i) => (
            <div key={i}>
              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {ctrl.label}
                </span>
                <span style={{
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-gold)'
                }}>
                  {ctrl.type === 'slider' && simParams[ctrl.label] !== undefined
                    ? `${simParams[ctrl.label]}${ctrl.unit || ''}`
                    : ctrl.type === 'select'
                    ? simParams[ctrl.label]
                    : ''}
                </span>
              </label>
              {ctrl.type === 'slider' && (
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={simParams[ctrl.label] ?? ctrl.default}
                  onChange={e => onParamChange(ctrl.label, parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    appearance: 'none',
                    background: 'var(--bg-primary)',
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              )}
              {ctrl.type === 'select' && (
                <select
                  value={simParams[ctrl.label] ?? ctrl.default}
                  onChange={e => onParamChange(ctrl.label, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {ctrl.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 实时数据区 */}
      <div>
        <div style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '12px'
        }}>
          实时数据
        </div>
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'grid',
          gap: '12px'
        }}>
          {kaiwu.displayParams.map((param, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {param.label}
              </span>
              <span style={{
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                fontWeight: '500'
              }}>
                {displayValues[param.key] !== undefined
                  ? String(displayValues[param.key])
                  : '--'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WendaPanel({ caseData }) {
  const { wenda } = caseData
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)

  const q = wenda[currentQ]

  const handleSelect = (opt) => {
    if (answered) return
    setSelected(opt)
    setAnswered(true)
  }

  const nextQ = () => {
    if (currentQ < wenda.length - 1) {
      setCurrentQ(currentQ + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const reset = () => {
    setCurrentQ(0)
    setSelected(null)
    setAnswered(false)
  }

  const isCorrect = selected && selected.startsWith(q.answer)

  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      <h3 style={{
        fontSize: '22px',
        fontFamily: 'var(--font-serif)',
        color: 'var(--accent-gold)',
        marginBottom: '16px',
        fontWeight: '600'
      }}>
        鲁班问答
      </h3>

      {/* 进度 */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '20px'
      }}>
        {wenda.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              background: i < currentQ
                ? 'var(--accent-gold)'
                : i === currentQ
                ? answered
                  ? isCorrect
                    ? 'var(--accent-gold)'
                    : 'var(--accent-red)'
                  : 'var(--border)'
                : 'var(--border)'
            }}
          />
        ))}
      </div>

      {/* 题号 */}
      <div style={{
        fontSize: '13px',
        color: 'var(--text-muted)',
        marginBottom: '12px'
      }}>
        第 {currentQ + 1} / {wenda.length} 题
      </div>

      {/* 题目 */}
      <div style={{
        fontSize: '16px',
        color: 'var(--text-primary)',
        marginBottom: '20px',
        lineHeight: '1.6',
        fontWeight: '500'
      }}>
        {q.question}
      </div>

      {/* 选项 */}
      <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === opt
          const isCorrectOpt = opt.startsWith(q.answer)
          let bg = 'var(--bg-primary)'
          let border = 'var(--border)'
          let color = 'var(--text-primary)'

          if (answered) {
            if (isCorrectOpt) {
              bg = 'rgba(201, 162, 39, 0.15)'
              border = 'var(--accent-gold)'
              color = 'var(--accent-gold)'
            } else if (isSelected && !isCorrectOpt) {
              bg = 'rgba(233, 69, 96, 0.15)'
              border = 'var(--accent-red)'
              color = 'var(--accent-red)'
            }
          } else if (isSelected) {
            bg = 'var(--highlight)'
            border = 'var(--border-gold)'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={answered}
              style={{
                padding: '12px 16px',
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 'var(--radius-md)',
                color,
                fontSize: '14px',
                textAlign: 'left',
                cursor: answered ? 'default' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseEnter={e => {
                if (!answered) {
                  e.currentTarget.style.borderColor = 'var(--border-gold)'
                  e.currentTarget.style.background = 'var(--highlight)'
                }
              }}
              onMouseLeave={e => {
                if (!answered && !isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--bg-primary)'
                }
              }}
            >
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: answered && isCorrectOpt
                  ? 'var(--accent-gold)'
                  : answered && isSelected && !isCorrectOpt
                  ? 'var(--accent-red)'
                  : 'transparent',
                border: answered && isCorrectOpt
                  ? 'var(--accent-gold)'
                  : answered && isSelected && !isCorrectOpt
                  ? 'var(--accent-red)'
                  : '1px solid var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                flexShrink: 0
              }}>
                {opt.charAt(0)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {/* 解析 */}
      {answered && (
        <div style={{
          background: isCorrect
            ? 'rgba(201, 162, 39, 0.08)'
            : 'rgba(233, 69, 96, 0.08)',
          border: `1px solid ${isCorrect ? 'var(--border-gold)' : 'var(--accent-red)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px',
          animation: 'fadeIn 0.3s var(--ease-out)'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: isCorrect ? 'var(--accent-gold)' : 'var(--accent-red)',
            marginBottom: '8px'
          }}>
            {isCorrect ? '回答正确!' : '回答错误'}
          </div>
          <div style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            {q.explanation}
          </div>
        </div>
      )}

      {/* 导航按钮 */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {currentQ < wenda.length - 1 && answered && (
          <button
            onClick={nextQ}
            style={{
              flex: 1,
              padding: '12px',
              background: 'var(--accent-gold)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'var(--bg-primary)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            下一题
          </button>
        )}
        {currentQ === wenda.length - 1 && answered && (
          <button
            onClick={reset}
            style={{
              flex: 1,
              padding: '12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-gold)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            重新开始
          </button>
        )}
      </div>
    </div>
  )
}

// 根据案例ID选择可视化组件
function VisualizationComponent({ caseId, simParams, isFullscreen }) {
  switch (caseId) {
    case 'lever':
      return <LeverVisualization caseId={caseId} simParams={simParams} isFullscreen={isFullscreen} />
    case 'refraction':
      return <RefractionVisualization caseId={caseId} simParams={simParams} isFullscreen={isFullscreen} />
    case 'equation':
      return <EquationVisualization caseId={caseId} simParams={simParams} isFullscreen={isFullscreen} />
    case 'periodic':
      return <PeriodicVisualization caseId={caseId} simParams={simParams} isFullscreen={isFullscreen} />
    default:
      return <LeverVisualization caseId={caseId} simParams={simParams} isFullscreen={isFullscreen} />
  }
}

export default function CasePage({ caseId, onBack, theme, onToggleTheme }) {
  const caseData = getCaseById(caseId)
  const [activeTab, setActiveTab] = useState('xinfa')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const containerRef = useRef(null)

  // 模拟参数状态 - 根据案例初始化不同参数
  const getInitialParams = (id) => {
    switch (id) {
      case 'lever':
        return {
          '支点位置': 0.5,
          '动力臂长度': 1.5,
          '阻力臂长度': 1.5,
          '动力大小': '5N',
          '阻力物质量': '5kg'
        }
      case 'refraction':
        return {
          '入射角': 45,
          '介质组合': '空气→水(n=1.33)',
          '显示全反射': false
        }
      case 'equation':
        return {
          '直线1斜率': 1,
          '直线1截距': 0,
          '直线2斜率': -1,
          '直线2截距': 5,
          '预设场景': '购物决策'
        }
      case 'periodic':
        return {
          '选择元素': 'H',
          '属性维度': '电负性',
          '同族高亮': false,
          '3D电子层模型': false
        }
      default:
        return {}
    }
  }

  const [simParams, setSimParams] = useState(() => getInitialParams(caseId))

  // 实时计算值
  const getInitialDisplayValues = (id) => {
    switch (id) {
      case 'lever':
        return {
          leftTorque: '7.5 N·m',
          rightTorque: '7.5 N·m',
          balanceState: '平衡',
          mechanicalAdvantage: '100%'
        }
      case 'refraction':
        return {
          refractionAngle: '32.1°',
          criticalAngle: '48.8°',
          refractiveIndex: '1.33',
          totalReflection: '否'
        }
      case 'equation':
        return {
          solution: '(2.5, 2.5)',
          solutionType: '唯一解',
          eq1: 'y = x',
          eq2: 'y = -x + 5'
        }
      case 'periodic':
        return {
          symbol: 'H',
          atomicNumber: '1',
          electronConfig: '1',
          electronegativity: '2.20'
        }
      default:
        return {}
    }
  }

  const [displayValues, setDisplayValues] = useState(() => getInitialDisplayValues(caseId))

  const handleParamChange = useCallback((label, value) => {
    setSimParams(prev => ({ ...prev, [label]: value }))

    // 根据案例计算实时参数
    if (caseId === 'refraction') {
      const mediaIndex = {
        '空气→水(n=1.33)': 1.33,
        '空气→玻璃(n=1.50)': 1.50,
        '空气→钻石(n=2.42)': 2.42
      }
      const n = mediaIndex[value] || (label === '介质组合' ? 1.33 : mediaIndex[simParams['介质组合'] || '空气→水(n=1.33)'])
      const incidentAngle = label === '入射角' ? value : simParams['入射角']
      const incidentRad = (incidentAngle * Math.PI) / 180
      const sinRefracted = Math.sin(incidentRad) / n
      const refractionAngle = sinRefracted > 1 ? null : Math.asin(sinRefracted) * 180 / Math.PI
      const criticalAngle = Math.asin(1 / n) * 180 / Math.PI
      const isTotalReflection = sinRefracted > 1

      setDisplayValues({
        refractionAngle: refractionAngle !== null ? `${refractionAngle.toFixed(1)}°` : 'N/A',
        criticalAngle: `${criticalAngle.toFixed(1)}°`,
        refractiveIndex: n.toFixed(2),
        totalReflection: isTotalReflection ? '是' : '否'
      })
    }

    if (caseId === 'equation') {
      const m1 = label === '直线1斜率' ? value : simParams['直线1斜率']
      const b1 = label === '直线1截距' ? value : simParams['直线1截距']
      const m2 = label === '直线2斜率' ? value : simParams['直线2斜率']
      const b2 = label === '直线2截距' ? value : simParams['直线2截距']

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

      setDisplayValues({
        solution: solution ? `(${solution.x}, ${solution.y})` : '无',
        solutionType,
        eq1: `y = ${m1}x + ${b1}`,
        eq2: `y = ${m2}x + ${b2}`
      })
    }
  }, [caseId, simParams])

  // 实时更新计算
  useEffect(() => {
    if (caseId === 'lever') {
      const pArm = simParams['动力臂长度']
      const rArm = simParams['阻力臂长度']
      const power = parseInt(simParams['动力大小']) || 5
      const resistance = (parseInt(simParams['阻力物质量']) || 5) * 9.8 / 100

      const leftTorque = power * pArm
      const rightTorque = resistance * rArm
      const diff = leftTorque - rightTorque

      setDisplayValues({
        leftTorque: `${leftTorque.toFixed(1)} N·m`,
        rightTorque: `${rightTorque.toFixed(1)} N·m`,
        balanceState: Math.abs(diff) < 0.5 ? '平衡' : diff > 0 ? '左倾' : '右倾',
        mechanicalAdvantage: `${Math.round((pArm / rArm) * 100)}%`
      })
    }
  }, [simParams, caseId])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const togglePanel = useCallback((tabId) => {
    if (activeTab === tabId && panelOpen) {
      setPanelOpen(false)
    } else {
      setActiveTab(tabId)
      setPanelOpen(true)
    }
  }, [activeTab, panelOpen])

  // 全屏变化监听
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // ESC关闭面板
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && panelOpen && !isFullscreen) {
        setPanelOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [panelOpen, isFullscreen])

  if (!caseData) return null

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 顶部导航 - 非全屏时显示 */}
      {!isFullscreen && (
        <header style={{
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          flexShrink: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onBack}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '14px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text-primary)'
                e.currentTarget.style.background = 'var(--highlight)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <ArrowLeft size={18} />
              返回
            </button>
            <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
            <h1 style={{
              fontSize: '18px',
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-primary)',
              fontWeight: '600'
            }}>
              {caseData.title}
            </h1>
            <span style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              background: 'var(--highlight)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {caseData.subject}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleFullscreen}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 8px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-gold)'
                e.currentTarget.style.color = 'var(--accent-gold)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={onToggleTheme}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 8px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-gold)'
                e.currentTarget.style.color = 'var(--accent-gold)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
      )}

      {/* 主内容区 */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* 可视化区域 */}
        <div style={{
          flex: panelOpen ? '0 0 65%' : '1',
          transition: 'flex 0.4s var(--ease-out)',
          position: 'relative',
          background: 'var(--bg-secondary)'
        }}>
          <VisualizationComponent
            caseId={caseId}
            simParams={simParams}
            isFullscreen={isFullscreen}
          />

          {/* 全屏退出按钮 */}
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                padding: '8px 16px',
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-gold)'
                e.currentTarget.style.color = 'var(--accent-gold)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              ESC 退出全屏
            </button>
          )}
        </div>

        {/* 右侧面板 */}
        <div style={{
          width: panelOpen ? '35%' : '0',
          transition: 'width 0.4s var(--ease-out)',
          overflow: 'hidden',
          background: 'var(--bg-card)',
          borderLeft: panelOpen ? '1px solid var(--border)' : 'none',
          position: 'relative',
          flexShrink: 0
        }}>
          {panelOpen && (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.4s var(--ease-out)'
            }}>
              {/* 面板头部 */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {TABS.map(tab => (
                    <TabButton
                      key={tab.id}
                      tab={tab}
                      isActive={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* 面板内容 */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                {activeTab === 'xinfa' && <XinfaPanel caseData={caseData} />}
                {activeTab === 'kaiwu' && (
                  <KaiwuPanel
                    caseData={caseData}
                    simParams={simParams}
                    onParamChange={handleParamChange}
                    displayValues={displayValues}
                  />
                )}
                {activeTab === 'wenda' && <WendaPanel caseData={caseData} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部标签栏 - 非全屏时显示 */}
      {!isFullscreen && (
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexShrink: 0
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => togglePanel(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 24px',
                background: activeTab === tab.id && panelOpen ? 'var(--highlight)' : 'var(--bg-card)',
                border: activeTab === tab.id && panelOpen ? '1px solid var(--border-gold)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: activeTab === tab.id && panelOpen ? 'var(--accent-gold)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s var(--ease-out)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-gold)'
                e.currentTarget.style.color = 'var(--accent-gold)'
              }}
              onMouseLeave={e => {
                if (!(activeTab === tab.id && panelOpen)) {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}