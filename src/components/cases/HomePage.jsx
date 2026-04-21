import { useState, useEffect, useRef, useCallback } from 'react'
import { cases } from '../../data/cases.js'
import '../../styles/theme.css'

/* ============================================================
   鲁班教学大师 v5.0 — TNKR风格主页
   ============================================================ */

/* ── 图标组件 ── */
const Icons = {
  waves: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0 4 3 6 0"/>
      <path d="M2 16c2-3 4-3 6 0s4 3 6 0 4-3 6 0 4 3 6 0"/>
    </svg>
  ),
  sun: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/>
    </svg>
  ),
  bolt: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z"/>
    </svg>
  ),
  triangle: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3L3 20h18L12 3z"/>
      <path d="M12 8v8m-3-4h6" opacity="0.5"/>
    </svg>
  ),
  arrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  chevronDown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
  menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  ),
  close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  cube: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/>
      <path d="M3 8l9 5 9-5" opacity="0.4"/>
      <path d="M12 13V22" opacity="0.4"/>
    </svg>
  ),
  compass: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>
    </svg>
  ),
}

const subjectColors = {
  '物理 · 光学':   'var(--subject-physics)',
  '天文 · 动力学': 'var(--subject-astronomy)',
  '化学 · 电化学': 'var(--subject-chemistry)',
  '数学 · 三角学': 'var(--subject-math)',
}

/* ── 滚动显现 Hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, revealed]
}

/* ── 计数器组件 ── */
function Counter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [ref, revealed] = useReveal(0.3)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!revealed || hasAnimated.current) return
    hasAnimated.current = true
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [revealed, end, duration])

  return (
    <span ref={ref} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent)' }}>
      {count}{suffix}
    </span>
  )
}

/* ── 3D 榫卯结构 ── */
function Sunmao3D() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      perspective: '1000px',
    }}>
      <div style={{
        width: 200,
        height: 200,
        position: 'relative',
        transformStyle: 'preserve-3d',
        animation: 'sunmao-rotate 12s linear infinite',
      }}>
        {/* 榫 — 凸出块 */}
        <div style={{
          position: 'absolute',
          width: 80,
          height: 40,
          background: 'linear-gradient(135deg, rgba(201,169,110,0.25) 0%, rgba(201,169,110,0.08) 100%)',
          border: '1px solid rgba(201,169,110,0.35)',
          top: '50%',
          left: '10%',
          transform: 'translateY(-50%) translateZ(20px)',
          boxShadow: '0 0 20px rgba(201,169,110,0.1)',
        }}>
          <span style={{
            position: 'absolute',
            top: -18,
            left: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'var(--accent)',
            opacity: 0.6,
            letterSpacing: '0.1em',
          }}>TENON</span>
        </div>
        {/* 卯 — 凹槽块 */}
        <div style={{
          position: 'absolute',
          width: 100,
          height: 60,
          background: 'linear-gradient(135deg, rgba(139,119,86,0.2) 0%, rgba(139,119,86,0.06) 100%)',
          border: '1px solid rgba(201,169,110,0.25)',
          top: '50%',
          right: '10%',
          transform: 'translateY(-50%) translateZ(-10px)',
        }}>
          <div style={{
            position: 'absolute',
            width: 80,
            height: 40,
            background: 'var(--bg-primary)',
            top: '50%',
            left: '10%',
            transform: 'translateY(-50%)',
            border: '1px dashed rgba(201,169,110,0.2)',
          }}/>
          <span style={{
            position: 'absolute',
            bottom: -18,
            right: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'var(--accent)',
            opacity: 0.6,
            letterSpacing: '0.1em',
          }}>MORTISE</span>
        </div>
        {/* 连接线 */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 200 200">
          <line x1="50" y1="100" x2="150" y2="100" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5" strokeDasharray="4 4"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(201,169,110,0.08)" strokeWidth="0.5"/>
          <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(201,169,110,0.05)" strokeWidth="0.5"/>
        </svg>
        {/* 坐标轴标注 */}
        <span style={{
          position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-muted)', letterSpacing: '0.15em',
        }}>X-AXIS // SUNMAO JOINT</span>
      </div>
    </div>
  )
}

/* ── 扫描线叠加 ── */
function ScanlineOverlay() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.08), transparent)',
        animation: 'scanline 6s linear infinite',
      }}/>
    </div>
  )
}

/* ── 粒子网格背景 ── */
function ParticleGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h, particles = [], raf

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight
      const spacing = 60
      for (let x = 0; x < cw; x += spacing) {
        for (let y = 0; y < ch; y += spacing) {
          particles.push({
            x, y,
            ox: x, oy: y,
            vx: 0, vy: 0,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.3 + 0.1,
          })
        }
      }
    }

    let mouse = { x: -1000, y: -1000 }
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => { mouse.x = -1000; mouse.y = -1000 }

    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)

    const draw = () => {
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight
      ctx.clearRect(0, 0, cw, ch)

      // 连线
      ctx.strokeStyle = 'rgba(201, 169, 110, 0.04)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.globalAlpha = (1 - dist / 100) * 0.15
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // 点
      for (const p of particles) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const force = dist < 150 ? (150 - dist) / 150 * 3 : 0
        p.vx += (p.ox - p.x) * 0.02 + (dx / dist || 0) * force * 0.1
        p.vy += (p.oy - p.y) * 0.02 + (dy / dist || 0) * force * 0.1
        p.vx *= 0.92
        p.vy *= 0.92
        p.x += p.vx
        p.y += p.vy

        ctx.globalAlpha = p.alpha * (1 + (dist < 150 ? (150 - dist) / 150 * 2 : 0))
        ctx.fillStyle = 'rgba(201, 169, 110, 0.6)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'auto',
    }}/>
  )
}

/* ============================================================
   主页
   ============================================================ */
export default function HomePage({ onOpenCase, onOpenDynamic }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [topicInput, setTopicInput] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleDynamic = useCallback(() => {
    const t = topicInput.trim()
    if (t) onOpenDynamic(t)
  }, [topicInput, onOpenDynamic])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  /* 滚动显现 */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('revealed')
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const [heroRef, heroRevealed] = useReveal(0.1)
  const [statsRef, statsRevealed] = useReveal(0.2)
  const [casesRef, casesRevealed] = useReveal(0.1)
  const [sunmaoRef, sunmaoRevealed] = useReveal(0.2)

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', position: 'relative' }}>
      <ScanlineOverlay />

      {/* ═══════════════════════════════════════
          导航栏 — 玻璃拟态
          ═══════════════════════════════════════ */}
      <nav className="glass-strong" style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(1.2rem, 4vw, 3rem)',
        transition: 'all 0.4s ease',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            width: 32, height: 32,
            border: '1.5px solid var(--accent)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 600 }}>LB</span>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>鲁班开物</div>
            <div style={{ fontSize: '0.55rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>LUBAN TEACHING</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="desktop-nav">
          {[
            { label: '案例', id: 'cases-section' },
            { label: '榫卯', id: 'sunmao-section' },
            { label: '开物', id: 'explore-section' },
          ].map(item => (
            <button key={item.id} className="btn-ghost" onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.8rem' }} onClick={() => scrollTo('explore-section')}>
            开始探索
          </button>
          <button style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }} className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <Icons.close /> : <Icons.menu />}
          </button>
        </div>
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="glass-strong" style={{
          position: 'fixed', top: 64, left: 0, right: 0,
          zIndex: 99, padding: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          {[
            { label: '案例', id: 'cases-section' },
            { label: '榫卯', id: 'sunmao-section' },
            { label: '开物', id: 'explore-section' },
          ].map(item => (
            <button key={item.id} className="btn-ghost" style={{ display: 'block', width: '100%', marginBottom: 4, textAlign: 'left' }} onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════
          HERO 区域
          ═══════════════════════════════════════ */}
      <section ref={heroRef} style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: 64,
      }}>
        {/* 粒子网格背景 */}
        <ParticleGrid />

        {/* 径向光晕 */}
        <div style={{
          position: 'absolute',
          top: '20%', right: '10%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute',
          bottom: '10%', left: '5%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(61,139,122,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}/>

        {/* 网格底纹 */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}/>

        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
          zIndex: 2,
        }} className="hero-grid">
          {/* 左侧：文案 */}
          <div style={{ maxWidth: 560 }}>
            {/* 工程标签 */}
            <div className={heroRevealed ? 'animate-fadeInUp delay-1' : ''} style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32,
            }}>
              <div style={{ width: 24, height: 1, background: 'var(--accent)', opacity: 0.5 }}/>
              <span className="mono-label">K12 SCIENCE VISUALIZATION</span>
            </div>

            {/* 主标题 */}
            <h1 className={heroRevealed ? 'animate-fadeInUp delay-2' : ''} style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 24,
            }}>
              <span className="glow-text">以器载道</span>
              <br/>
              <span style={{ color: 'var(--accent)' }}>以物明理</span>
            </h1>

            {/* 副标题 */}
            <p className={heroRevealed ? 'animate-fadeInUp delay-3' : ''} style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: 480,
              marginBottom: 40,
            }}>
              融合中国传统榫卯工艺智慧与现代科学可视化技术，为K12教育打造沉浸式交互学习体验。
            </p>

            {/* 按钮组 */}
            <div className={heroRevealed ? 'animate-fadeInUp delay-4' : ''} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => scrollTo('cases-section')}>
                探索案例 <Icons.arrowRight />
              </button>
              <button className="btn btn-secondary" onClick={() => scrollTo('sunmao-section')}>
                了解榫卯 <Icons.cube />
              </button>
            </div>

            {/* 工程标注 */}
            <div className={heroRevealed ? 'animate-fadeIn delay-6' : ''} style={{
              marginTop: 60,
              display: 'flex',
              gap: 32,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
            }}>
              <div>
                <div style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>004</div>
                <div>可视化案例</div>
              </div>
              <div style={{ width: 1, background: 'var(--border-subtle)' }}/>
              <div>
                <div style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>04</div>
                <div>核心学科</div>
              </div>
              <div style={{ width: 1, background: 'var(--border-subtle)' }}/>
              <div>
                <div style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>INFINITY</div>
                <div>动态生成</div>
              </div>
            </div>
          </div>

          {/* 右侧：3D榫卯 */}
          <div className={heroRevealed ? 'animate-scaleIn delay-3' : ''} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: 400,
          }}>
            <Sunmao3D />
            {/* 旋转提示 */}
            <div style={{
              position: 'absolute',
              bottom: -20,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              animation: 'breathe 3s ease infinite',
            }}>
              [ AUTOROTATE // 12s/cycle ]
            </div>
          </div>
        </div>

        {/* 底部滚动提示 */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          animation: 'float 3s ease infinite',
          cursor: 'pointer',
        }} onClick={() => scrollTo('stats-section')}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>SCROLL</span>
          <Icons.chevronDown />
        </div>

        {/* 底部渐变 */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 200,
          background: 'linear-gradient(to bottom, transparent, var(--bg-primary))',
          pointerEvents: 'none',
        }}/>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════
          数据/理念区 — Impact Metrics风格
          ═══════════════════════════════════════ */}
      <section id="stats-section" ref={statsRef} style={{
        position: 'relative',
        padding: 'var(--space-4xl) 0',
        background: 'var(--bg-void)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
        }}>
          {/* 顶部工程标签 */}
          <div className={`reveal ${statsRevealed ? 'revealed' : ''}`} style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48,
          }}>
            <div style={{ width: 24, height: 1, background: 'var(--accent)', opacity: 0.5 }}/>
            <span className="mono-label">IMPACT METRICS // 影响力数据</span>
          </div>

          {/* 大引言 */}
          <div className={`reveal ${statsRevealed ? 'revealed' : ''}`} style={{ marginBottom: 64 }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              maxWidth: 700,
            }}>
              工欲善其事，<span style={{ color: 'var(--accent)' }}>必先利其器</span>
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              maxWidth: 520,
              marginTop: 16,
              lineHeight: 1.7,
            }}>
              两千多年前，鲁班以精湛技艺开创了中华工匠精神的先河。今天，我们用数字技术延续这份对精确与美的追求。
            </p>
          </div>

          {/* 计数器网格 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }} className="stats-grid">
            {[
              { value: 4, suffix: '', label: '可视化案例', sub: '覆盖物理/化学/天文/数学' },
              { value: 20, suffix: '+', label: '交互控件', sub: '滑块/开关/按钮/选择器' },
              { value: 100, suffix: '%', label: '动态生成', sub: '任意知识点即时可视化' },
              { value: 0, suffix: 'ms', label: '响应延迟', sub: '本地渲染实时交互' },
            ].map((stat, i) => (
              <div key={i} className={`reveal stagger-${i + 1} ${statsRevealed ? 'revealed' : ''}`} style={{
                background: 'var(--bg-secondary)',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  lineHeight: 1,
                  marginBottom: 12,
                }}>
                  {stat.value === 0 ? (
                    <span style={{ color: 'var(--turquoise)' }}>&lt;1ms</span>
                  ) : (
                    <Counter end={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}>{stat.label}</div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .stats-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════
          案例区 — 4列能力卡片（TNKR风格）
          ═══════════════════════════════════════ */}
      <section id="cases-section" ref={casesRef} style={{
        position: 'relative',
        padding: 'var(--space-4xl) 0',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
        }}>
          {/* 头部 */}
          <div className={`reveal ${casesRevealed ? 'revealed' : ''}`} style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 24, height: 1, background: 'var(--accent)', opacity: 0.5 }}/>
              <span className="mono-label">CASE STUDIES // 精选案例</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}>
              四大领域，<span style={{ color: 'var(--accent)' }}>等你探索</span>
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              maxWidth: 480,
              marginTop: 12,
              lineHeight: 1.7,
            }}>
              从光的干涉到行星运行，从电解水到三角函数——每个案例都是一次完整的科学探索之旅。
            </p>
          </div>

          {/* 案例卡片网格 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
          }} className="cases-grid">
            {cases.map((c, i) => {
              const color = subjectColors[c.subject] || 'var(--accent)'
              const IconComp = Icons[c.icon] || Icons.cube
              return (
                <div
                  key={c.id}
                  className={`reveal stagger-${i + 1} ${casesRevealed ? 'revealed' : ''}`}
                  onClick={() => onOpenCase(c.id)}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: 'clamp(1.5rem, 2.5vw, 2.5rem)',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 320,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-elevated)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-secondary)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* 顶部彩色线 */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: 2,
                    background: color,
                    opacity: 0.6,
                  }}/>

                  {/* 学科标签 */}
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: color,
                    opacity: 0.8,
                    marginBottom: 20,
                  }}>
                    {c.subject.replace(' · ', ' // ')}
                  </div>

                  {/* 图标 */}
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    marginBottom: 20,
                  }}>
                    <IconComp />
                  </div>

                  {/* 标题 */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}>{c.title}</h3>

                  {/* 年级标签 */}
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                    marginBottom: 14,
                  }}>
                    GRADE: {c.grade}
                  </div>

                  {/* 描述 */}
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    flex: 1,
                  }}>{c.description}</p>

                  {/* 底部箭头 */}
                  <div style={{
                    marginTop: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: color,
                    transition: 'gap 0.3s',
                  }} className="case-arrow">
                    进入案例 <Icons.arrowRight />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <style>{`
          .cases-grid > div:hover .case-arrow { gap: 14px !important; }
          @media (max-width: 1024px) {
            .cases-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 560px) {
            .cases-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════
          榫卯展示区 — 3D分解 + 工程标注
          ═══════════════════════════════════════ */}
      <section id="sunmao-section" ref={sunmaoRef} style={{
        position: 'relative',
        padding: 'var(--space-4xl) 0',
        background: 'var(--bg-void)',
        borderTop: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}>
        {/* 背景光晕 */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 60%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}/>

        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* 头部 */}
          <div className={`reveal ${sunmaoRevealed ? 'revealed' : ''}`} style={{ marginBottom: 64, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 24, height: 1, background: 'var(--accent)', opacity: 0.5 }}/>
              <span className="mono-label">SUNMAO // 榫卯结构</span>
              <div style={{ width: 24, height: 1, background: 'var(--accent)', opacity: 0.5 }}/>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}>
              凹凸相合，<span style={{ color: 'var(--accent)' }}>浑然天成</span>
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              maxWidth: 520,
              margin: '16px auto 0',
              lineHeight: 1.7,
            }}>
              榫卯是中国传统木作的灵魂。凸为榫，凹为卯，凹凸相扣，天衣无缝——不借一钉一胶，却可历千年而不朽。
            </p>
          </div>

          {/* 3D展示 + 说明 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
          }} className="sunmao-grid">
            {/* 左侧：3D */}
            <div className={`reveal-left ${sunmaoRevealed ? 'revealed' : ''}`} style={{
              minHeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              {/* 外框 */}
              <div style={{
                position: 'absolute',
                inset: 20,
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
              }}>
                {/* 四角工程标注 */}
                <span style={{
                  position: 'absolute', top: -8, left: 12,
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                  color: 'var(--text-muted)', background: 'var(--bg-void)', padding: '0 4px',
                  letterSpacing: '0.1em',
                }}>A-01</span>
                <span style={{
                  position: 'absolute', top: -8, right: 12,
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                  color: 'var(--text-muted)', background: 'var(--bg-void)', padding: '0 4px',
                  letterSpacing: '0.1em',
                }}>A-02</span>
                <span style={{
                  position: 'absolute', bottom: -8, left: 12,
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                  color: 'var(--text-muted)', background: 'var(--bg-void)', padding: '0 4px',
                  letterSpacing: '0.1em',
                }}>B-01</span>
                <span style={{
                  position: 'absolute', bottom: -8, right: 12,
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                  color: 'var(--text-muted)', background: 'var(--bg-void)', padding: '0 4px',
                  letterSpacing: '0.1em',
                }}>B-02</span>
              </div>

              <Sunmao3D />
            </div>

            {/* 右侧：榫卯类型 */}
            <div className={`reveal-right ${sunmaoRevealed ? 'revealed' : ''}`}>
              {[
                { name: '燕尾榫', en: 'DOVETAIL JOINT', desc: '榫头呈梯形，如燕尾般相互咬合，抗拉强度极高，常用于箱体结构。' },
                { name: '直角榫', en: 'BUTT JOINT', desc: '最基本的榫卯形式，榫头垂直插入卯眼，简洁牢固，广泛用于框架连接。' },
                { name: '攒边打槽', en: 'FLOATING PANEL', desc: '将薄板嵌于边框槽内，留伸缩缝，应对木材涨缩，常用于桌面、柜门。' },
                { name: '粽角榫', en: 'MITERED TENON', desc: '三个构件于角部相交，外形如粽子棱角，用于桌案腿足与面框连接。' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '1.5rem 0',
                  borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'all 0.3s',
                  cursor: 'default',
                }} className="sunmao-item">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                    <span style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}>{item.name}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: 'var(--accent)',
                      opacity: 0.6,
                      letterSpacing: '0.1em',
                    }}>{item.en}</span>
                  </div>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .sunmao-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          }
          .sunmao-item:hover { padding-left: 8px !important; }
          .sunmao-item:hover span:first-child { color: var(--accent) !important; }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════
          探索区 — 输入框 + CTA
          ═══════════════════════════════════════ */}
      <section id="explore-section" style={{
        position: 'relative',
        padding: 'var(--space-4xl) 0',
      }}>
        <div style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          textAlign: 'center',
        }}>
          <div className="reveal">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 24, height: 1, background: 'var(--accent)', opacity: 0.5 }}/>
              <span className="mono-label">GENERATE // 动态开物</span>
              <div style={{ width: 24, height: 1, background: 'var(--accent)', opacity: 0.5 }}/>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: 16,
            }}>
              输入任意知识点，<span style={{ color: 'var(--accent)' }}>即时可视化</span>
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              marginBottom: 40,
              lineHeight: 1.7,
            }}>
              不限于预设案例——输入任何 K12 科学概念，AI 将为你生成交互式可视化演示。
            </p>
          </div>

          {/* 输入框 */}
          <div className="reveal stagger-2" style={{
            display: 'flex',
            gap: 12,
            maxWidth: 560,
            margin: '0 auto',
          }}>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDynamic()}
              placeholder="例如：牛顿第二定律、酸碱中和..."
              style={{
                flex: 1,
                padding: '0.9rem 1.2rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-display)',
                outline: 'none',
                transition: 'all 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)'
                e.target.style.boxShadow = 'none'
              }}
            />
            <button className="btn btn-primary" onClick={handleDynamic}>
              开物
            </button>
          </div>

          {/* 快捷标签 */}
          <div className="reveal stagger-3" style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 24,
          }}>
            {['自由落体', '光合作用', '电磁感应', '遗传定律'].map(tag => (
              <button
                key={tag}
                onClick={() => { setTopicInput(tag); onOpenDynamic(tag) }}
                style={{
                  padding: '0.4rem 0.9rem',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  fontFamily: 'var(--font-display)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--accent)'
                  e.target.style.color = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)'
                  e.target.style.color = 'var(--text-muted)'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 560px) {
            .explore-input-wrap { flex-direction: column !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════
          页脚 — 极简工程风
          ═══════════════════════════════════════ */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: 'var(--space-xl) 0',
        background: 'var(--bg-void)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 24, height: 24,
              border: '1px solid var(--accent)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--accent)', fontWeight: 600 }}>LB</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              鲁班开物 · K12 Science Visualization
            </span>
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}>
            V5.0 // BUILT WITH REACT + CANVAS
          </div>
        </div>
      </footer>
    </div>
  )
}
