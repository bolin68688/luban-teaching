import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Maximize2, Minimize2, X, BookOpen, Sliders, HelpCircle } from 'lucide-react'
import { getCaseById } from '../../data/cases.js'
import WaveInterferenceVisualization from '../visualizations/WaveInterferenceVisualization.jsx'
import SolarSystemVisualization from '../visualizations/SolarSystemVisualization.jsx'
import ElectrolysisVisualization from '../visualizations/ElectrolysisVisualization.jsx'
import TrigonometryVisualization from '../visualizations/TrigonometryVisualization.jsx'

const TABS = [
  { id: 'xinfa', label: '心法', icon: BookOpen },
  { id: 'kaiwu', label: '开物', icon: Sliders },
  { id: 'wenda', label: '问答', icon: HelpCircle }
]

const subjectColors = {
  'wave-interference': { bg: '#EBF4FA', accent: '#3B6E8F', text: '物理 · 光学' },
  'solar-system': { bg: '#FDF3E7', accent: '#B07D4A', text: '天文 · 动力学' },
  'electrolysis': { bg: '#E8F5EE', accent: '#2D8B6B', text: '化学 · 电化学' },
  'trigonometry': { bg: '#F0EBF5', accent: '#6B4F8C', text: '数学 · 三角学' }
}

/* ═══════════════════════════════════════════════════════════
   鲁班心法
   ═══════════════════════════════════════════════════════════ */
function XinfaPanel({ caseData }) {
  const { xinfa } = caseData
  const colors = subjectColors[caseData.id] || subjectColors['electrolysis']

  return (
    <div style={{ padding: '28px', height: '100%', overflowY: 'auto' }}>
      <div style={{
        background: colors.bg,
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '11px', color: colors.accent, letterSpacing: '0.1em', marginBottom: '8px', fontWeight: '500' }}>
          核心理论
        </div>
        <div style={{
          fontSize: '18px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary)',
          fontWeight: '500',
          lineHeight: 1.5
        }}>
          {xinfa.theory}
        </div>
      </div>

      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '10px', fontWeight: '500' }}>
          鲁班视角
        </div>
        <div style={{
          fontSize: '15px',
          fontFamily: 'var(--font-display)',
          color: 'var(--text-secondary)',
          lineHeight: 1.9,
          fontStyle: 'italic'
        }}>
          "{xinfa.luBanView}"
        </div>
      </div>

      <div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '14px', fontWeight: '500' }}>
          生活场景
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {xinfa.scenarios.map((s, i) => (
            <div key={i} style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 18px',
              transition: 'all 0.25s',
              cursor: 'default'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = colors.accent + '30'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {s.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   鲁班开物
   ═══════════════════════════════════════════════════════════ */
function KaiwuPanel({ caseData, simParams, onParamChange, displayValues, vizActions }) {
  const { kaiwu } = caseData
  const colors = subjectColors[caseData.id] || subjectColors['electrolysis']

  const handleAction = (label) => {
    if (vizActions && vizActions[label]) vizActions[label]()
  }

  return (
    <div style={{ padding: '28px', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '14px', fontWeight: '500' }}>
          交互控制
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {kaiwu.controls.map((ctrl, i) => {
            const val = simParams[ctrl.label]
            const isBtn = ctrl.type === 'button'
            const isSlider = ctrl.type === 'slider'
            const isSelect = ctrl.type === 'select'
            const isToggle = ctrl.type === 'toggle'

            if (isBtn) {
              return (
                <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', minWidth: '60px' }}>{ctrl.label}</span>
                  {(ctrl.options || []).map(opt => (
                    <button key={opt} onClick={() => handleAction(opt)} style={{
                      padding: '8px 16px', background: colors.accent, border: 'none',
                      borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '13px',
                      fontWeight: '500', cursor: 'pointer', transition: 'opacity 0.2s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >{opt}</button>
                  ))}
                </div>
              )
            }

            return (
              <div key={i}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{ctrl.label}</span>
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: colors.accent, fontWeight: '500' }}>
                    {isSlider && val !== undefined ? `${val}${ctrl.unit || ''}` : ''}
                    {isSelect && val !== undefined ? String(val) : ''}
                    {isToggle ? (val !== false ? '开启' : '关闭') : ''}
                  </span>
                </label>
                {isSlider && (
                  <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step}
                    value={val ?? ctrl.default}
                    onChange={e => onParamChange(ctrl.label, parseFloat(e.target.value))}
                    style={{
                      width: '100%', height: '6px', appearance: 'none',
                      background: 'var(--bg-primary)', borderRadius: '3px', outline: 'none', cursor: 'pointer'
                    }}
                  />
                )}
                {isSelect && (
                  <select value={val ?? ctrl.default} onChange={e => onParamChange(ctrl.label, e.target.value)}
                    style={{
                      width: '100%', padding: '8px 12px', background: 'var(--bg-primary)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer'
                    }}>
                    {(ctrl.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
                {isToggle && (
                  <label onClick={() => onParamChange(ctrl.label, val === false || val === undefined ? true : false)}
                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '38px', height: '20px', background: val !== false ? colors.accent : '#ddd',
                      borderRadius: '10px', position: 'relative', transition: 'background 0.2s', display: 'inline-block'
                    }}>
                      <span style={{
                        width: '16px', height: '16px', background: '#fff', borderRadius: '50%',
                        position: 'absolute', top: '2px', left: val !== false ? '20px' : '2px', transition: 'left 0.2s'
                      }} />
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{val !== false ? '已启用' : '未启用'}</span>
                  </label>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '14px', fontWeight: '500' }}>
          实时数据
        </div>
        <div style={{
          background: 'var(--bg-primary)',
          border: `1px solid ${colors.accent}20`,
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {kaiwu.displayParams.map((param, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{param.label}</span>
              <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: '500' }}>
                {displayValues[param.key] !== undefined ? String(displayValues[param.key]) : '--'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   鲁班问答
   ═══════════════════════════════════════════════════════════ */
function WendaPanel({ caseData }) {
  const { wenda } = caseData
  const colors = subjectColors[caseData.id] || subjectColors['electrolysis']
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)

  const q = wenda[currentQ]
  const isCorrect = selected && selected.startsWith(q.answer)

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

  return (
    <div style={{ padding: '28px', height: '100%', overflowY: 'auto' }}>
      {/* 进度条 */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
        {wenda.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '3px', borderRadius: '2px',
            background: i < currentQ ? colors.accent
              : i === currentQ ? (answered ? (isCorrect ? colors.accent : '#C45C48') : 'var(--border)')
                : 'var(--border)',
            transition: 'background 0.3s'
          }} />
        ))}
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
        第 {currentQ + 1} / {wenda.length} 题
      </div>

      <div style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '24px', lineHeight: 1.7, fontWeight: '500' }}>
        {q.question}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {q.options.map((opt, i) => {
          const isSel = selected === opt
          const isCorrectOpt = opt.startsWith(q.answer)
          let bg = 'var(--bg-primary)'
          let border = 'var(--border)'
          let color = 'var(--text-primary)'

          if (answered) {
            if (isCorrectOpt) { bg = colors.bg; border = colors.accent + '50'; color = colors.accent }
            else if (isSel && !isCorrectOpt) { bg = '#FDE8E8'; border = '#C45C4850'; color = '#C45C48' }
          } else if (isSel) {
            bg = colors.bg; border = colors.accent + '40'
          }

          return (
            <button key={i} onClick={() => handleSelect(opt)} disabled={answered}
              style={{
                padding: '14px 18px', background: bg, border: `1px solid ${border}`,
                borderRadius: 'var(--radius-sm)', color, fontSize: '14px', textAlign: 'left',
                cursor: answered ? 'default' : 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}
              onMouseEnter={e => { if (!answered) { e.currentTarget.style.borderColor = colors.accent + '40'; e.currentTarget.style.background = colors.bg } }}
              onMouseLeave={e => { if (!answered && !isSel) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-primary)' } }}
            >
              <span style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: answered && isCorrectOpt ? colors.accent : answered && isSel && !isCorrectOpt ? '#C45C48' : 'transparent',
                border: answered && isCorrectOpt ? `1px solid ${colors.accent}` : answered && isSel && !isCorrectOpt ? '1px solid #C45C48' : '1px solid var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '600', flexShrink: 0,
                color: answered && (isCorrectOpt || (isSel && !isCorrectOpt)) ? '#fff' : 'var(--text-muted)'
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
          background: isCorrect ? colors.bg : '#FDE8E8',
          border: `1px solid ${isCorrect ? colors.accent + '30' : '#C45C4830'}`,
          borderRadius: 'var(--radius-sm)', padding: '18px', marginBottom: '20px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: isCorrect ? colors.accent : '#C45C48', marginBottom: '8px' }}>
            {isCorrect ? '回答正确' : '回答错误'}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {q.explanation}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        {currentQ < wenda.length - 1 && answered && (
          <button onClick={nextQ} style={{
            flex: 1, padding: '12px', background: colors.accent, border: 'none',
            borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '14px',
            fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >下一题</button>
        )}
        {currentQ === wenda.length - 1 && answered && (
          <button onClick={reset} style={{
            flex: 1, padding: '12px', background: 'var(--bg-primary)', border: `1px solid ${colors.accent}40`,
            borderRadius: 'var(--radius-sm)', color: colors.accent, fontSize: '14px',
            fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = colors.bg }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-primary)' }}
          >重新开始</button>
        )}
      </div>
    </div>
  )
}

function VisualizationComponent({ caseId, simParams, isFullscreen, vizActions }) {
  const commonProps = { params: simParams }
  switch (caseId) {
    case 'wave-interference': return <WaveInterferenceVisualization {...commonProps} />
    case 'solar-system': return <SolarSystemVisualization {...commonProps} actions={vizActions || {}} />
    case 'electrolysis': return <ElectrolysisVisualization {...commonProps} actions={vizActions || {}} />
    case 'trigonometry': return <TrigonometryVisualization {...commonProps} />
    default: return <WaveInterferenceVisualization {...commonProps} />
  }
}

export default function CasePage({ caseId, onBack }) {
  const caseData = getCaseById(caseId)
  const [panelState, setPanelState] = useState({ tab: 'xinfa', open: false })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)
  const vizActions = useRef({})
  const colors = subjectColors[caseId] || subjectColors['electrolysis']

  const getInitialParams = (id) => {
    switch (id) {
      case 'wave-interference': return { '波长': 1.5, '双缝间距': 4, '屏幕距离': 10, '显示加强区': true, '显示相消区': true }
      case 'solar-system': return { '太阳质量': 1, '初始速度': 1, '引力强度': 1, '显示轨道': true, '速度矢量': false }
      case 'electrolysis': return { '电压': 6, '电解质浓度': 15, '电解质类型': 'Na₂SO₄(中性)', '显示分子式': true, '显示电子流向': false }
      case 'trigonometry': return { '角度θ': 45, '振幅A': 1, '频率ω': 1, '相位φ': 0, '正弦': true, '余弦': true, '正切': false }
      default: return {}
    }
  }

  const [simParams, setSimParams] = useState(() => getInitialParams(caseId))

  const getInitialDisplayValues = (id) => {
    switch (id) {
      case 'wave-interference': return { fringeSpacing: '0.75 px', maxOrder: '5', constructiveCount: '6', destructiveCount: '5' }
      case 'solar-system': return { orbitalPeriod: '125.6s', orbitalSpeed: '5.0', eccentricity: '0.00', energy: '-0.5 J' }
      case 'electrolysis': return { h2Volume: '0.0 mL', o2Volume: '0.0 mL', ratio: '--', current: '0.00 A' }
      case 'trigonometry': return { sinValue: '0.707', cosValue: '0.707', tanValue: '1.000', unitCirclePoint: '(0.71, 0.71)' }
      default: return {}
    }
  }

  const [displayValues, setDisplayValues] = useState(() => getInitialDisplayValues(caseId))

  const handleParamChange = useCallback((label, value) => {
    setSimParams(prev => ({ ...prev, [label]: value }))
    if (caseId === 'wave-interference') {
      const wl = label === '波长' ? value : simParams['波长']
      const sd = label === '双缝间距' ? value : simParams['双缝间距']
      const sc = label === '屏幕距离' ? value : simParams['屏幕距离']
      const fs = (wl * sc / sd * 2).toFixed(2)
      const mo = Math.floor(sd / wl * 2)
      setDisplayValues({ fringeSpacing: `${fs} px`, maxOrder: String(mo), constructiveCount: String(mo + 1), destructiveCount: String(mo) })
    }
    if (caseId === 'trigonometry') {
      const angle = label === '角度θ' ? value : simParams['角度θ']
      const rad = (angle * Math.PI) / 180
      setDisplayValues({ sinValue: Math.sin(rad).toFixed(3), cosValue: Math.cos(rad).toFixed(3), tanValue: Math.tan(rad).toFixed(3), unitCirclePoint: `(${Math.cos(rad).toFixed(2)}, ${Math.sin(rad).toFixed(2)})` })
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

  const handleTabClick = useCallback((tabId) => {
    setPanelState(prev => prev.tab === tabId && prev.open ? { ...prev, open: false } : { tab: tabId, open: true })
  }, [])

  const closePanel = useCallback(() => setPanelState(prev => ({ ...prev, open: false })), [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  if (!caseData) return null
  const { tab: activeTab, open: panelOpen } = panelState

  return (
    <div ref={containerRef} style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden'
    }}>
      {/* 顶部导航 */}
      {!isFullscreen && (
        <header style={{
          padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid var(--border)', background: 'var(--bg-card)',
          flexShrink: 0, position: 'relative', zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={onBack} style={{
              background: 'transparent', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '14px', padding: '6px 10px', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
            >
              <ArrowLeft size={18} /> 返回
            </button>
            <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
            <h1 style={{
              fontSize: '17px', fontFamily: 'var(--font-display)', fontWeight: '600',
              color: 'var(--text-primary)', letterSpacing: '0.04em'
            }}>
              {caseData.title}
            </h1>
            <span style={{
              fontSize: '11px', color: colors.accent, background: colors.bg,
              padding: '3px 10px', borderRadius: '12px', fontWeight: '500'
            }}>
              {colors.text}
            </span>
          </div>

          <button onClick={toggleFullscreen} style={{
            background: 'var(--bg-primary)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: '6px', cursor: 'pointer',
            color: 'var(--text-secondary)', display: 'flex', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = colors.accent + '40'; e.currentTarget.style.color = colors.accent }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </header>
      )}

      {/* 主内容 */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* 可视化区 */}
        <div style={{
          width: panelOpen ? '65%' : '100%', transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
          flexShrink: 0, position: 'relative', background: 'var(--bg-secondary)', zIndex: 1, overflow: 'hidden'
        }}>
          <VisualizationComponent caseId={caseId} simParams={simParams} isFullscreen={isFullscreen} vizActions={vizActions.current} />
          {isFullscreen && (
            <button onClick={toggleFullscreen} style={{
              position: 'absolute', bottom: '20px', right: '20px', padding: '8px 16px',
              background: 'rgba(255,255,255,0.9)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
              fontSize: '13px', cursor: 'pointer', backdropFilter: 'blur(8px)'
            }}>
              ESC 退出全屏
            </button>
          )}
        </div>

        {/* 面板 */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '35%', height: '100%',
          background: 'var(--bg-card)', borderLeft: '1px solid var(--border)',
          transform: panelOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 10, boxShadow: panelOpen ? '-8px 0 40px rgba(0,0,0,0.06)' : 'none',
          display: 'flex', flexDirection: 'column'
        }}>
          {/* 面板头部 */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0
          }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {TABS.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button key={tab.id} onClick={() => handleTabClick(tab.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px',
                    background: isActive ? colors.bg : 'transparent',
                    border: isActive ? `1px solid ${colors.accent}25` : '1px solid transparent',
                    borderRadius: 'var(--radius-sm)', color: isActive ? colors.accent : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s'
                  }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
                  >
                    <Icon size={14} /> {tab.label}
                  </button>
                )
              })}
            </div>
            <button onClick={closePanel} style={{
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', padding: '4px', display: 'flex'
            }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            {activeTab === 'xinfa' && <XinfaPanel caseData={caseData} />}
            {activeTab === 'kaiwu' && (
              <KaiwuPanel caseData={caseData} simParams={simParams} onParamChange={handleParamChange}
                displayValues={displayValues} vizActions={vizActions.current} />
            )}
            {activeTab === 'wenda' && <WendaPanel caseData={caseData} />}
          </div>
        </div>
      </div>

      {/* 底部标签 */}
      {!isFullscreen && (
        <div style={{
          padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)',
          display: 'flex', justifyContent: 'center', gap: '8px', flexShrink: 0, position: 'relative', zIndex: 100
        }}>
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id && panelOpen
            return (
              <button key={tab.id} onClick={() => handleTabClick(tab.id)} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px',
                background: isActive ? colors.bg : 'var(--bg-primary)',
                border: isActive ? `1px solid ${colors.accent}30` : '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', color: isActive ? colors.accent : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = colors.accent + '30'; e.currentTarget.style.color = colors.accent }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
