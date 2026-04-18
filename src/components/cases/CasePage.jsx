import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Maximize2, Minimize2, Sun, Moon, X, BookOpen, Sliders, HelpCircle } from 'lucide-react'
import { getCaseById } from '../../data/cases.js'
import WaveInterferenceVisualization from '../visualizations/WaveInterferenceVisualization.jsx'
import SolarSystemVisualization from '../visualizations/SolarSystemVisualization.jsx'
import ElectrolysisVisualization from '../visualizations/ElectrolysisVisualization.jsx'
import TrigonometryVisualization from '../visualizations/TrigonometryVisualization.jsx'

const TABS = [
  { id: 'xinfa', label: '鲁班心法', icon: BookOpen },
  { id: 'kaiwu', label: '鲁班开物', icon: Sliders },
  { id: 'wenda', label: '鲁班问答', icon: HelpCircle }
]

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

function KaiwuPanel({ caseData, simParams, onParamChange, displayValues, vizActions }) {
  const { kaiwu } = caseData

  // 处理按钮操作（如滴定开始/重置）
  const handleAction = (actionLabel) => {
    if (vizActions && vizActions[actionLabel]) {
      vizActions[actionLabel]()
    }
  }

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
          {kaiwu.controls.map((ctrl, i) => {
            const currentValue = simParams[ctrl.label]
            const isToggle = ctrl.type === 'toggle'
            const isButton = ctrl.type === 'button'
            const isSlider = ctrl.type === 'slider'
            const isSelect = ctrl.type === 'select'

            if (isButton) {
              return (
                <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{ctrl.label}</span>
                  {(ctrl.options || []).map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleAction(opt)}
                      style={{
                        padding: '8px 16px',
                        background: 'var(--accent-gold)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--bg-primary)',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )
            }

            return (
              <div key={i}>
                {!isButton && (
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
                      {isSlider && currentValue !== undefined ? `${currentValue}${ctrl.unit || ''}` : ''}
                      {isSelect && currentValue !== undefined ? String(currentValue) : ''}
                      {isToggle ? (currentValue !== false ? '开启' : '关闭') : ''}
                    </span>
                  </label>
                )}
                {isSlider && (
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={currentValue ?? ctrl.default}
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
                {isSelect && (
                  <select
                    value={currentValue ?? ctrl.default}
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
                    {(ctrl.options || []).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
                {isToggle && (
                  <label
                    onClick={() => onParamChange(ctrl.label, currentValue === false || currentValue === undefined ? true : false)}
                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span style={{
                      width: '36px',
                      height: '20px',
                      background: currentValue !== false ? 'var(--accent-gold)' : '#333',
                      borderRadius: '10px',
                      position: 'relative',
                      transition: 'background 0.2s',
                      display: 'inline-block'
                    }}>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        background: '#fff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: currentValue !== false ? '18px' : '2px',
                        transition: 'left 0.2s'
                      }} />
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {currentValue !== false ? '已启用' : '未启用'}
                    </span>
                  </label>
                )}
              </div>
            )
          })}
          ))}
        </div>
      </div>

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

      <div style={{
        fontSize: '13px',
        color: 'var(--text-muted)',
        marginBottom: '12px'
      }}>
        第 {currentQ + 1} / {wenda.length} 题
      </div>

      <div style={{
        fontSize: '16px',
        color: 'var(--text-primary)',
        marginBottom: '20px',
        lineHeight: '1.6',
        fontWeight: '500'
      }}>
        {q.question}
      </div>

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

      {answered && (
        <div style={{
          background: isCorrect
            ? 'rgba(201, 162, 39, 0.08)'
            : 'rgba(233, 69, 96, 0.08)',
          border: `1px solid ${isCorrect ? 'var(--border-gold)' : 'var(--accent-red)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px'
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

// 根据案例ID选择可视化组件，传递外部参数控制
function VisualizationComponent({ caseId, simParams, isFullscreen, vizActions }) {
  const commonProps = { params: simParams }

  switch (caseId) {
    case 'wave-interference':
      return <WaveInterferenceVisualization {...commonProps} />
    case 'solar-system':
      return <SolarSystemVisualization {...commonProps} actions={vizActions || {}} />
    case 'electrolysis':
      return <ElectrolysisVisualization {...commonProps} actions={vizActions || {}} />
    case 'trigonometry':
      return <TrigonometryVisualization {...commonProps} />
    default:
      return <WaveInterferenceVisualization {...commonProps} />
  }
}

export default function CasePage({ caseId, onBack, theme, onToggleTheme }) {
  const caseData = getCaseById(caseId)
  const [panelState, setPanelState] = useState({ tab: 'xinfa', open: false })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)
  const vizActions = useRef({}) // 用于传递操作给可视化组件（如滴定开始/重置）

  // 模拟参数状态
  const getInitialParams = (id) => {
    switch (id) {
      case 'wave-interference':
        return { '波长': 1.5, '双缝间距': 4, '屏幕距离': 10, '显示加强区': true, '显示相消区': true }
      case 'solar-system':
        return { '太阳质量': 1, '初始速度': 1, '引力强度': 1, '显示轨道': true, '速度矢量': false }
      case 'electrolysis':
        return { '电压': 6, '电解质浓度': 15, '电解质类型': 'Na₂SO₄(中性)', '显示分子式': true, '显示电子流向': false }
      case 'trigonometry':
        return { '角度θ': 45, '振幅A': 1, '频率ω': 1, '相位φ': 0, '正弦': true, '余弦': true, '正切': false }
      default:
        return {}
    }
  }

  const [simParams, setSimParams] = useState(() => getInitialParams(caseId))

  const getInitialDisplayValues = (id) => {
    switch (id) {
      case 'wave-interference':
        return { fringeSpacing: '0.75 px', maxOrder: '5', constructiveCount: '6', destructiveCount: '5' }
      case 'solar-system':
        return { orbitalPeriod: '125.6s', orbitalSpeed: '5.0', eccentricity: '0.00', energy: '-0.5 J' }
      case 'electrolysis':
        return { h2Volume: '0.0 mL', o2Volume: '0.0 mL', ratio: '--', current: '0.00 A' }
      case 'trigonometry':
        return { sinValue: '0.707', cosValue: '0.707', tanValue: '1.000', unitCirclePoint: '(0.71, 0.71)' }
      default:
        return {}
    }
  }

  const [displayValues, setDisplayValues] = useState(() => getInitialDisplayValues(caseId))

  const handleParamChange = useCallback((label, value) => {
    setSimParams(prev => ({ ...prev, [label]: value }))

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

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // ★ 核心修复：面板切换使用单一state对象，避免嵌套setState
  const handleTabClick = useCallback((tabId) => {
    setPanelState(prev => {
      if (prev.tab === tabId && prev.open) {
        // 点击同一标签 → 关闭面板
        return { ...prev, open: false }
      } else {
        // 点击不同标签 → 切换并打开面板
        return { tab: tabId, open: true }
      }
    })
  }, [])

  const closePanel = useCallback(() => {
    setPanelState(prev => ({ ...prev, open: false }))
  }, [])

  // 全屏变化监听
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  if (!caseData) return null

  const { tab: activeTab, open: panelOpen } = panelState

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
      {/* 顶部导航 */}
      {!isFullscreen && (
        <header style={{
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 50
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
          transition: 'flex 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          background: 'var(--bg-secondary)',
          zIndex: 1
        }}>
          <VisualizationComponent
            caseId={caseId}
            simParams={simParams}
            isFullscreen={isFullscreen}
            vizActions={vizActions.current}
          />

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

        {/* 右侧面板 - flex布局，真正挤开可视化区域 */}
        <div style={{
          flex: panelOpen ? '0 0 35%' : '0 0 0%',
          minWidth: 0,
          height: '100%',
          background: 'var(--bg-card)',
          borderLeft: panelOpen ? '1px solid var(--border)' : 'none',
          transition: 'flex 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          boxShadow: panelOpen ? '-4px 0 20px rgba(0,0,0,0.3)' : 'none'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
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
                {TABS.map(tab => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        background: isActive ? 'var(--highlight)' : 'transparent',
                        border: isActive ? '1px solid var(--border-gold)' : '1px solid transparent',
                        borderRadius: 'var(--radius-md)',
                        color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
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
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={closePanel}
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
                  vizActions={vizActions.current}
                />
              )}
              {activeTab === 'wenda' && <WendaPanel caseData={caseData} />}
            </div>
          </div>
        </div>
      </div>

      {/* ★ 底部标签栏 - 简洁按钮，确保可点击 */}
      {!isFullscreen && (
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 100
        }}>
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id && panelOpen
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 24px',
                  background: isActive ? 'var(--highlight)' : 'var(--bg-card)',
                  border: isActive ? '1px solid var(--border-gold)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  position: 'relative',
                  zIndex: 101
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-gold)'
                  e.currentTarget.style.color = 'var(--accent-gold)'
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
