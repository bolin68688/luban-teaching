import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Maximize2, Minimize2, Sun, Moon, X, BookOpen, Sliders, HelpCircle } from 'lucide-react'
import { getCaseById } from '../../data/cases.js'
import WaveInterferenceVisualization from '../visualizations/WaveInterferenceVisualization.jsx'
import SolarSystemVisualization from '../visualizations/SolarSystemVisualization.jsx'
import AcidBaseVisualization from '../visualizations/AcidBaseVisualization.jsx'
import TrigonometryVisualization from '../visualizations/TrigonometryVisualization.jsx'

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
    case 'wave-interference':
      return <WaveInterferenceVisualization />
    case 'solar-system':
      return <SolarSystemVisualization />
    case 'acid-base':
      return <AcidBaseVisualization />
    case 'trigonometry':
      return <TrigonometryVisualization />
    default:
      return <WaveInterferenceVisualization />
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
      case 'wave-interference':
        return {
          '波长': 1.5,
          '双缝间距': 4,
          '屏幕距离': 10,
          '显示加强区': true,
          '显示相消区': true
        }
      case 'solar-system':
        return {
          '太阳质量': 1,
          '初始速度': 1,
          '引力强度': 1,
          '显示轨道': true,
          '速度矢量': false
        }
      case 'acid-base':
        return {
          '酸浓度': 0.05,
          '碱浓度': 0.05,
          '初始体积': 25,
          '指示剂': 'phenolphthalein'
        }
      case 'trigonometry':
        return {
          '角度θ': 45,
          '振幅A': 1,
          '频率ω': 1,
          '相位φ': 0,
          '正弦': true,
          '余弦': true,
          '正切': false
        }
      default:
        return {}
    }
  }

  const [simParams, setSimParams] = useState(() => getInitialParams(caseId))

  // 实时计算值
  const getInitialDisplayValues = (id) => {
    switch (id) {
      case 'wave-interference':
        return {
          fringeSpacing: '0.75 px',
          maxOrder: '5',
          constructiveCount: '6',
          destructiveCount: '5'
        }
      case 'solar-system':
        return {
          orbitalPeriod: '125.6s',
          orbitalSpeed: '5.0',
          eccentricity: '0.00',
          energy: '-0.5 J'
        }
      case 'acid-base':
        return {
          equivalencePoint: '7.0',
          titrantVolume: '0.00 mL',
          phIndicator: '8.2-10.0',
          neutralizationHeat: '-57.3 kJ/mol'
        }
      case 'trigonometry':
        return {
          sinValue: '0.707',
          cosValue: '0.707',
          tanValue: '1.000',
          unitCirclePoint: '(0.71, 0.71)'
        }
      default:
        return {}
    }
  }

  const [displayValues, setDisplayValues] = useState(() => getInitialDisplayValues(caseId))

  const handleParamChange = useCallback((label, value) => {
    setSimParams(prev => ({ ...prev, [label]: value }))

    // 根据案例计算实时参数
    if (caseId === 'wave-interference') {
      const wavelength = label === '波长' ? value : simParams['波长']
      const slitDistance = label === '双缝间距' ? value : simParams['双缝间距']
      const screenDistance = label === '屏幕距离' ? value : simParams['屏幕距离']

      const fringeSpacing = (wavelength * screenDistance / slitDistance * 2).toFixed(2)
      const maxOrder = Math.floor(slitDistance / wavelength * 2)

      setDisplayValues({
        fringeSpacing: `${fringeSpacing} px`,
        maxOrder: String(maxOrder),
        constructiveCount: String(maxOrder + 1),
        destructiveCount: String(maxOrder)
      })
    }

    if (caseId === 'trigonometry') {
      const angle = label === '角度θ' ? value : simParams['角度θ']
      const angleRad = (angle * Math.PI) / 180

      setDisplayValues({
        sinValue: Math.sin(angleRad).toFixed(3),
        cosValue: Math.cos(angleRad).toFixed(3),
        tanValue: Math.tan(angleRad).toFixed(3),
        unitCirclePoint: `(${Math.cos(angleRad).toFixed(2)}, ${Math.sin(angleRad).toFixed(2)})`
      })
    }
  }, [caseId, simParams])

  // 实时更新计算
  useEffect(() => {
    // 参数变化时更新显示值已在handleParamChange中处理
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