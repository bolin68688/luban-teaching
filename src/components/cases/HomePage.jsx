import { Scale, Eye, Grid3X3, Atom, Sun, Moon, ArrowRight, Sparkles, BookOpen, Layers, Code, Zap, Heart, Star, Github, ExternalLink } from 'lucide-react'
import { cases } from '../../data/cases.js'

const iconMap = {
  'scale': Scale,
  'eye': Eye,
  'grid-3x3': Grid3X3,
  'atom': Atom
}

const features = [
  { icon: BookOpen, title: '鲁班心法', desc: '核心理论 + 生活场景，让知识点源于生活高于生活' },
  { icon: Layers, title: '鲁班开物', desc: '交互式实验控件，实时参数反馈，边学边验证' },
  { icon: Zap, title: '鲁班问答', desc: '精选练习题 + 详细解析，即时检验学习成果' },
  { icon: Heart, title: '教育严谨', desc: '公式精确、场景合理、内容经教研团队审核' }
]

const techStack = [
  { name: 'React 18', desc: '组件化前端框架' },
  { name: 'Three.js', desc: 'WebGL 3D可视化引擎' },
  { name: 'GSAP', desc: '高性能动画引擎' },
  { name: 'Vite', desc: '快速构建工具' },
  { name: 'Lucide', desc: '图标系统' },
  { name: 'Math.js', desc: '精确数学计算' }
]

function CaseCard({ caseData, onClick, index }) {
  const Icon = iconMap[caseData.icon] || Scale
  const difficultyStars = Array(3).fill(0).map((_, i) => i < caseData.difficulty ? '\u2605' : '\u2606').join('')

  return (
    <button
      onClick={() => onClick(caseData.id)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '0',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.3s var(--ease-out)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.borderColor = 'var(--accent-gold)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(201, 162, 39, 0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* 顶部彩色条纹 */}
      <div style={{
        height: '4px',
        background: caseData.id === 'lever'
          ? 'linear-gradient(90deg, #C9A227, #E5C76B)'
          : caseData.id === 'refraction'
          ? 'linear-gradient(90deg, #3B82F6, #60A5FA)'
          : caseData.id === 'equation'
          ? 'linear-gradient(90deg, #10B981, #34D399)'
          : 'linear-gradient(90deg, #8B5CF6, #A78BFA)'
      }} />

      <div style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--highlight)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon size={26} color="var(--accent-gold)" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '4px',
              fontFamily: 'var(--font-serif)'
            }}>
              {caseData.title}
            </h3>
            <div style={{
              display: 'inline-flex',
              gap: '8px',
              fontSize: '12px'
            }}>
              <span style={{
                background: 'var(--highlight)',
                padding: '2px 8px',
                borderRadius: '4px',
                color: 'var(--text-secondary)'
              }}>
                {caseData.subject}
              </span>
              <span style={{
                background: 'var(--highlight)',
                padding: '2px 8px',
                borderRadius: '4px',
                color: 'var(--text-secondary)'
              }}>
                {caseData.grade}
              </span>
            </div>
          </div>
        </div>

        {/* 引言 */}
        <div style={{
          fontSize: '13px',
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          color: 'var(--accent-gold)',
          marginBottom: '12px',
          paddingLeft: '12px',
          borderLeft: '2px solid var(--accent-gold)'
        }}>
          "{caseData.tagline}"
        </div>

        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          marginBottom: '16px'
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
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {difficultyStars}
          </span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: 'var(--accent-gold)',
            fontWeight: '500'
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
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="var(--bg-card)"/>
            <path d="M9 27L18 9L27 27" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="18" cy="20" r="3.5" fill="var(--accent-gold)"/>
            <path d="M11 23.5H25" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div>
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-primary)'
            }}>
              鲁班教学大师
            </span>
            <span style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginLeft: '8px',
              padding: '2px 6px',
              background: 'var(--highlight)',
              borderRadius: '4px'
            }}>
              v0.1.0
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '13px',
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
            <Github size={16} /> GitHub
          </a>
          <button
            onClick={onToggleTheme}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
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
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? '亮色' : '暗色'}
          </button>
        </div>
      </header>

      {/* Hero区域 */}
      <section style={{
        padding: '100px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--mortise-pattern)',
          opacity: 0.4,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)',
          opacity: 0.08,
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'var(--highlight)',
            border: '1px solid var(--border-gold)',
            borderRadius: '24px',
            marginBottom: '32px',
            fontSize: '14px',
            color: 'var(--accent-gold)'
          }}>
            <Sparkles size={18} />
            <span>K12理科可视化教育工具</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontFamily: 'var(--font-display)',
            fontWeight: '400',
            color: 'var(--text-primary)',
            marginBottom: '20px',
            lineHeight: '1.15',
            letterSpacing: '0.03em'
          }}>
            以<span style={{ color: 'var(--accent-gold)' }}>器</span>载道
            <br />
            以<span style={{ color: 'var(--accent-gold)' }}>物</span>明理
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 40px',
            lineHeight: '1.9',
            fontFamily: 'var(--font-serif)'
          }}>
            萃取春秋末期顶尖工匠鲁班的科学思想，融合K12数学、物理、化学、科学四大领域，
            用交互式3D可视化让知识点<span style={{ color: 'var(--accent-gold)', fontWeight: '500' }}>看得见、摸得着、用得上</span>。
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#cases"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                background: 'var(--accent-gold)',
                color: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s var(--ease-out)',
                boxShadow: '0 4px 20px rgba(201, 162, 39, 0.3)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(201, 162, 39, 0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(201, 162, 39, 0.3)'
              }}
            >
              探索知识点 <ArrowRight size={18} />
            </a>
            <a
              href="#about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                color: 'var(--accent-gold)',
                borderRadius: 'var(--radius-md)',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s var(--ease-out)'
              }}
            >
              了解更多
            </a>
          </div>
        </div>
      </section>

      {/* 关于项目 */}
      <section id="about" style={{
        padding: '80px 24px',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '32px',
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              关于鲁班教学大师
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.7'
            }}>
              一个开源的K12理科可视化教育工具，让抽象的知识点变得直观可触
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  textAlign: 'center',
                  transition: 'all 0.3s var(--ease-out)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-gold)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--highlight)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <f.icon size={28} color="var(--accent-gold)" />
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-serif)'
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6'
                }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 案例展示 */}
      <section id="cases" style={{
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '48px'
          }}>
            <div>
              <h2 style={{
                fontSize: '32px',
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                精选知识点
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                涵盖数学、物理、化学、科学四大领域
              </p>
            </div>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(to right, var(--border-gold), transparent)'
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px'
          }}>
            {cases.map((c, i) => (
              <div
                key={c.id}
                style={{
                  animation: `slideUp 0.5s var(--ease-out) ${i * 0.08}s forwards`,
                  opacity: 0
                }}
              >
                <CaseCard caseData={c} onClick={onOpenCase} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 技术栈 */}
      <section style={{
        padding: '80px 24px',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px',
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-primary)',
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              技术栈
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
              现代化技术选型，确保性能与开发效率
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px'
          }}>
            {techStack.map((t, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px 16px',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-gold)'
                  e.currentTarget.style.background = 'var(--bg-card-hover)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--bg-card)'
                }}
              >
                <div style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'var(--accent-gold)',
                  marginBottom: '4px'
                }}>
                  {t.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {t.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 部署信息 */}
      <section style={{
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '32px',
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            fontWeight: '600'
          }}>
            快速部署
          </h2>
          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            marginBottom: '32px'
          }}>
            只需几步，即可将项目运行起来
          </p>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 32px',
            textAlign: 'left'
          }}>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              color: 'var(--text-primary)',
              lineHeight: '1.8',
              margin: 0
            }}>
{`# 克隆项目
git clone https://github.com/your-repo/luban-teaching.git

# 进入目录
cd luban-teaching

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build`}
            </pre>
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginTop: '32px'
          }}>
            <a
              href="#"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              <Github size={18} /> 访问 GitHub
            </a>
            <a
              href="#"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'var(--accent-gold)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: 'var(--bg-primary)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              <ExternalLink size={18} /> 在线演示
            </a>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer style={{
        padding: '40px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ marginBottom: '12px' }}>
            <rect width="40" height="40" rx="8" fill="var(--bg-card)"/>
            <path d="M10 30L20 10L30 30" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="22" r="4" fill="var(--accent-gold)"/>
            <path d="M12 26H28" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{
            fontSize: '16px',
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-primary)',
            marginBottom: '4px'
          }}>
            鲁班教学大师
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            以器载道，以物明理
          </p>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Built with React + Three.js + GSAP · MIT License
        </p>
      </footer>
    </div>
  )
}
