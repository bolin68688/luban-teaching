import { useState, useEffect, useRef } from 'react'
import {
  Waves, Zap, Triangle, Sun, ArrowRight,
  Github, Sparkles, ChevronDown, Compass
} from 'lucide-react'
import { cases } from '../../data/cases.js'

const iconMap = {
  waves: Waves,
  sun: Sun,
  bolt: Zap,
  triangle: Triangle
}

const subjectColors = {
  'wave-interference': { bg: '#EBF4FA', accent: '#3B6E8F', icon: '#3B6E8F' },
  'solar-system': { bg: '#FDF3E7', accent: '#B07D4A', icon: '#B07D4A' },
  'electrolysis': { bg: '#E8F5EE', accent: '#2D8B6B', icon: '#2D8B6B' },
  'trigonometry': { bg: '#F0EBF5', accent: '#6B4F8C', icon: '#6B4F8C' }
}

/* ═══════════════════════════════════════════════════════════
   旋转几何装饰
   ═══════════════════════════════════════════════════════════ */
function RotatingGeometry() {
  return (
    <svg width="320" height="320" viewBox="0 0 200 200" style={{ opacity: 0.12 }}>
      <defs>
        <linearGradient id="geoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A2F" />
          <stop offset="100%" stopColor="#3D7A62" />
        </linearGradient>
      </defs>
      <g style={{ animation: 'rotateSlow 60s linear infinite', transformOrigin: '100px 100px' }}>
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#geoGrad)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="55" fill="none" stroke="url(#geoGrad)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="30" fill="none" stroke="url(#geoGrad)" strokeWidth="0.5" />
        <polygon points="100,30 170,140 30,140" fill="none" stroke="url(#geoGrad)" strokeWidth="0.5" />
        <polygon points="100,170 30,60 170,60" fill="none" stroke="url(#geoGrad)" strokeWidth="0.5" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="url(#geoGrad)" strokeWidth="0.3" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="url(#geoGrad)" strokeWidth="0.3" />
        <line x1="43" y1="43" x2="157" y2="157" stroke="url(#geoGrad)" strokeWidth="0.3" />
        <line x1="157" y1="43" x2="43" y2="157" stroke="url(#geoGrad)" strokeWidth="0.3" />
      </g>
      <g style={{ animation: 'rotateSlow 40s linear infinite reverse', transformOrigin: '100px 100px' }}>
        <circle cx="100" cy="100" r="68" fill="none" stroke="url(#geoGrad)" strokeWidth="0.3" strokeDasharray="4 4" />
      </g>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════
   细线分隔
   ═══════════════════════════════════════════════════════════ */
function ThinLine({ delay = 0 }) {
  return (
    <div style={{
      width: '60px',
      height: '1px',
      background: 'var(--accent)',
      opacity: 0.3,
      animation: `drawLine 1.2s var(--ease-out) ${delay}s forwards`,
      transformOrigin: 'left'
    }} />
  )
}

/* ═══════════════════════════════════════════════════════════
   案例大卡片 — 左右交替布局
   ═══════════════════════════════════════════════════════════ */
function BigCaseCard({ caseData, onClick, index }) {
  const Icon = iconMap[caseData.icon] || Waves
  const colors = subjectColors[caseData.id] || subjectColors['electrolysis']
  const isEven = index % 2 === 0

  return (
    <div
      className="animate-slide-up"
      style={{
        animationDelay: `${index * 0.15}s`,
        display: 'grid',
        gridTemplateColumns: isEven ? '1fr 1.2fr' : '1.2fr 1fr',
        gap: 0,
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        transition: 'all 0.5s var(--ease-out)',
        cursor: 'pointer',
        minHeight: '380px'
      }}
      onClick={() => onClick(caseData.id)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}
    >
      {/* 左侧/右侧色块区域 */}
      <div style={{
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        gap: '20px',
        order: isEven ? 1 : 2
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <Icon size={36} color={colors.icon} />
        </div>
        <div style={{
          fontSize: '13px',
          fontWeight: '500',
          color: colors.accent,
          letterSpacing: '0.1em',
          padding: '4px 14px',
          background: 'rgba(255,255,255,0.6)',
          borderRadius: '20px'
        }}>
          {caseData.subject}
        </div>
      </div>

      {/* 文字区域 */}
      <div style={{
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '20px',
        order: isEven ? 2 : 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.1em'
          }}>
            0{index + 1}
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{caseData.grade}</span>
        </div>

        <h3 style={{
          fontSize: 'clamp(24px, 3vw, 32px)',
          fontFamily: 'var(--font-display)',
          fontWeight: '600',
          color: 'var(--text-primary)',
          letterSpacing: '0.06em',
          lineHeight: 1.3
        }}>
          {caseData.title}
        </h3>

        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          lineHeight: 1.8,
          maxWidth: '360px'
        }}>
          {caseData.description}
        </p>

        <div style={{
          fontSize: '14px',
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          color: colors.accent,
          opacity: 0.7,
          lineHeight: 1.7,
          paddingLeft: '16px',
          borderLeft: `2px solid ${colors.accent}30`
        }}>
          "{caseData.tagline}"
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '8px',
          color: colors.accent,
          fontSize: '14px',
          fontWeight: '500',
          transition: 'gap 0.3s'
        }} className="case-arrow">
          开始探索 <ArrowRight size={16} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   主页
   ═══════════════════════════════════════════════════════════ */
export default function HomePage({ onOpenCase, onOpenDynamic }) {
  const [topicInput, setTopicInput] = useState('')
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style>{`
        .case-arrow { transition: gap 0.3s; }
        .big-case-card:hover .case-arrow { gap: 14px !important; }
      `}</style>

      {/* ═══════════════════ 极简导航 ═══════════════════ */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        transition: 'all 0.4s var(--ease-smooth)',
        background: scrollY > 50 ? 'rgba(247,245,240,0.9)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(12px)' : 'none'
      }}>
        <div style={{
          fontSize: '16px',
          fontFamily: 'var(--font-display)',
          fontWeight: '600',
          color: 'var(--accent)',
          letterSpacing: '0.12em'
        }}>
          鲁班开物
        </div>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <a href="#cases" style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            letterSpacing: '0.06em',
            transition: 'color 0.3s'
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            探索
          </a>
          <a href="#about" style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            letterSpacing: '0.06em',
            transition: 'color 0.3s'
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            关于
          </a>
          <a href="https://github.com/bolin68688/luban-teaching" target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Github size={14} />
          </a>
        </div>
      </nav>

      {/* ═══════════════════ Hero ═══════════════════ */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '120px 40px 80px',
        overflow: 'hidden'
      }}>
        {/* 背景几何 */}
        <div style={{
          position: 'absolute',
          right: '-40px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}>
          <RotatingGeometry />
        </div>

        {/* 左侧小竖线装饰 */}
        <div style={{
          position: 'absolute',
          left: '40px',
          top: '30%',
          width: '1px',
          height: '120px',
          background: 'linear-gradient(180deg, transparent, var(--accent-pale), transparent)'
        }} />

        <div style={{
          maxWidth: '720px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <div className="animate-fade-in" style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            letterSpacing: '0.3em',
            marginBottom: '32px',
            fontWeight: '500'
          }}>
            K12 理科可视化教学
          </div>

          <h1 className="animate-slide-up" style={{
            fontSize: 'clamp(48px, 10vw, 96px)',
            fontFamily: 'var(--font-display)',
            fontWeight: '400',
            lineHeight: 1.1,
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            marginBottom: '8px'
          }}>
            以器载道
          </h1>
          <h1 className="animate-slide-up" style={{
            fontSize: 'clamp(48px, 10vw, 96px)',
            fontFamily: 'var(--font-display)',
            fontWeight: '400',
            lineHeight: 1.1,
            letterSpacing: '0.08em',
            color: 'var(--text-primary)',
            marginBottom: '40px',
            animationDelay: '0.15s'
          }}>
            以物明理
          </h1>

          <ThinLine delay={0.5} style={{ margin: '0 auto 32px' }} />

          <p className="animate-slide-up" style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            lineHeight: 2,
            maxWidth: '440px',
            margin: '0 auto 48px',
            letterSpacing: '0.04em',
            animationDelay: '0.3s'
          }}>
            萃取春秋末期顶尖工匠鲁班的科学思想
            <br />
            让物理、化学、数学、天文知识
            <br />
            看得见、摸得着、用得上
          </p>

          <div className="animate-slide-up" style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            animationDelay: '0.45s'
          }}>
            <button
              onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '14px 36px',
                background: 'var(--accent)',
                color: 'var(--text-light)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.3s var(--ease-out)',
                fontFamily: 'var(--font-sans)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--accent-light)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--accent)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              探索案例
            </button>
            <button
              onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '14px 36px',
                background: 'transparent',
                color: 'var(--accent)',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.3s var(--ease-out)',
                fontFamily: 'var(--font-sans)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--accent-glow)'
                e.currentTarget.style.borderColor = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'var(--border-accent)'
              }}
            >
              自由开物
            </button>
          </div>
        </div>

        {/* 底部滚动提示 */}
        <div className="animate-float" style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.3
        }}>
          <ChevronDown size={20} color="var(--accent)" />
        </div>
      </section>

      {/* ═══════════════════ 理念引言 ═══════════════════ */}
      <section id="about" style={{
        background: 'var(--accent)',
        padding: '100px 40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 背景装饰圆 */}
        <div style={{
          position: 'absolute',
          right: '-100px',
          top: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)'
        }} />
        <div style={{
          position: 'absolute',
          left: '-60px',
          bottom: '-60px',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)'
        }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="animate-slide-up">
            <Compass size={28} color="rgba(255,255,255,0.3)" style={{ marginBottom: '24px' }} />
          </div>
          <h2 className="animate-slide-up" style={{
            fontSize: 'clamp(22px, 4vw, 34px)',
            fontFamily: 'var(--font-display)',
            fontWeight: '400',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.8,
            letterSpacing: '0.08em',
            marginBottom: '20px',
            animationDelay: '0.1s'
          }}>
            "工欲善其事，必先利其器"
          </h2>
          <p className="animate-slide-up" style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.15em',
            marginBottom: '32px',
            animationDelay: '0.2s'
          }}>
            —— 《论语 · 卫灵公》
          </p>
          <p className="animate-slide-up" style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 2,
            maxWidth: '520px',
            margin: '0 auto',
            animationDelay: '0.3s'
          }}>
            每一个抽象的知识点，都值得被赋予一把"器"
            <br />
            让物理的光波触手可及，让化学的反应一目了然
          </p>
        </div>
      </section>

      {/* ═══════════════════ 案例展示 ═══════════════════ */}
      <section id="cases" style={{
        padding: '120px 40px',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* 标题区 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '64px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div className="animate-slide-up" style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                letterSpacing: '0.2em',
                marginBottom: '12px',
                fontWeight: '500'
              }}>
                精选案例
              </div>
              <h2 className="animate-slide-up" style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontFamily: 'var(--font-display)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                letterSpacing: '0.06em',
                lineHeight: 1.2,
                animationDelay: '0.1s'
              }}>
                四大领域
                <br />
                <span style={{ color: 'var(--accent)' }}>等你探索</span>
              </h2>
            </div>
            <p className="animate-slide-up" style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              maxWidth: '280px',
              animationDelay: '0.2s'
            }}>
              从波的干涉到太阳系运行，从电解水到三角函数，每一个案例都是精心设计的交互体验
            </p>
          </div>

          {/* 大卡片列表 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {cases.map((c, i) => (
              <BigCaseCard key={c.id} caseData={c} onClick={onOpenCase} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 自由探索 ═══════════════════ */}
      <section id="explore" style={{
        padding: '120px 40px',
        background: 'var(--bg-primary)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '640px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div className="animate-slide-up">
            <Sparkles size={24} color="var(--accent-pale)" style={{ marginBottom: '20px' }} />
          </div>
          <h2 className="animate-slide-up" style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontFamily: 'var(--font-display)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            letterSpacing: '0.06em',
            marginBottom: '16px',
            animationDelay: '0.1s'
          }}>
            探索任意知识点
          </h2>
          <p className="animate-slide-up" style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            lineHeight: 1.8,
            animationDelay: '0.2s'
          }}>
            输入你想学习的知识点，AI 将为你生成专属的可视化教学
          </p>

          <div className="animate-slide-up" style={{
            display: 'flex',
            gap: '12px',
            maxWidth: '480px',
            margin: '0 auto',
            animationDelay: '0.3s'
          }}>
            <input
              type="text"
              placeholder="例如：勾股定理、牛顿定律..."
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && topicInput.trim() && onOpenDynamic(topicInput.trim())}
              style={{
                flex: 1,
                padding: '16px 24px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s',
                fontFamily: 'var(--font-sans)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'var(--border-accent)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
            />
            <button
              onClick={() => topicInput.trim() && onOpenDynamic(topicInput.trim())}
              style={{
                padding: '16px 28px',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
                letterSpacing: '0.06em'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--accent-light)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--accent)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              开物
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 页脚 ═══════════════════ */}
      <footer style={{
        padding: '48px 40px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-primary)'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{
            fontSize: '14px',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em'
          }}>
            鲁班开物
          </div>
          <div style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center'
          }}>
            <a href="https://github.com/bolin68688/luban-teaching" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              GitHub
            </a>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              开源 · 免费 · K12理科可视化
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
