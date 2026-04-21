import { useState, useRef, useEffect, useCallback } from 'react'
import { getCaseById } from '../../data/cases.js'
import WaveInterferenceVisualization from '../visualizations/WaveInterferenceVisualization.jsx'
import SolarSystemVisualization from '../visualizations/SolarSystemVisualization.jsx'
import ElectrolysisVisualization from '../visualizations/ElectrolysisVisualization.jsx'
import TrigonometryVisualization from '../visualizations/TrigonometryVisualization.jsx'
import '../../styles/theme.css'

const TABS = [
  { id: 'xinfa', label: '心法', labelEn: 'THEORY' },
  { id: 'kaiwu', label: '开物', labelEn: 'LAB' },
  { id: 'wenda', label: '问答', labelEn: 'QUIZ' }
]

const subjectColors = {
  'wave-interference': { accent: '#5BA8E8', name: '物理 · 光学' },
  'solar-system':      { accent: '#D4A056', name: '天文 · 动力学' },
  'electrolysis':      { accent: '#50C878', name: '化学 · 电化学' },
  'trigonometry':      { accent: '#B088D4', name: '数学 · 三角学' }
}

const visComponents = {
  'wave-interference': WaveInterferenceVisualization,
  'solar-system':      SolarSystemVisualization,
  'electrolysis':      ElectrolysisVisualization,
  'trigonometry':      TrigonometryVisualization,
}

/* ── 图标 ── */
const Icons = {
  arrowLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  maximize: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
    </svg>
  ),
  minimize: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/>
    </svg>
  ),
  book: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  sliders: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>
    </svg>
  ),
  help: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  x: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  lightbulb: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6v2h8v-2c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z"/>
    </svg>
  ),
}

/* ============================================================
   滚动显现 Hook
   ============================================================ */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, revealed]
}

/* ============================================================
   心法面板
   ============================================================ */
function XinfaPanel({ caseData }) {
  const { xinfa } = caseData
  const colors = subjectColors[caseData.id]
  const [ref, revealed] = useReveal(0.1)

  return (
    <div ref={ref} style={{ padding: 28, height: '100%', overflowY: 'auto' }}>
      {/* 理论公式卡片 */}
      <div className={`reveal ${revealed ? 'revealed' : ''}`} style={{
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-md)',
        padding: 24,
        marginBottom: 28,
        border: '1px solid var(--border-subtle)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: -1, left: 24, right: 24, height: 2,
          background: colors.accent, opacity: 0.5,
        }}/>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: colors.accent,
          letterSpacing: '0.15em',
          marginBottom: 12,
          textTransform: 'uppercase',
        }}>
          核心理论 // CORE THEORY
        </div>
        <div style={{
          fontSize: '1.1rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary)',
          fontWeight: 500,
          lineHeight: 1.5,
        }}>
          {xinfa.theory}
        </div>
      </div>

      {/* 鲁班视角 */}
      <div className={`reveal stagger-1 ${revealed ? 'revealed' : ''}`} style={{
        background: 'linear-gradient(135deg, rgba(201,169,110,0.06) 0%, transparent 100%)',
        borderLeft: `2px solid ${colors.accent}50`,
        padding: '20px 24px',
        marginBottom: 28,
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--accent)',
          letterSpacing: '0.15em',
          marginBottom: 10,
        }}>
          鲁班视角 // MASTER&apos;S VIEW
        </div>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.8,
          fontStyle: 'italic',
        }}>
          {xinfa.luBanView}
        </p>
      </div>

      {/* 应用场景 */}
      <div className={`reveal stagger-2 ${revealed ? 'revealed' : ''}`}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
          marginBottom: 16,
          textTransform: 'uppercase',
        }}>
          现实应用 // REAL WORLD SCENARIOS
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {xinfa.scenarios.map((s, i) => (
            <div key={i} style={{
              padding: '14px 18px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.3s',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${colors.accent}40`
              e.currentTarget.style.background = 'var(--bg-elevated)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
              e.currentTarget.style.background = 'var(--bg-card)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 4,
              }}>
                <div style={{
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: colors.accent,
                  opacity: 0.7,
                  flexShrink: 0,
                }}/>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>{s.name}</span>
              </div>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                paddingLeft: 16,
              }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   开物面板
   ============================================================ */
function KaiwuPanel({ caseData, panelWidth }) {
  const { kaiwu } = caseData
  const colors = subjectColors[caseData.id]
  const [params, setParams] = useState(() => {
    const p = {}
    kaiwu.controls.forEach(c => {
      if (c.type === 'slider') p[c.label] = c.default
      if (c.type === 'toggle') p[c.label] = c.default
      if (c.type === 'select') p[c.label] = c.default
    })
    return p
  })

  const update = (label, val) => setParams(prev => ({ ...prev, [label]: val }))

  return (
    <div style={{ padding: 28, height: '100%', overflowY: 'auto' }}>
      {/* 控件区 */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
          marginBottom: 16,
          textTransform: 'uppercase',
        }}>
          实验参数 // PARAMETERS
        </div>
        <div style={{ display: 'grid', gap: 18 }}>
          {kaiwu.controls.map((c, i) => (
            <div key={i}>
              {c.type === 'slider' && (
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                    <span style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 500,
                    }}>{c.label}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: colors.accent,
                      fontWeight: 600,
                      padding: '2px 8px',
                      background: `${colors.accent}15`,
                      borderRadius: 4,
                    }}>
                      {params[c.label]}{c.unit || ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={c.min}
                    max={c.max}
                    step={c.step}
                    value={params[c.label]}
                    onChange={e => update(c.label, parseFloat(e.target.value))}
                    style={{ accentColor: colors.accent }}
                  />
                </div>
              )}
              {c.type === 'toggle' && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                }}>
                  <span style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                  }}>{c.label}</span>
                  <div
                    className={`toggle-switch ${params[c.label] ? 'on' : ''}`}
                    onClick={() => update(c.label, !params[c.label])}
                    style={params[c.label] ? { background: colors.accent } : {}}
                  />
                </div>
              )}
              {c.type === 'select' && (
                <div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    marginBottom: 8,
                  }}>{c.label}</div>
                  <select
                    value={params[c.label]}
                    onChange={e => update(c.label, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-display)',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {c.options.map(o => (
                      <option key={o} value={o} style={{ background: 'var(--bg-elevated)' }}>{o}</option>
                    ))}
                  </select>
                </div>
              )}
              {c.type === 'button' && (
                <div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    marginBottom: 10,
                  }}>{c.label}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {c.options.map((opt, j) => (
                      <button key={j} style={{
                        padding: '8px 16px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontFamily: 'var(--font-display)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = colors.accent
                        e.target.style.color = 'var(--text-primary)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = 'var(--border-subtle)'
                        e.target.style.color = 'var(--text-secondary)'
                      }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 分割线 */}
      <div className="line-divider" style={{ marginBottom: 28 }}/>

      {/* 数据面板 */}
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
          marginBottom: 16,
          textTransform: 'uppercase',
        }}>
          实时数据 // REALTIME DATA
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: panelWidth > 320 ? '1fr 1fr' : '1fr',
          gap: 10,
        }}>
          {kaiwu.displayParams.map((dp, i) => (
            <div key={i} className="metric-card">
              <div className="metric-value" style={{ color: colors.accent }}>--</div>
              <div className="metric-label">{dp.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   问答面板
   ============================================================ */
function WendaPanel({ caseData }) {
  const { wenda } = caseData
  const colors = subjectColors[caseData.id]
  const [answers, setAnswers] = useState({})
  const [showExp, setShowExp] = useState({})

  const answer = (qid, opt) => {
    if (answers[qid]) return
    setAnswers(prev => ({ ...prev, [qid]: opt }))
    setShowExp(prev => ({ ...prev, [qid]: true }))
  }

  return (
    <div style={{ padding: 28, height: '100%', overflowY: 'auto' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.15em',
        marginBottom: 24,
        textTransform: 'uppercase',
      }}>
        知识检验 // KNOWLEDGE CHECK
      </div>

      <div style={{ display: 'grid', gap: 28 }}>
        {wenda.map((q, qi) => {
          const ans = answers[q.id]
          const show = showExp[q.id]
          const isCorrect = ans === q.answer
          return (
            <div key={q.id} style={{
              padding: '20px 24px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.3s',
            }}>
              {/* 题号 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 14,
              }}>
                <div style={{
                  width: 24, height: 24,
                  borderRadius: '50%',
                  background: ans
                    ? (isCorrect ? `${colors.accent}20` : 'rgba(199,80,80,0.15)')
                    : 'var(--bg-elevated)',
                  border: `1px solid ${ans
                    ? (isCorrect ? colors.accent : 'var(--cinnabar)')
                    : 'var(--border-subtle)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: ans
                    ? (isCorrect ? colors.accent : 'var(--cinnabar)')
                    : 'var(--text-muted)',
                  fontWeight: 600,
                }}>
                  {ans ? (isCorrect ? <Icons.check/> : <Icons.x/>) : (qi + 1)}
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                }}>Q{qi + 1}</span>
              </div>

              {/* 问题 */}
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                fontWeight: 500,
                lineHeight: 1.6,
                marginBottom: 16,
              }}>{q.question}</div>

              {/* 选项 */}
              <div style={{ display: 'grid', gap: 8 }}>
                {q.options.map((opt, oi) => {
                  const selected = ans === opt[0]
                  const isOptCorrect = opt[0] === q.answer
                  let optClass = ''
                  if (ans) {
                    if (isOptCorrect) optClass = 'correct'
                    else if (selected) optClass = 'wrong'
                  }
                  return (
                    <button
                      key={oi}
                      className={`quiz-option ${optClass}`}
                      onClick={() => answer(q.id, opt[0])}
                      disabled={!!ans}
                      style={{
                        opacity: ans && !isOptCorrect && !selected ? 0.5 : 1,
                        cursor: ans ? 'default' : 'pointer',
                        borderColor: selected
                          ? (isCorrect ? colors.accent : 'var(--cinnabar)')
                          : isOptCorrect && ans
                            ? colors.accent
                            : 'var(--border-subtle)',
                        background: selected
                          ? (isCorrect ? `${colors.accent}12` : 'rgba(199,80,80,0.1)')
                          : isOptCorrect && ans
                            ? `${colors.accent}08`
                            : 'var(--bg-card)',
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: selected
                          ? (isCorrect ? colors.accent : 'var(--cinnabar)')
                          : 'var(--text-muted)',
                        marginRight: 10,
                        fontWeight: 600,
                      }}>{opt[0]}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {opt.slice(3)}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* 解析 */}
              {show && (
                <div style={{
                  marginTop: 14,
                  padding: '14px 16px',
                  background: isCorrect ? `${colors.accent}08` : 'rgba(199,80,80,0.06)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: `2px solid ${isCorrect ? colors.accent : 'var(--cinnabar)'}`,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    color: isCorrect ? colors.accent : 'var(--cinnabar)',
                    marginTop: 2,
                    flexShrink: 0,
                  }}><Icons.lightbulb/></div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}>{q.explanation}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ============================================================
   主页面
   ============================================================ */
export default function CasePage({ caseId, onBack }) {
  const [activeTab, setActiveTab] = useState('xinfa')
  const [panelOpen, setPanelOpen] = useState(true)
  const [panelWidth, setPanelWidth] = useState(380)
  const [isDragging, setIsDragging] = useState(false)
  const caseData = getCaseById(caseId)
  const colors = subjectColors[caseId] || subjectColors['electrolysis']
  const VisComp = visComponents[caseId]

  const togglePanel = useCallback(() => setPanelOpen(p => !p), [])

  /* 拖拽调整面板宽度 */
  const onDragStart = useCallback(() => setIsDragging(true), [])
  useEffect(() => {
    if (!isDragging) return
    const onMove = (e) => {
      const w = window.innerWidth - e.clientX
      setPanelWidth(Math.max(280, Math.min(500, w)))
    }
    const onUp = () => setIsDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging])

  if (!caseData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
      }}>
        案例未找到
      </div>
    )
  }

  const tabIcons = { xinfa: Icons.book, kaiwu: Icons.sliders, wenda: Icons.help }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── 顶部栏 ── */}
      <header className="glass-strong" style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.85rem',
            transition: 'color 0.2s',
            fontFamily: 'var(--font-display)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.background = 'transparent'
          }}>
            <Icons.arrowLeft/> 返回
          </button>

          <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }}/>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: colors.accent,
              boxShadow: `0 0 8px ${colors.accent}60`,
            }}/>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}>{caseData.title}</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: colors.accent,
              opacity: 0.7,
              letterSpacing: '0.1em',
              padding: '2px 8px',
              background: `${colors.accent}12`,
              borderRadius: 4,
            }}>{colors.name}</span>
          </div>
        </div>

        {/* 标签切换 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(255,255,255,0.03)',
          padding: 4,
          borderRadius: 'var(--radius-sm)',
        }}>
          {TABS.map(tab => {
            const Icon = tabIcons[tab.id]
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={isActive ? {
                  color: colors.accent,
                  background: `${colors.accent}15`,
                  borderColor: `${colors.accent}30`,
                } : {}}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon/> {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* 全屏/面板切换 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={togglePanel} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 'var(--radius-sm)',
            transition: 'all 0.2s',
            display: 'flex',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.background = 'transparent'
          }}>
            {panelOpen ? <Icons.minimize/> : <Icons.maximize/>}
          </button>
        </div>
      </header>

      {/* ── 主内容区 ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* 可视化区 */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* 工程标注覆盖 */}
          <div style={{
            position: 'absolute',
            top: 12, left: 12,
            zIndex: 10,
            pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              background: 'rgba(10,10,15,0.7)',
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid var(--border-subtle)',
            }}>
              VISUALIZATION // {caseData.id.toUpperCase().replace(/-/g, '_')}
            </div>
          </div>

          {/* 坐标标注 */}
          <div style={{
            position: 'absolute',
            bottom: 12, right: 12,
            zIndex: 10,
            pointerEvents: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            color: 'var(--text-muted)',
            textAlign: 'right',
            letterSpacing: '0.1em',
          }}>
            <div>X: REALTIME</div>
            <div>Y: INTERACTIVE</div>
            <div style={{ color: colors.accent, opacity: 0.6 }}>RENDER: CANVAS_2D</div>
          </div>

          {VisComp && <VisComp />}
        </div>

        {/* 拖拽条 */}
        {panelOpen && (
          <div
            onMouseDown={onDragStart}
            style={{
              width: 4,
              cursor: 'col-resize',
              background: isDragging ? colors.accent : 'var(--border-subtle)',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          />
        )}

        {/* 右侧面板 */}
        <div style={{
          width: panelOpen ? panelWidth : 0,
          minWidth: panelOpen ? panelWidth : 0,
          background: 'var(--bg-secondary)',
          borderLeft: panelOpen ? '1px solid var(--border-subtle)' : 'none',
          overflow: 'hidden',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* 面板头部 */}
          {panelOpen && (
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 2,
                }}>
                  {TABS.find(t => t.id === activeTab)?.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                }}>
                  {TABS.find(t => t.id === activeTab)?.labelEn}
                </div>
              </div>
              <div style={{
                width: 28, height: 28,
                border: `1px solid ${colors.accent}30`,
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.accent,
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  fontWeight: 600,
                }}>{caseData.title.charAt(0)}</span>
              </div>
            </div>
          )}

          {/* 面板内容 */}
          {panelOpen && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {activeTab === 'xinfa' && <XinfaPanel caseData={caseData} />}
              {activeTab === 'kaiwu' && <KaiwuPanel caseData={caseData} panelWidth={panelWidth} />}
              {activeTab === 'wenda' && <WendaPanel caseData={caseData} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
