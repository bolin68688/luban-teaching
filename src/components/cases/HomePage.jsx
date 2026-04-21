import { useState, useEffect, useRef } from 'react'
import {
  Waves, Zap, Triangle, Sun, Moon, ArrowRight,
  BookOpen, Github, Gem, Hammer, X, Compass,
  FlaskConical, Triangle as TriIcon, Sparkles, Search
} from 'lucide-react'
import { cases } from '../../data/cases.js'

/* ═══════════════════════════════════════════════════════════
   图标映射
   ═══════════════════════════════════════════════════════════ */
const iconMap = {
  waves: Waves,
  sun: Sun,
  bolt: Zap,
  triangle: Triangle
}

/* ═══════════════════════════════════════════════════════════
   新中式装饰组件 — 极简克制
   ═══════════════════════════════════════════════════════════ */

/** 极简回纹边框 — 细线版 */
function HuiwenBorder({ children, style }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      {/* 四边细线 */}
      <div style={{
        position: 'absolute', top: 0, left: 12, right: 12, height: 1,
        background: 'linear-gradient(90deg, transparent, var(--border-accent), transparent)'
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 12, right: 12, height: 1,
        background: 'linear-gradient(90deg, transparent, var(--border-accent), transparent)'
      }} />
      <div style={{
        position: 'absolute', left: 0, top: 12, bottom: 12, width: 1,
        background: 'linear-gradient(180deg, transparent, var(--border-accent), transparent)'
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 12, bottom: 12, width: 1,
        background: 'linear-gradient(180deg, transparent, var(--border-accent), transparent)'
      }} />
      {/* 四角短线 */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.3 }}>
        <path d="M0 8V0H8" stroke="var(--accent)" strokeWidth="1" fill="none" />
        <path d="M4 4h4v4H4z" stroke="var(--accent)" strokeWidth="0.5" fill="none" />
      </svg>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', top: 0, right: 0, opacity: 0.3, transform: 'rotate(90deg)' }}>
        <path d="M0 8V0H8" stroke="var(--accent)" strokeWidth="1" fill="none" />
        <path d="M4 4h4v4H4z" stroke="var(--accent)" strokeWidth="0.5" fill="none" />
      </svg>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.3, transform: 'rotate(180deg)' }}>
        <path d="M0 8V0H8" stroke="var(--accent)" strokeWidth="1" fill="none" />
        <path d="M4 4h4v4H4z" stroke="var(--accent)" strokeWidth="0.5" fill="none" />
      </svg>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.3, transform: 'rotate(270deg)' }}>
        <path d="M0 8V0H8" stroke="var(--accent)" strokeWidth="1" fill="none" />
        <path d="M4 4h4v4H4z" stroke="var(--accent)" strokeWidth="0.5" fill="none" />
      </svg>
      {children}
    </div>
  )
}

/** 印章装饰 */
function SealStamp({ text, color = 'var(--accent-red)', size = 48 }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: `2px solid ${color}`,
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: size * 0.35,
      color,
      opacity: 0.7,
      writingMode: 'vertical-rl',
      textOrientation: 'upright',
      letterSpacing: '0.1em',
      lineHeight: 1,
      flexShrink: 0
    }}>
      {text}
    </div>
  )
}

/** 分隔线 — 青瓷色 */
function AccentDivider({ style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', ...style }}>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-accent), transparent)' }} />
      <div style={{
        width: 6, height: 6,
        border: '1px solid var(--accent)',
        transform: 'rotate(45deg)',
        opacity: 0.5,
        flexShrink: 0
      }} />
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-accent), transparent)' }} />
    </div>
  )
}

/** 水墨晕染背景 */
function InkBackground() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      {/* 主晕染 — 青瓷色调 */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(91,138,114,0.06) 0%, rgba(91,138,114,0.02) 40%, transparent 70%)',
        filter: 'blur(60px)'
      }} />
      {/* 右侧淡晕染 */}
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '-10%',
        width: '500px',
        height: '400px',
        background: 'radial-gradient(ellipse at center, rgba(91,155,213,0.04) 0%, transparent 60%)',
        filter: 'blur(50px)'
      }} />
      {/* 左下淡晕染 */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: '400px',
        height: '300px',
        background: 'radial-gradient(ellipse at center, rgba(91,138,114,0.03) 0%, transparent 60%)',
        filter: 'blur(50px)'
      }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   案例卡片 — 全新设计
   ═══════════════════════════════════════════════════════════ */
function CaseCard({ caseData, onClick, index }) {
  const Icon = iconMap[caseData.icon] || Waves
  const colors = {
    'wave-interference': { primary: '#5B9BD5', secondary: '#7EB5E5', bg: 'rgba(91,155,213,0.08)' },
    'solar-system': { primary: '#D4A574', secondary: '#E4BC94', bg: 'rgba(212,165,116,0.08)' },
    'electrolysis': { primary: '#5B8A72', secondary: '#7BA392', bg: 'rgba(91,138,114,0.08)' },
    'trigonometry': { primary: '#9B7CB6', secondary: '#B8A0D0', bg: 'rgba(155,124,182,0.08)' }
  }
  const color = colors[caseData.id] || colors['electrolysis']

  return (
    <button
      onClick={() => onClick(caseData.id)}
      className="case-card"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.5s var(--ease-out)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        animation: `slideUp 0.7s var(--ease-out) ${index * 0.12}s forwards`,
        opacity: 0
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.borderColor = color.primary + '35'
        e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 40px ${color.primary}10`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* 顶部色带 */}
      <div style={{
        height: '3px',
        background: `linear-gradient(90deg, ${color.primary} 0%, ${color.secondary} 100%)`
      }} />

      <div style={{ padding: '28px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            background: color.bg,
            border: `1px solid ${color.primary}25`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon size={24} color={color.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '6px',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.04em'
            }}>
              {caseData.title}
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                background: color.bg,
                padding: '3px 10px',
                borderRadius: '20px',
                color: color.primary,
                fontWeight: '500',
                fontSize: '11px',
                border: `1px solid ${color.primary}20`
              }}>
                {caseData.subject}
              </span>
              <span style={{
                background: 'var(--highlight)',
                padding: '3px 10px',
                borderRadius: '20px',
                color: 'var(--text-muted)',
                fontSize: '11px'
              }}>
                {caseData.grade}
              </span>
            </div>
          </div>
        </div>

        {/* 鲁班引言 — 更简洁 */}
        <div style={{
          position: 'relative',
          padding: '12px 16px',
          marginBottom: '16px',
          background: `linear-gradient(135deg, ${color.bg} 0%, transparent 100%)`,
          borderRadius: 'var(--radius-sm)',
          borderLeft: `2px solid ${color.primary}50`
        }}>
          <p style={{
            fontSize: '13px',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            color: color.primary + 'cc',
            margin: 0,
            lineHeight: 1.7
          }}>
            {caseData.tagline}
          </p>
        </div>

        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: '20px'
        }}>
          {caseData.description}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>进入探索</span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '600',
            color: color.primary,
            transition: 'gap 0.3s'
          }} className="card-arrow">
            开物 <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════
   主页组件
   ═══════════════════════════════════════════════════════════ */
export default function HomePage({ onOpenCase, onOpenDynamic, theme, onToggleTheme }) {
  const [showModal, setShowModal] = useState(false)
  const [topicInput, setTopicInput] = useState('')
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleOpenDynamic = () => {
    if (topicInput.trim()) {
      onOpenDynamic(topicInput.trim())
      setShowModal(false)
      setTopicInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleOpenDynamic()
    if (e.key === 'Escape') setShowModal(false)
  }

  const features = [
    { icon: BookOpen, title: '鲁班心法', desc: '核心理论 · 鲁班视角解读 · 生活场景应用', color: '#5B8A72' },
    { icon: Compass, title: '鲁班开物', desc: '交互实验控件 · 实时参数反馈 · 边学边验证', color: '#7BA392' },
    { icon: FlaskConical, title: '鲁班问答', desc: '精选练习题 · 详细解析 · 即时检验成果', color: '#5B9BD5' },
    { icon: TriIcon, title: '教育严谨', desc: '公式精确 · 场景合理 · 教研团队审核', color: '#9B7CB6' }
  ]

  return (
    <div className="crackle-bg" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
      <style>{`
        .case-card:hover .card-arrow { gap: 10px !important; }
      `}</style>

      {/* ═══════════════════ 导航栏 ═══════════════════ */}
      <header style={{
        padding: '14px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: scrollY > 30 ? '1px solid var(--border)' : '1px solid transparent',
        background: scrollY > 30 ? 'var(--bg-overlay)' : 'transparent',
        backdropFilter: scrollY > 30 ? 'blur(20px)' : 'none',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.4s var(--ease-smooth)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Logo — 青瓷色 */}
          <div style={{ position: 'relative' }}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <rect width="38" height="38" rx="10" fill="var(--bg-card)" stroke="var(--border-accent)" strokeWidth="0.5" />
              <path d="M10 28L19 10L28 28" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="19" cy="21" r="3" fill="var(--accent)" />
              <path d="M12 24H26" stroke="var(--accent-light)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <span style={{
              fontSize: '17px',
              fontWeight: '600',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              letterSpacing: '0.06em'
            }}>
              鲁班开物
            </span>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px', letterSpacing: '0.08em' }}>
              K12 理科可视化教学
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="https://github.com/bolin68688/luban-teaching" target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', textDecoration: 'none',
              fontSize: '12px', fontWeight: '500', transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <Github size={14} /> GitHub
          </a>
          <button onClick={onToggleTheme}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '7px 11px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--text-secondary)', fontSize: '12px', transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {/* ═══════════════════ Hero 区域 ═══════════════════ */}
      <section ref={heroRef} style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 24px 120px'
      }}>
        <InkBackground />

        {/* 左右竖排装饰 */}
        <div style={{
          position: 'absolute',
          left: '28px',
          top: '50%',
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          fontFamily: 'var(--font-display)',
          fontSize: '11px',
          letterSpacing: '0.4em',
          color: 'var(--accent)',
          opacity: 0.2,
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          以器载道 · 以物明理
        </div>
        <div style={{
          position: 'absolute',
          right: '28px',
          top: '50%',
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          fontFamily: 'var(--font-display)',
          fontSize: '11px',
          letterSpacing: '0.4em',
          color: 'var(--accent)',
          opacity: 0.2,
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          格物致知 · 知行合一
        </div>

        {/* 中央内容 */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px' }}>
          {/* 顶部标签 */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 20px',
            background: 'var(--highlight)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '40px'
          }}>
            <div style={{ width: 4, height: 4, background: 'var(--accent)', borderRadius: '50%' }} />
            <span style={{
              fontSize: '13px',
              fontFamily: 'var(--font-display)',
              color: 'var(--accent-light)',
              letterSpacing: '0.2em'
            }}>
              K12 理科可视化教学平台
            </span>
            <div style={{ width: 4, height: 4, background: 'var(--accent)', borderRadius: '50%' }} />
          </div>

          {/* 主标题 — 超大字号 */}
          <h1 style={{
            fontSize: 'clamp(42px, 7vw, 76px)',
            fontFamily: 'var(--font-display)',
            fontWeight: '400',
            marginBottom: '28px',
            lineHeight: 1.15,
            letterSpacing: '0.1em'
          }}>
            <span style={{
              background: 'linear-gradient(180deg, var(--accent-light) 0%, var(--accent) 60%, var(--accent-dark) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              以器载道
            </span>
            <br />
            <span style={{ color: 'var(--text-muted)', fontWeight: '300', fontSize: '0.5em', letterSpacing: '0.15em', verticalAlign: 'middle' }}>
              ——
            </span>
            <span style={{
              background: 'linear-gradient(180deg, var(--accent-light) 0%, var(--accent) 60%, var(--accent-dark) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              以物明理
            </span>
          </h1>

          {/* 副标题 */}
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            margin: '0 auto 48px',
            lineHeight: 2,
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.04em'
          }}>
            萃取春秋末期顶尖工匠
            <span style={{ color: 'var(--accent)', fontWeight: '600' }}> 鲁班 </span>
            的科学思想，融合数学、物理、化学、天文四大领域
            让知识点
            <span style={{ color: 'var(--accent)', fontWeight: '600' }}> 看得见、摸得着、用得上</span>
          </p>

          {/* 按钮 */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 36px',
                background: 'var(--accent-gradient)',
                color: '#fff',
                borderRadius: 'var(--radius-sm)',
                fontSize: '15px', fontWeight: '600',
                border: 'none', cursor: 'pointer',
                letterSpacing: '0.06em',
                transition: 'all 0.3s var(--ease-out)',
                boxShadow: '0 4px 20px var(--accent-glow)',
                position: 'relative', overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 30px var(--accent-glow-strong)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px var(--accent-glow)'
              }}
            >
              <Hammer size={18} /> 立即开物
            </button>
            <button onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 36px',
                background: 'transparent',
                border: '1px solid var(--border-accent)',
                color: 'var(--accent-light)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '15px', fontWeight: '500',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.3s var(--ease-out)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--highlight)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'var(--border-accent)'
              }}
            >
              <Gem size={18} /> 探索案例
            </button>
          </div>
        </div>

        {/* 底部提示 */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.35,
          animation: 'float 4s ease-in-out infinite'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.2em' }}>向下探索</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ 理念引言 ═══════════════════ */}
      <section style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
        position: 'relative'
      }}>
        <AccentDivider style={{ position: 'absolute', top: '0', left: '24px', right: '24px' }} />
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <HuiwenBorder style={{ padding: '48px 32px' }}>
            <SealStamp text="匠心" size={40} style={{ margin: '0 auto 20px' }} />
            <blockquote style={{
              fontSize: 'clamp(20px, 3.5vw, 30px)',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              lineHeight: 2,
              letterSpacing: '0.06em',
              margin: 0,
              fontWeight: '400'
            }}>
              "工欲善其事，必先利其器。"
            </blockquote>
            <p style={{
              fontSize: '14px',
              color: 'var(--accent)',
              marginTop: '20px',
              letterSpacing: '0.12em',
              fontFamily: 'var(--font-display)'
            }}>
              —— 《论语 · 卫灵公》
            </p>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              marginTop: '24px',
              lineHeight: 2,
              maxWidth: '480px',
              margin: '24px auto 0'
            }}>
              我们深信，每一个抽象的知识点，都值得被赋予一把"器"——
              <br />
              让物理的光波触手可及，让化学的反应一目了然，让数学的函数跃然屏上
            </p>
          </HuiwenBorder>
        </div>
      </section>

      {/* ═══════════════════ 三大板块 ═══════════════════ */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-secondary)', position: 'relative' }}>
        <AccentDivider style={{ position: 'absolute', top: '0', left: '24px', right: '24px' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{ width: 24, height: 1, background: 'var(--accent)' }} />
              <span style={{
                fontSize: '12px',
                color: 'var(--accent)',
                letterSpacing: '0.3em',
                fontWeight: '500'
              }}>
                教学理念
              </span>
              <div style={{ width: 24, height: 1, background: 'var(--accent)' }} />
            </div>
            <h2 style={{
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontFamily: 'var(--font-display)',
              fontWeight: '400',
              color: 'var(--text-primary)',
              letterSpacing: '0.08em',
              marginBottom: '12px'
            }}>
              三重境界，层层递进
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              从理论到实践，从观察到验证，构建完整学习闭环
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px 28px',
                  textAlign: 'center',
                  transition: 'all 0.4s var(--ease-out)',
                  animation: `slideUp 0.6s var(--ease-out) ${i * 0.1}s forwards`,
                  opacity: 0,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.borderColor = f.color + '30'
                    e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3)`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* 顶部细线 */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '20%',
                    right: '20%',
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
                    opacity: 0.6
                  }} />
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    background: `${f.color}10`,
                    border: `1px solid ${f.color}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <Icon size={24} color={f.color} />
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '10px',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.04em'
                  }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {f.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 案例展示 ═══════════════════ */}
      <section id="cases" style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        position: 'relative'
      }}>
        <AccentDivider style={{ position: 'absolute', top: '0', left: '24px', right: '24px' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{ width: 24, height: 1, background: 'var(--accent)' }} />
              <span style={{
                fontSize: '12px',
                color: 'var(--accent)',
                letterSpacing: '0.3em',
                fontWeight: '500'
              }}>
                精选案例
              </span>
              <div style={{ width: 24, height: 1, background: 'var(--accent)' }} />
            </div>
            <h2 style={{
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontFamily: 'var(--font-display)',
              fontWeight: '400',
              color: 'var(--text-primary)',
              letterSpacing: '0.08em',
              marginBottom: '12px'
            }}>
              鲁班精选
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              四大领域核心知识点，每一个都值得亲手探索
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {cases.map((c, i) => (
              <CaseCard key={c.id} caseData={c} onClick={onOpenCase} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 动态探索 ═══════════════════ */}
      <section style={{
        padding: '100px 24px',
        background: 'var(--bg-primary)',
        position: 'relative'
      }}>
        <AccentDivider style={{ position: 'absolute', top: '0', left: '24px', right: '24px' }} />
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <SealStamp text="探索" size={44} color="var(--accent)" style={{ margin: '0 auto 24px' }} />
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 30px)',
            fontFamily: 'var(--font-display)',
            fontWeight: '400',
            color: 'var(--text-primary)',
            letterSpacing: '0.06em',
            marginBottom: '16px'
          }}>
            探索任意知识点
          </h2>
          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            lineHeight: 1.8
          }}>
            输入你想学习的知识点，AI 将为你生成专属的可视化教学页面
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            maxWidth: '480px',
            margin: '0 auto'
          }}>
            <input
              type="text"
              placeholder="例如：勾股定理、牛顿定律、元素周期表..."
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: '14px 20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s',
                fontFamily: 'var(--font-sans)'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--border-accent)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
            />
            <button
              onClick={() => topicInput.trim() && onOpenDynamic(topicInput.trim())}
              style={{
                padding: '14px 24px',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap'
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
              <Sparkles size={16} /> 开物
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 页脚 ═══════════════════ */}
      <footer style={{
        padding: '48px 24px 32px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-primary)',
        position: 'relative'
      }}>
        <AccentDivider style={{ position: 'absolute', top: '0', left: '24px', right: '24px' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
              <rect width="38" height="38" rx="8" fill="var(--bg-card)" stroke="var(--border-accent)" strokeWidth="0.5" />
              <path d="M10 28L19 10L28 28" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="19" cy="21" r="3" fill="var(--accent)" />
            </svg>
            <span style={{
              fontSize: '16px',
              fontWeight: '600',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              letterSpacing: '0.06em'
            }}>
              鲁班开物
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.8 }}>
            萃取春秋鲁班科学思想，融合现代可视化技术，打造 K12 理科教学新体验
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="https://github.com/bolin68688/luban-teaching" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', transition: 'color 0.3s', fontSize: '13px', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              GitHub
            </a>
            <span style={{ color: 'var(--border-accent)' }}>|</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              开源 · 免费 · 持续更新
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', opacity: 0.6 }}>
            &copy; 2025 鲁班开物 · 以器载道，以物明理
          </p>
        </div>
      </footer>

      {/* ═══════════════════ 弹窗 ═══════════════════ */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.3s ease'
        }} onClick={() => setShowModal(false)}>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              maxWidth: '480px',
              width: '100%',
              position: 'relative',
              animation: 'scaleIn 0.3s var(--ease-out)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <SealStamp text="开物" size={40} style={{ margin: '0 auto 16px' }} />
              <h3 style={{
                fontSize: '20px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                letterSpacing: '0.04em'
              }}>
                输入知识点
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                AI 将为你生成专属可视化教学页面
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="例如：勾股定理"
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--border-accent)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
              />
              <button
                onClick={handleOpenDynamic}
                style={{
                  padding: '12px 24px',
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
              >
                开始
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
