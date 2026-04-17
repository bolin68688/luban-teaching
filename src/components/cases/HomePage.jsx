import { Scale, Eye, Grid3X3, Atom, Sun, Moon, ArrowRight, BookOpen, Crown, Github, ExternalLink, Gem } from 'lucide-react'
import { cases } from '../../data/cases.js'

const iconMap = {
  'scale': Scale,
  'eye': Eye,
  'grid-3x3': Grid3X3,
  'atom': Atom
}

const features = [
  { icon: BookOpen, title: '鲁班心法', desc: '核心理论 · 鲁班视角解读 · 生活场景应用', color: '#D4AF37' },
  { icon: Crown, title: '鲁班开物', desc: '交互实验控件 · 实时参数反馈 · 边学边验证', color: '#E8C967' },
  { icon: Gem, title: '鲁班问答', desc: '精选练习题 · 详细解析 · 即时检验成果', color: '#C9A227' },
  { icon: BookOpen, title: '教育严谨', desc: '公式精确 · 场景合理 · 教研团队审核', color: '#A68B2D' }
]

const techStack = [
  { name: 'React 18', desc: '组件化框架', color: '#61DAFB' },
  { name: 'Three.js', desc: '3D渲染引擎', color: '#FFFFFF' },
  { name: 'GSAP', desc: '动画引擎', color: '#88CE02' },
  { name: 'Vite', desc: '构建工具', color: '#646CFF' },
  { name: 'Canvas', desc: '2D可视化', color: '#E8C967' },
  { name: 'Math.js', desc: '精确计算', color: '#D4AF37' }
]

function MortiseDecor({ style }) {
  return (
    <svg style={{ position: 'absolute', pointerEvents: 'none', ...style }} width="100" height="100" viewBox="0 0 100 100" fill="none">
      <g opacity="0.12">
        <path d="M0 35 L35 35 L35 30 L5 30 L5 5 L35 5 L35 0" stroke="var(--accent-gold)" strokeWidth="0.5" fill="none"/>
        <circle cx="17" cy="17" r="10" stroke="var(--accent-gold)" strokeWidth="0.4" fill="none"/>
        <circle cx="17" cy="17" r="5" stroke="var(--accent-gold)" strokeWidth="0.4" fill="none"/>
      </g>
      <g opacity="0.08" transform="translate(100, 100) rotate(180)">
        <path d="M0 35 L35 35 L35 30 L5 30 L5 5 L35 5 L35 0" stroke="var(--accent-gold)" strokeWidth="0.5" fill="none"/>
        <circle cx="17" cy="17" r="10" stroke="var(--accent-gold)" strokeWidth="0.4" fill="none"/>
      </g>
    </svg>
  )
}

function CaseCard({ caseData, onClick, index }) {
  const Icon = iconMap[caseData.icon] || Scale
  const colors = {
    lever: { primary: '#D4AF37', secondary: '#E8C967', gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)' },
    refraction: { primary: '#4A9FD4', secondary: '#7BC4F0', gradient: 'linear-gradient(135deg, #4A9FD4 0%, #2D7FAD 100%)' },
    equation: { primary: '#50C878', secondary: '#7DE89A', gradient: 'linear-gradient(135deg, #50C878 0%, #3AA85D 100%)' },
    periodic: { primary: '#9B6BD4', secondary: '#C4A0F0', gradient: 'linear-gradient(135deg, #9B6BD4 0%, #7A4FB8 100%)' }
  }
  const color = colors[caseData.id] || colors.lever

  return (
    <button
      onClick={() => onClick(caseData.id)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.4s var(--ease-out)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.borderColor = color.primary + '60'
        e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.5), 0 0 50px ${color.primary}20`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* 顶部渐变条 */}
      <div style={{ height: '3px', background: color.gradient }} />

      {/* 角落光晕 */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '80px',
        background: `radial-gradient(circle at top right, ${color.primary}20 0%, transparent 70%)`
      }} />

      <div style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '18px' }}>
          {/* 图标 */}
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: 'var(--radius-md)',
            background: `linear-gradient(135deg, ${color.primary}18 0%, ${color.secondary}08 100%)`,
            border: `1px solid ${color.primary}35`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 6px 24px ${color.primary}15`
          }}>
            <Icon size={28} color={color.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '6px',
              fontFamily: 'var(--font-serif)'
            }}>
              {caseData.title}
            </h3>
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
              <span style={{
                background: `${color.primary}15`,
                padding: '3px 10px',
                borderRadius: '20px',
                color: color.primary,
                fontWeight: '500',
                border: `1px solid ${color.primary}30`
              }}>
                {caseData.subject}
              </span>
              <span style={{
                background: 'var(--highlight)',
                padding: '3px 10px',
                borderRadius: '20px',
                color: 'var(--text-secondary)'
              }}>
                {caseData.grade}
              </span>
            </div>
          </div>
        </div>

        {/* 引言 */}
        <div style={{
          position: 'relative',
          padding: '14px 16px',
          marginBottom: '14px',
          background: `linear-gradient(135deg, ${color.primary}08 0%, transparent 100%)`,
          borderRadius: 'var(--radius-md)',
          borderLeft: `3px solid ${color.primary}`
        }}>
          <span style={{
            fontSize: '32px',
            fontFamily: 'Georgia, serif',
            color: `${color.primary}40`,
            position: 'absolute',
            top: '0',
            left: '10px',
            lineHeight: 1
          }}>"</span>
          <p style={{
            fontSize: '13px',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            color: color.primary,
            paddingLeft: '16px',
            margin: 0
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
          paddingTop: '18px',
          borderTop: '1px solid var(--border)'
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>难度等级</span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '15px',
            fontWeight: '600',
            background: color.gradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            开始探索 <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </button>
  )
}

export default function HomePage({ onOpenCase, theme, onToggleTheme }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* 导航栏 */}
      <header style={{
        padding: '18px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-gold-light)" />
                  <stop offset="100%" stopColor="var(--accent-gold-dark)" />
                </linearGradient>
              </defs>
              <rect width="44" height="44" rx="10" fill="var(--bg-card)" stroke="var(--border-gold)" strokeWidth="0.5"/>
              <path d="M11 33L22 11L33 33" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="22" cy="25" r="4" fill="url(#logoGrad)"/>
              <path d="M13 29H31" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '16px',
              background: 'var(--accent-gold)',
              opacity: 0.08,
              filter: 'blur(10px)',
              zIndex: -1
            }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontSize: '20px',
                fontWeight: '600',
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
                letterSpacing: '0.05em'
              }}>
                鲁班教学大师
              </span>
              <span style={{
                fontSize: '10px',
                color: 'var(--accent-gold)',
                padding: '3px 8px',
                background: 'var(--highlight)',
                borderRadius: '20px',
                fontWeight: '600',
                letterSpacing: '0.1em',
                border: '1px solid var(--border-gold)'
              }}>
                v0.1.0
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              K12理科可视化教育平台
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="https://github.com/bolin68688/luban-teaching"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.3s var(--ease-out)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--highlight)'
              e.currentTarget.style.borderColor = 'var(--accent-gold)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-card)'
              e.currentTarget.style.borderColor = 'var(--border-gold)'
            }}
          >
            <Github size={16} /> GitHub
          </a>
          <button
            onClick={onToggleTheme}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              transition: 'all 0.3s var(--ease-out)'
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
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? '亮色' : '暗色'}
          </button>
        </div>
      </header>

      {/* Hero区域 */}
      <section style={{
        padding: '120px 24px 100px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--mortise-pattern)', opacity: 0.5 }} />
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '350px',
          background: 'radial-gradient(ellipse, var(--accent-gold-glow) 0%, transparent 70%)',
          opacity: 0.12,
          filter: 'blur(60px)'
        }} />
        <MortiseDecor style={{ top: '6%', left: '6%' }} />
        <MortiseDecor style={{ bottom: '8%', right: '6%' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
          {/* 主题标签 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
            <div style={{ width: '50px', height: '1px', background: 'var(--accent-gold)' }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 28px',
              background: 'linear-gradient(135deg, var(--highlight) 0%, transparent 100%)',
              border: '1px solid var(--border-gold)',
              borderRadius: '30px'
            }}>
              <Crown size={18} color="var(--accent-gold)" />
              <span style={{
                fontSize: '16px',
                fontFamily: 'var(--font-display)',
                color: 'var(--accent-gold)',
                letterSpacing: '0.15em'
              }}>
                鲁班开物
              </span>
              <Gem size={16} color="var(--accent-gold-light)" />
            </div>
            <div style={{ width: '50px', height: '1px', background: 'var(--accent-gold)' }} />
          </div>

          {/* 主标题 - 并排 */}
          <h1 style={{
            fontSize: 'clamp(44px, 9vw, 88px)',
            fontFamily: 'var(--font-display)',
            fontWeight: '400',
            marginBottom: '40px',
            lineHeight: '1.1',
            letterSpacing: '0.08em',
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(24px, 5vw, 70px)'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-gold-light) 0%, var(--accent-gold) 50%, var(--accent-gold-dark) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 12px var(--accent-gold-glow))'
            }}>
              以器载道
            </span>
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-gold-light) 0%, var(--accent-gold) 50%, var(--accent-gold-dark) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 12px var(--accent-gold-glow))'
            }}>
              以物明理
            </span>
          </h1>

          {/* 副标题 */}
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto 50px',
            lineHeight: '2',
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.02em'
          }}>
            萃取春秋末期顶尖工匠
            <span style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>鲁班</span>
            的科学思想，融合K12数学、物理、化学、科学四大领域，
            用交互式可视化让知识点
            <span style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>看得见、摸得着、用得上</span>。
          </p>

          {/* 按钮 */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#cases"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 40px',
                background: 'var(--gold-gradient)',
                color: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '16px',
                fontWeight: '700',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                transition: 'all 0.3s var(--ease-out)',
                boxShadow: '0 4px 25px var(--accent-gold-glow)'
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
              探索知识点 <ArrowRight size={18} />
            </a>
            <a
              href="https://github.com/bolin68688/luban-teaching"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 40px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                color: 'var(--accent-gold)',
                borderRadius: 'var(--radius-md)',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s var(--ease-out)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--highlight)'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg-card)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Github size={18} /> 查看源码
            </a>
          </div>
        </div>
      </section>

      {/* 特色板块 */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--border-gold)' }} />
              <span style={{ fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.25em', fontWeight: '600' }}>CORE FEATURES</span>
              <div style={{ width: '40px', height: '1px', background: 'var(--border-gold)' }} />
            </div>
            <h2 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.1em' }}>
              教学特色
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              以鲁班工匠精神打造高质量理科教学体验
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px',
                  textAlign: 'center',
                  transition: 'all 0.4s var(--ease-out)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-gold-hover)'
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 35px ${f.color}15`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-md)',
                  background: `linear-gradient(135deg, ${f.color}15 0%, ${f.color}05 100%)`,
                  border: `1px solid ${f.color}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: `0 8px 30px ${f.color}12`
                }}>
                  <f.icon size={30} color={f.color} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 案例展示 */}
      <section id="cases" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '56px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '30px', height: '1px', background: 'var(--accent-gold)' }} />
                <span style={{ fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.25em', fontWeight: '600' }}>EXPLORE</span>
              </div>
              <h2 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '0.1em', marginBottom: '8px' }}>
                精选知识点
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>涵盖数学 · 物理 · 化学 · 科学四大领域</p>
            </div>
            <div style={{ width: '200px', height: '1px', background: 'linear-gradient(to right, var(--border-gold), transparent)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            {cases.map((c, i) => (
              <div key={c.id} style={{ animation: `slideUp 0.6s var(--ease-out) ${i * 0.1}s forwards`, opacity: 0 }}>
                <CaseCard caseData={c} onClick={onOpenCase} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 技术栈 */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--border-gold)' }} />
              <span style={{ fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.25em', fontWeight: '600' }}>TECH STACK</span>
              <div style={{ width: '40px', height: '1px', background: 'var(--border-gold)' }} />
            </div>
            <h2 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '0.1em', marginBottom: '12px' }}>
              技术栈
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>现代化技术选型，确保性能与开发效率</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            {techStack.map((t, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px 20px',
                  textAlign: 'center',
                  transition: 'all 0.3s var(--ease-out)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = t.color + '50'
                  e.currentTarget.style.background = t.color + '08'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--bg-card)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: '700', color: t.color, marginBottom: '6px', letterSpacing: '0.05em' }}>{t.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 快速部署 */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--border-gold)' }} />
            <span style={{ fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.25em', fontWeight: '600' }}>QUICK START</span>
            <div style={{ width: '40px', height: '1px', background: 'var(--border-gold)' }} />
          </div>
          <h2 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '0.1em', marginBottom: '16px' }}>
            快速部署
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '40px' }}>只需几步，即可将项目运行起来</p>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 36px',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gold-gradient)' }} />
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-primary)', lineHeight: '2', margin: 0 }}>
{`# 克隆项目
git clone https://github.com/bolin68688/luban-teaching.git
cd luban-teaching

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build`}
            </pre>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
            <a
              href="https://github.com/bolin68688/luban-teaching"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-gold)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s var(--ease-out)'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--highlight)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Github size={18} /> 访问 GitHub
            </a>
            <a
              href="https://bolin68688.github.io/luban-teaching"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                background: 'var(--gold-gradient)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: 'var(--bg-primary)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '700',
                transition: 'all 0.3s var(--ease-out)',
                boxShadow: '0 4px 20px var(--accent-gold-glow)'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px var(--accent-gold-glow)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--accent-gold-glow)'; }}
            >
              <ExternalLink size={18} /> 在线演示
            </a>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer style={{
        padding: '60px 24px 40px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '300px', height: '1px', background: 'linear-gradient(to right, transparent, var(--accent-gold), transparent)' }} />
        <div style={{ marginBottom: '24px' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: '16px' }}>
            <rect width="48" height="48" rx="12" fill="var(--bg-card)" stroke="var(--border-gold)" strokeWidth="0.5"/>
            <path d="M12 36L24 12L36 36" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="24" cy="28" r="4.5" fill="var(--accent-gold)"/>
            <path d="M14 32H34" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '0.1em' }}>
            鲁班教学大师
          </h3>
          <p style={{ fontSize: '14px', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)' }}>
            以器载道 · 以物明理
          </p>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Built with React + Three.js + GSAP · MIT License
        </p>
      </footer>
    </div>
  )
}
