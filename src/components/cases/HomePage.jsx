import { useState, useEffect, useRef } from 'react'
import {
  Waves, Zap, Triangle, Sun, Moon, ArrowRight,
  BookOpen, Github, Gem, Hammer, X, Compass,
  FlaskConical, Triangle as TriIcon, Sparkles
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
   中式装饰组件
   ═══════════════════════════════════════════════════════════ */

/** 角花装饰 — 回纹 + 榫卯 */
function CornerOrnament({ position = 'tl', size = 80, color = 'var(--accent-gold)' }) {
  const rotations = { tl: 0, tr: 90, br: 180, bl: 270 }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      style={{
        position: 'absolute',
        ...(position === 'tl' ? { top: 0, left: 0 } :
          position === 'tr' ? { top: 0, right: 0 } :
          position === 'br' ? { bottom: 0, right: 0 } :
          { bottom: 0, left: 0 }),
        opacity: 0.25,
        pointerEvents: 'none',
        transform: `rotate(${rotations[position]}deg)`
      }}
    >
      {/* 外层回纹 */}
      <path d="M4 4h28v8H12v20H4V4z" fill="none" stroke={color} strokeWidth="0.8" />
      <path d="M4 4h8v8H4z" fill="none" stroke={color} strokeWidth="0.6" />
      {/* 内层榫卯 */}
      <path d="M18 18h14v4H22v10h-4V18z" fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx="14" cy="14" r="3" fill="none" stroke={color} strokeWidth="0.4" />
      {/* 放射细线 */}
      <line x1="0" y1="0" x2="40" y2="0" stroke={color} strokeWidth="0.3" opacity="0.5" />
      <line x1="0" y1="0" x2="0" y2="40" stroke={color} strokeWidth="0.3" opacity="0.5" />
    </svg>
  )
}

/** 云纹分隔线 */
function CloudDivider({ style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', ...style }}>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-gold), transparent)' }} />
      <svg width="48" height="16" viewBox="0 0 48 16" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
        <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="var(--accent-gold)" strokeWidth="0.6" fill="none" />
        <path d="M20 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="var(--accent-gold)" strokeWidth="0.6" fill="none" />
        <path d="M28 12c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="var(--accent-gold)" strokeWidth="0.6" fill="none" />
      </svg>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-gold), transparent)' }} />
    </div>
  )
}

/** 竖排文字装饰 */
function VerticalText({ text, style }) {
  return (
    <div style={{
      writingMode: 'vertical-rl',
      textOrientation: 'upright',
      fontFamily: 'var(--font-serif)',
      fontSize: '12px',
      letterSpacing: '0.3em',
      color: 'var(--accent-gold)',
      opacity: 0.25,
      pointerEvents: 'none',
      userSelect: 'none',
      ...style
    }}>
      {text}
    </div>
  )
}

/** 窗棂格背景 */
function LatticeBg() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }}>
      <defs>
        <pattern id="lattice" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="none" stroke="var(--accent-gold)" strokeWidth="0.3" />
          <line x1="30" y1="0" x2="30" y2="60" stroke="var(--accent-gold)" strokeWidth="0.15" />
          <line x1="0" y1="30" x2="60" y2="30" stroke="var(--accent-gold)" strokeWidth="0.15" />
          <rect x="12" y="12" width="36" height="36" fill="none" stroke="var(--accent-gold)" strokeWidth="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lattice)" />
    </svg>
  )
}

/** 金色粒子背景动画 */
function GoldParticles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h, particles = [], raf

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * 2
      h = canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w / 2,
        y: Math.random() * h / 2,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15 - 0.05,
        alpha: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, w / 2, h / 2)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.02
        if (p.x < 0) p.x = w / 2
        if (p.x > w / 2) p.x = 0
        if (p.y < 0) p.y = h / 2
        if (p.y > h / 2) p.y = 0
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${a})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

/* ═══════════════════════════════════════════════════════════
   案例卡片
   ═══════════════════════════════════════════════════════════ */
function CaseCard({ caseData, onClick, index }) {
  const Icon = iconMap[caseData.icon] || Waves
  const colors = {
    'wave-interference': { primary: '#4ECDC4', secondary: '#7FE8E0', gradient: 'linear-gradient(135deg, #4ECDC4 0%, #2DB5AB 100%)' },
    'solar-system': { primary: '#D4AF37', secondary: '#E8C967', gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)' },
    'electrolysis': { primary: '#50C878', secondary: '#7DE89A', gradient: 'linear-gradient(135deg, #50C878 0%, #3AA85D 100%)' },
    'trigonometry': { primary: '#9B6BD4', secondary: '#C4A0F0', gradient: 'linear-gradient(135deg, #9B6BD4 0%, #7A4FB8 100%)' }
  }
  const color = colors[caseData.id] || colors['solar-system']

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
        animation: `slideUp 0.7s var(--ease-out) ${index * 0.15}s forwards`,
        opacity: 0
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-10px)'
        e.currentTarget.style.borderColor = color.primary + '50'
        e.currentTarget.style.boxShadow = `0 28px 70px rgba(0,0,0,0.5), 0 0 60px ${color.primary}18`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* 顶部渐变条 */}
      <div style={{ height: '3px', background: color.gradient }} />

      {/* 四角装饰 */}
      <CornerOrnament position="tl" size={48} color={color.primary + '30'} />
      <CornerOrnament position="br" size={48} color={color.primary + '30'} />

      <div style={{ padding: '28px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '18px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            background: `linear-gradient(135deg, ${color.primary}15 0%, ${color.secondary}08 100%)`,
            border: `1px solid ${color.primary}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 6px 24px ${color.primary}12`
          }}>
            <Icon size={26} color={color.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '19px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '6px',
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.04em'
            }}>
              {caseData.title}
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                background: `${color.primary}12`,
                padding: '2px 10px',
                borderRadius: '20px',
                color: color.primary,
                fontWeight: '500',
                fontSize: '11px',
                border: `1px solid ${color.primary}25`
              }}>
                {caseData.subject}
              </span>
              <span style={{
                background: 'var(--highlight)',
                padding: '2px 10px',
                borderRadius: '20px',
                color: 'var(--text-muted)',
                fontSize: '11px'
              }}>
                {caseData.grade}
              </span>
            </div>
          </div>
        </div>

        {/* 鲁班引言 */}
        <div style={{
          position: 'relative',
          padding: '14px 18px',
          marginBottom: '16px',
          background: `linear-gradient(135deg, ${color.primary}06 0%, transparent 100%)`,
          borderRadius: 'var(--radius-sm)',
          borderLeft: `2px solid ${color.primary}60`
        }}>
          <p style={{
            fontSize: '13px',
            fontFamily: 'var(--font-serif)',
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
          lineHeight: '1.7',
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
    { icon: BookOpen, title: '鲁班心法', desc: '核心理论 · 鲁班视角解读 · 生活场景应用', color: '#D4AF37' },
    { icon: Compass, title: '鲁班开物', desc: '交互实验控件 · 实时参数反馈 · 边学边验证', color: '#E8C967' },
    { icon: FlaskConical, title: '鲁班问答', desc: '精选练习题 · 详细解析 · 即时检验成果', color: '#C9A227' },
    { icon: TriIcon, title: '教育严谨', desc: '公式精确 · 场景合理 · 教研团队审核', color: '#A68B2D' }
  ]

  return (
    <div className="mortise-bg" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
      <style>{`
        .case-card:hover .card-arrow { gap: 10px !important; }
      `}</style>

      {/* ═══════════════════ 导航栏 ═══════════════════ */}
      <header style={{
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        background: scrollY > 50 ? 'var(--bg-overlay)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.4s var(--ease-smooth)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Logo */}
          <div style={{ position: 'relative' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-gold-light)" />
                  <stop offset="100%" stopColor="var(--accent-gold-dark)" />
                </linearGradient>
              </defs>
              <rect width="40" height="40" rx="8" fill="var(--bg-card)" stroke="var(--border-gold)" strokeWidth="0.5" />
              <path d="M10 30L20 10L30 30" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="22" r="3.5" fill="url(#logoGrad)" />
              <path d="M12 26H28" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              letterSpacing: '0.08em'
            }}>
              鲁班教学大师
            </span>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px', letterSpacing: '0.1em' }}>
              K12 理科可视化教育平台
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="https://github.com/bolin68688/luban-teaching" target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)', color: 'var(--accent-gold)', textDecoration: 'none',
              fontSize: '12px', fontWeight: '500', transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--highlight)'; e.currentTarget.style.borderColor = 'var(--accent-gold)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-gold)' }}
          >
            <Github size={14} /> GitHub
          </a>
          <button onClick={onToggleTheme}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '8px 12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--text-secondary)', fontSize: '12px', transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.color = 'var(--accent-gold)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {/* ═══════════════════ Hero 区域 ═══════════════════ */}
      <section style={{
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '60px 24px'
      }}>
        <LatticeBg />
        <GoldParticles />

        {/* 水墨晕染背景 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 40%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        {/* 竖排装饰文字 */}
        <VerticalText text="以器载道 · 以物明理" style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)' }} />
        <VerticalText text="春秋鲁班 · 千年智慧" style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)' }} />

        {/* 中央内容 */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '880px' }}>
          {/* 顶部标签 */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 28px',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 100%)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'inset 0 1px 0 rgba(212,175,55,0.08)'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.4">
                <path d="M2 9h8.5M13.5 9H22" />
                <path d="M2 15h8.5M13.5 15H22" />
                <path d="M10.5 4v16M13.5 4v16" />
                <path d="M10.5 9l-1.5-1.5M10.5 9l-1.5 1.5" />
                <path d="M13.5 9l1.5-1.5M13.5 9l1.5 1.5" />
              </svg>
              <span style={{
                fontSize: '14px',
                fontFamily: 'var(--font-display)',
                color: 'var(--accent-gold)',
                letterSpacing: '0.25em',
                fontWeight: '600'
              }}>
                鲁班开物
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.4">
                <path d="M2 9h8.5M13.5 9H22" />
                <path d="M2 15h8.5M13.5 15H22" />
                <path d="M10.5 4v16M13.5 4v16" />
                <path d="M10.5 9l-1.5-1.5M10.5 9l-1.5 1.5" />
                <path d="M13.5 9l1.5-1.5M13.5 9l1.5 1.5" />
              </svg>
            </div>
          </div>

          {/* 主标题 */}
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontFamily: 'var(--font-display)',
            fontWeight: '400',
            marginBottom: '24px',
            lineHeight: 1.15,
            letterSpacing: '0.12em'
          }}>
            <span style={{
              background: 'linear-gradient(180deg, var(--accent-gold-light) 0%, var(--accent-gold) 50%, var(--accent-gold-dark) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 16px rgba(212,175,55,0.3))'
            }}>
              以器载道
            </span>
            <span style={{ color: 'var(--text-muted)', margin: '0 16px', fontWeight: '300', fontSize: '0.6em', verticalAlign: 'middle' }}>·</span>
            <span style={{
              background: 'linear-gradient(180deg, var(--accent-gold-light) 0%, var(--accent-gold) 50%, var(--accent-gold-dark) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 16px rgba(212,175,55,0.3))'
            }}>
              以物明理
            </span>
          </h1>

          {/* 副标题 */}
          <p style={{
            fontSize: '17px',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 48px',
            lineHeight: 2,
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.06em'
          }}>
            萃取春秋末期顶尖工匠
            <span style={{ color: 'var(--accent-gold)', fontWeight: '600' }}> 鲁班 </span>
            的科学思想，融合数学、物理、化学、天文四大领域，
            让知识点
            <span style={{ color: 'var(--accent-gold)', fontWeight: '600' }}> 看得见、摸得着、用得上</span>。
          </p>

          {/* 按钮 */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 40px',
                background: 'var(--gold-gradient)',
                color: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '15px', fontWeight: '700',
                border: 'none', cursor: 'pointer',
                letterSpacing: '0.08em',
                transition: 'all 0.3s var(--ease-out)',
                boxShadow: '0 4px 25px var(--accent-gold-glow)',
                position: 'relative', overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 40px var(--accent-gold-glow)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 25px var(--accent-gold-glow)'
              }}
            >
              <Hammer size={18} /> 立即开物
            </button>
            <button onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 40px',
                background: 'transparent',
                border: '1px solid var(--border-gold)',
                color: 'var(--accent-gold)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '15px', fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '0.06em',
                transition: 'all 0.3s var(--ease-out)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--highlight)'
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.borderColor = 'var(--accent-gold)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'var(--border-gold)'
              }}
            >
              <Gem size={18} /> 鲁班精选
            </button>
          </div>
        </div>

        {/* 底部卷轴提示 */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.4,
          animation: 'float 3s ease-in-out infinite'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.2em' }}>向下探索</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ 理念引言 ═══════════════════ */}
      <section style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
        position: 'relative'
      }}>
        <CloudDivider style={{ position: 'absolute', top: '0', left: '24px', right: '24px' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <CornerOrnament position="tl" size={60} />
          <CornerOrnament position="tr" size={60} />
          <CornerOrnament position="bl" size={60} />
          <CornerOrnament position="br" size={60} />

          <div style={{ padding: '40px 24px', position: 'relative', zIndex: 1 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: '0 auto 20px', opacity: 0.3 }}>
              <path d="M8 24L16 8L24 24" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="18" r="3" fill="var(--accent-gold)" />
            </svg>
            <blockquote style={{
              fontSize: 'clamp(18px, 3vw, 26px)',
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-primary)',
              lineHeight: 2,
              letterSpacing: '0.08em',
              margin: 0,
              fontWeight: '400'
            }}>
              "工欲善其事，必先利其器。"
            </blockquote>
            <p style={{
              fontSize: '14px',
              color: 'var(--accent-gold)',
              marginTop: '16px',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-serif)'
            }}>
              —— 《论语 · 卫灵公》
            </p>
            <div style={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
              margin: '32px auto 0',
              opacity: 0.5
            }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════ 三大板块 ═══════════════════ */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-secondary)', position: 'relative' }}>
        <CloudDivider style={{ position: 'absolute', top: '0', left: '24px', right: '24px' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* 标题 */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              fontSize: '11px',
              color: 'var(--accent-gold)',
              letterSpacing: '0.3em',
              fontWeight: '600'
            }}>
              三大教学板块
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              marginTop: '12px',
              letterSpacing: '0.1em'
            }}>
              教学特色
            </h2>
            <div style={{
              width: '40px',
              height: '2px',
              background: 'var(--accent-gold)',
              margin: '16px auto 0',
              opacity: 0.4
            }} />
          </div>

          {/* 特色卡片 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {features.map((f, i) => (
              <div key={i}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '36px 28px',
                  textAlign: 'center',
                  transition: 'all 0.5s var(--ease-out)',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `slideUp 0.6s var(--ease-out) ${i * 0.1}s forwards`,
                  opacity: 0
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-gold-hover)'
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.4), 0 0 40px ${f.color}12`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* 顶部金线 */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`
                }} />
                {/* 角花 */}
                <CornerOrnament position="tl" size={36} color={f.color + '25'} />
                <CornerOrnament position="br" size={36} color={f.color + '25'} />

                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-md)',
                  background: `linear-gradient(135deg, ${f.color}12 0%, ${f.color}04 100%)`,
                  border: `1px solid ${f.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: `0 8px 30px ${f.color}10`
                }}>
                  <f.icon size={28} color={f.color} />
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                  fontFamily: 'var(--font-serif)',
                  letterSpacing: '0.06em'
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 案例展示 ═══════════════════ */}
      <section id="cases" style={{ padding: '100px 24px', position: 'relative' }}>
        <CloudDivider style={{ position: 'absolute', top: '0', left: '24px', right: '24px' }} />
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* 标题 */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              fontSize: '11px',
              color: 'var(--accent-gold)',
              letterSpacing: '0.3em',
              fontWeight: '600'
            }}>
              精选知识点
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              marginTop: '12px',
              letterSpacing: '0.1em'
            }}>
              四大领域 · 开物成器
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              marginTop: '12px'
            }}>
              涵盖数学 · 物理 · 化学 · 天文
            </p>
            <div style={{
              width: '40px',
              height: '2px',
              background: 'var(--accent-gold)',
              margin: '20px auto 0',
              opacity: 0.4
            }} />
          </div>

          {/* 案例卡片 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '28px'
          }}>
            {cases.map((c, i) => (
              <CaseCard key={c.id} caseData={c} onClick={onOpenCase} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 页脚 ═══════════════════ */}
      <footer style={{
        padding: '80px 24px 40px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        position: 'relative'
      }}>
        <CloudDivider style={{ position: 'absolute', top: '0', left: '24px', right: '24px' }} />

        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <CornerOrnament position="tl" size={50} />
          <CornerOrnament position="tr" size={50} />

          <div style={{ padding: '20px 0', position: 'relative', zIndex: 1 }}>
            {/* Logo */}
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 16px' }}>
              <rect width="44" height="44" rx="10" fill="var(--bg-card)" stroke="var(--border-gold)" strokeWidth="0.5" />
              <path d="M11 33L22 11L33 33" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="22" cy="25" r="4" fill="var(--accent-gold)" />
              <path d="M13 29H31" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <h3 style={{
              fontSize: '20px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              marginBottom: '6px',
              letterSpacing: '0.12em'
            }}>
              鲁班教学大师
            </h3>
            <p style={{
              fontSize: '14px',
              fontFamily: 'var(--font-serif)',
              color: 'var(--accent-gold)',
              letterSpacing: '0.15em',
              marginBottom: '24px'
            }}>
              以器载道 · 以物明理
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {['GitHub', '在线演示'].map((label, i) => (
                <a key={label}
                  href={i === 0 ? 'https://github.com/bolin68688/luban-teaching' : 'https://bolin68688.github.io/luban-teaching'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    letterSpacing: '0.05em'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {label}
                </a>
              ))}
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Built with React + Canvas + GSAP · MIT License
            </p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════ 立即开物 Modal ═══════════════════ */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 32px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.08)',
              position: 'relative',
              animation: 'slideUp 0.3s var(--ease-out)',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* 四角装饰 */}
            <CornerOrnament position="tl" size={40} />
            <CornerOrnament position="tr" size={40} />
            <CornerOrnament position="bl" size={40} />
            <CornerOrnament position="br" size={40} />

            {/* 关闭按钮 */}
            <button onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '16px', right: '16px',
                background: 'transparent', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                padding: '4px', display: 'flex',
                transition: 'color 0.2s', zIndex: 2
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <X size={20} />
            </button>

            {/* 标题 */}
            <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, transparent 100%)',
                border: '1.5px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Hammer size={26} color="var(--accent-gold)" />
              </div>
              <h3 style={{
                fontSize: '22px',
                fontFamily: 'var(--font-display)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                letterSpacing: '0.1em',
                marginBottom: '6px'
              }}>
                立即开物
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                输入你想学习的知识点，鲁班为你开物成器
              </p>
            </div>

            {/* 输入框 */}
            <div style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }}>
              <input
                type="text"
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="例如：牛顿第二定律、光合作用、勾股定理..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'var(--bg-primary)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'var(--border-gold)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.1)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
                支持物理、化学、数学、天文等 K12 学科知识点。
              </p>
            </div>

            {/* 按钮 */}
            <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
              <button onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-gold)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                取消
              </button>
              <button onClick={handleOpenDynamic}
                disabled={!topicInput.trim()}
                style={{
                  flex: 2,
                  padding: '12px 20px',
                  background: topicInput.trim() ? 'var(--gold-gradient)' : 'var(--border)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: topicInput.trim() ? 'var(--bg-primary)' : 'var(--text-muted)',
                  fontSize: '14px', fontWeight: '700',
                  cursor: topicInput.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Hammer size={16} /> 开始开物
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
