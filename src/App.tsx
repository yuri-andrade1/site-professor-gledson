import { useEffect, useRef, useState } from 'react'

/* ─── Scroll reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ─── Parallax hook ─── */
function useParallax(ref: React.RefObject<HTMLElement | null>, strength = 0.15) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2
      const calculated = Math.max(-50, Math.min(50, mid * strength))
      setOffset(calculated)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref, strength])
  return offset
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const dur = 1400
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1)
          const ease = 1 - Math.pow(1 - t, 3)
          setVal(Math.round(ease * target))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ─── Social data ─── */
const SOCIALS = [
  {
    name: 'YouTube',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    href: 'https://youtube.com',
    label: 'Canal no YouTube',
    color: '#FF0000',
  },
  {
    name: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
    href: 'https://instagram.com',
    label: 'Instagram',
    color: '#E1306C',
  },
  {
    name: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    href: 'https://facebook.com',
    label: 'Facebook',
    color: '#1877F2',
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    color: '#0A66C2',
  },
]

const AREAS = [
  { n: '01', t: 'Filosofia', d: 'Ética, epistemologia e filosofia da educação como fundamentos do pensamento crítico.' },
  { n: '02', t: 'Sociologia', d: 'Análise das estruturas sociais e dinâmicas de poder na sociedade contemporânea.' },
  { n: '03', t: 'Teologia', d: 'Reflexão teológica interdisciplinar em diálogo com filosofia e ciências humanas.' },
  { n: '04', t: 'Política', d: 'Teoria política, cidadania e os fundamentos do Estado democrático de direito.' },
  { n: '05', t: 'História', d: 'Pensamento histórico crítico e sua relação com a consciência coletiva.' },
  { n: '06', t: 'Pedagogia', d: 'Educação humanista, mediação de conhecimento e desenvolvimento integral do estudante.' },
]

const MARQUEE_TEXT = 'FILOSOFIA · SOCIOLOGIA · TEOLOGIA · HISTÓRIA · POLÍTICA · PEDAGOGIA · ÉTICA · ENSINO CRÍTICO · '

export default function App() {
  useReveal()
  const heroRef = useRef<HTMLElement>(null)
  const heroOffset = useParallax(heroRef, 0.25)

  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navOpaque = scrollY > 80

  return (
    <div style={{ background: '#080705', color: '#f0ebe2', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav className="nav-container" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 3rem',
        background: navOpaque ? 'rgba(8,7,5,0.95)' : 'transparent',
        borderBottom: navOpaque ? '1px solid rgba(29,112,162,0.25)' : 'none',
        backdropFilter: navOpaque ? 'blur(12px)' : 'none',
        transition: 'background 0.4s, border-color 0.4s',
      }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.08em', color: '#1d70a2' }}>
          PROF. GLEDSON
        </span>
        <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {['Sobre', 'Formação', 'Áreas', 'Contato'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace('ã','a').replace('ç','c')}`}
              className="nav-link"
              style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'rgba(240,235,226,0.6)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1d70a2')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,235,226,0.6)')}
            >{l.toUpperCase()}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', background: '#080705' }}>
        {/* BG image wrapper with vertical overflow */}
        <div style={{ position: 'absolute', top: '-15%', left: 0, right: 0, bottom: '-15%', transform: `translateY(${heroOffset}px)`, pointerEvents: 'none' }}>
          <img
            src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=1400&h=900&fit=crop&auto=format"
            alt="Professor palestrando para plateia"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(40%)' }}
          />
        </div>

        {/* Fixed Gradient overlays (stay pinned to section boundaries so scrolling never reveals image bottom) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to top, #080705 25%, rgba(8,7,5,0.6) 60%, rgba(8,7,5,0.2) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to right, rgba(8,7,5,0.7) 0%, transparent 65%)' }} />

        {/* Ocean blue accent line top */}
        <div className="reveal reveal-fade hero-line delay-1" style={{ position: 'absolute', top: 0, left: '3rem', width: 1, height: '35vh', background: 'linear-gradient(to bottom, transparent, #1d70a2, transparent)' }} />

        {/* Main text block */}
        <div className="hero-container" style={{ position: 'relative', zIndex: 2, padding: '0 3rem 6rem', maxWidth: 900 }}>
          <div className="reveal reveal-up delay-1" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#1d70a2', marginBottom: '1.5rem' }}>
            PROFESSOR · FILÓSOFO · PALESTRANTE
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', lineHeight: 0.95, marginBottom: '2rem' }}>
            <span className="reveal reveal-up delay-1" style={{ display: 'block', fontSize: 'clamp(2.8rem, 8vw, 8.5rem)', fontWeight: 900, color: '#f0ebe2', letterSpacing: '-0.02em' }}>
              Gledson
            </span>
            <span className="reveal reveal-up delay-2" style={{ display: 'block', fontSize: 'clamp(2.4rem, 8vw, 8.5rem)', fontWeight: 300, fontStyle: 'italic', color: '#1d70a2', letterSpacing: '-0.02em', wordBreak: 'break-word' }}>
              Albuquerque
            </span>
          </h1>
          <p className="reveal reveal-up delay-3" style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(240,235,226,0.6)', maxWidth: 520, fontWeight: 300, marginBottom: '2.5rem' }}>
            Filósofo, sociólogo e educador dedicado à docência, à pesquisa e ao desenvolvimento do pensamento crítico.
          </p>
          <div className="reveal reveal-up delay-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#sobre"
              style={{ padding: '0.9rem 2.2rem', background: '#1d70a2', color: '#ffffff', textDecoration: 'none', fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 700, transition: 'background 0.2s, transform 0.2s', display: 'inline-block' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#3498db'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1d70a2'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              CONHEÇA O PROFESSOR
            </a>
            <a href="#contato"
              style={{ padding: '0.9rem 2.2rem', border: '1px solid rgba(29,112,162,0.5)', color: '#1d70a2', textDecoration: 'none', fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 500, transition: 'border-color 0.2s, background 0.2s', display: 'inline-block' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1d70a2'; e.currentTarget.style.background = 'rgba(29,112,162,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(29,112,162,0.5)'; e.currentTarget.style.background = 'transparent' }}
            >
              REDES SOCIAIS
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="reveal reveal-fade hero-scroll delay-5" style={{ position: 'absolute', bottom: '2rem', right: '3rem', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(240,235,226,0.3)', writingMode: 'vertical-lr' }}>SCROLL</span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(29,112,162,0.6), transparent)' }} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: '#1d70a2', overflow: 'hidden', height: 44, display: 'flex', alignItems: 'center' }}>
        <div className="marquee-track" style={{ display: 'flex', whiteSpace: 'nowrap', gap: 0 }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: '#ffffff', fontWeight: 600, paddingRight: '2rem' }}>
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* ── SOBRE ── */}
      <section id="sobre" className="section-padding" style={{ padding: '8rem 3rem', background: '#0d0b09', position: 'relative' }}>
        <div className="grid-2col" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          {/* Image col */}
          <div className="reveal reveal-left" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=700&h=850&fit=crop&auto=format"
                alt="Ambiente de ensino filosófico"
                className="about-img"
                style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block', filter: 'grayscale(20%)' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(29,112,162,0.2) 0%, transparent 60%)' }} />
            </div>
            {/* Floating label */}
            <div className="badge-floating" style={{ position: 'absolute', bottom: -24, right: -24, background: '#1d70a2', padding: '1.5rem 2rem', minWidth: 180 }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>15<span style={{ fontSize: '1.2rem' }}>+</span></div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.85)', marginTop: '0.25rem', fontWeight: 600 }}>ANOS DE DOCÊNCIA</div>
            </div>
          </div>
          {/* Text col */}
          <div>
            <div className="reveal reveal-up delay-1" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.18em', color: '#1d70a2', marginBottom: '1.5rem' }}>§ 001 — SOBRE</div>
            <h2 className="reveal reveal-up delay-2" style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '2rem', color: '#f0ebe2' }}>
              Filósofo,<br />
              <em style={{ fontStyle: 'italic', color: '#1d70a2', fontWeight: 300 }}>educador</em><br />
              e pensador
            </h2>
            <div className="reveal reveal-up delay-2 line-grow" style={{ height: 1, background: 'rgba(29,112,162,0.4)', marginBottom: '2rem', transformOrigin: 'left' }} />
            <p className="reveal reveal-up delay-3" style={{ fontSize: '1rem', lineHeight: 1.85, color: 'rgba(240,235,226,0.65)', marginBottom: '1.25rem', fontWeight: 300 }}>
              Graduado em <strong style={{ color: '#f0ebe2', fontWeight: 400 }}>Filosofia pelo Instituto Teológico-Pastoral do Ceará</strong> (2008) e pós-graduado em <strong style={{ color: '#f0ebe2', fontWeight: 400 }}>Administração Escolar pela UVA</strong> (2013).
            </p>
            <p className="reveal reveal-up delay-4" style={{ fontSize: '1rem', lineHeight: 1.85, color: 'rgba(240,235,226,0.65)', fontWeight: 300 }}>
              Docente e palestrante em encontros pedagógicos e acadêmicos nas áreas de Filosofia, Sociologia, Política, História e Teologia, promovendo o pensamento crítico e a formação humana.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section-padding-sm" style={{ background: '#080705', borderTop: '1px solid rgba(29,112,162,0.15)', borderBottom: '1px solid rgba(29,112,162,0.15)', padding: '4rem 3rem' }}>
        <div className="grid-3col" style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { num: 2008, suffix: '', label: 'Ano de Graduação', sub: 'Filosofia — ITEPA·CE' },
            { num: 15, suffix: '+', label: 'Anos de Docência', sub: 'Filosofia & Sociologia' },
            { num: 6, suffix: '', label: 'Áreas de Atuação', sub: 'Acadêmica & Pedagógica' },
          ].map((s, i) => (
            <div key={i} className="reveal reveal-up stat-card" style={{ padding: '2.5rem 1.5rem', borderRight: i < 2 ? '1px solid rgba(29,112,162,0.15)' : 'none', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 900, color: '#1d70a2', lineHeight: 1, marginBottom: '0.5rem' }}>
                <Counter target={s.num} suffix={s.suffix} />
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(240,235,226,0.7)', marginBottom: '0.25rem' }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(240,235,226,0.3)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORMAÇÃO ── */}
      <section id="formacao" className="section-padding" style={{ padding: '8rem 3rem', background: '#0d0b09', position: 'relative', overflow: 'hidden' }}>
        {/* Big background number */}
        <div className="bg-big-number" style={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', fontFamily: 'Fraunces, serif', fontSize: '20rem', fontWeight: 900, color: 'rgba(29,112,162,0.04)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>002</div>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="reveal reveal-up" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.18em', color: '#1d70a2', marginBottom: '1rem' }}>§ 002 — FORMAÇÃO</div>
          <h2 className="reveal reveal-up delay-1" style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: '5rem', color: '#f0ebe2' }}>
            Trajetória<br /><em style={{ fontStyle: 'italic', color: 'rgba(240,235,226,0.35)', fontWeight: 300 }}>acadêmica</em>
          </h2>
          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'rgba(29,112,162,0.25)' }} />
            {[
              { year: '2008', degree: 'Graduação em Filosofia', inst: 'Instituto Teológico-Pastoral do Ceará', detail: 'Base filosófica, ética e epistemológica que fundamenta toda a trajetória intelectual.' },
              { year: '2013', degree: 'Pós-Graduação em Administração Escolar', inst: 'Universidade Estadual Vale do Acaraú — UVA', detail: 'Especialização em gestão educacional, políticas institucionais e liderança pedagógica.' },
            ].map((item, i) => (
              <div key={i} className={`reveal reveal-up timeline-item delay-${i + 2}`} style={{ paddingLeft: '3.5rem', marginBottom: '4.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: -6, top: 8, width: 12, height: 12, background: '#1d70a2', borderRadius: '50%', boxShadow: '0 0 20px rgba(29,112,162,0.6)' }} />
                <div className="timeline-year-bg" style={{ fontFamily: 'Fraunces, serif', fontSize: '5rem', fontWeight: 900, color: 'rgba(29,112,162,0.14)', lineHeight: 1, marginBottom: '-1rem', userSelect: 'none' }}>{item.year}</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#1d70a2', marginBottom: '0.75rem' }}>{item.year}</div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 700, color: '#f0ebe2', marginBottom: '0.5rem', lineHeight: 1.15 }}>{item.degree}</h3>
                <p style={{ color: 'rgba(240,235,226,0.45)', fontSize: '0.875rem', marginBottom: '0.75rem', fontWeight: 400 }}>{item.inst}</p>
                <p style={{ color: 'rgba(240,235,226,0.5)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 540, fontWeight: 300 }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÁREAS ── */}
      <section id="areas" className="section-padding" style={{ padding: '8rem 3rem', background: '#080705', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal reveal-up" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.18em', color: '#1d70a2', marginBottom: '1rem' }}>§ 003 — ÁREAS</div>
          <h2 className="reveal reveal-up delay-1" style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: '4rem', color: '#f0ebe2' }}>
            Campos de<br /><em style={{ fontStyle: 'italic', color: 'rgba(240,235,226,0.35)', fontWeight: 300 }}>atuação</em>
          </h2>
          <div style={{ display: 'grid', gap: 0 }}>
            {AREAS.map((a, i) => (
              <AreaRow key={a.n} area={a} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PENSAMENTO & VOCAÇÃO ── */}
      <section style={{ position: 'relative', minHeight: '55vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&h=700&fit=crop&auto=format"
            alt="Ambiente de reflexão e ensino"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,7,5,0.85)' }} />
        </div>
        <div className="grid-2col" style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '6rem 3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div className="reveal reveal-up" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.18em', color: '#1d70a2', marginBottom: '1.5rem' }}>COMPROMISSO PEDAGÓGICO</div>
            <h2 className="reveal reveal-up delay-1" style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 700, lineHeight: 1.1, color: '#f0ebe2' }}>
              Educação para o<br />
              <em style={{ fontStyle: 'italic', color: '#1d70a2', fontWeight: 300 }}>pensamento crítico</em><br />
              e humanista
            </h2>
          </div>
          <div className="reveal reveal-right delay-2">
            <p style={{ fontSize: '1rem', lineHeight: 1.85, color: 'rgba(240,235,226,0.6)', fontWeight: 300 }}>
              Promovendo a reflexão filosófica e a consciência social como pilares para a transformação de alunos e educadores, unindo rigor acadêmico e formação humana integral.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTATO / SOCIAIS ── */}
      <section id="contato" className="section-padding" style={{ padding: '8rem 3rem', background: '#0d0b09', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -100, bottom: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,112,162,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="reveal reveal-up" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.18em', color: '#1d70a2', marginBottom: '1rem' }}>§ 004 — CONTATO</div>
          <h2 className="reveal reveal-up delay-1" style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', fontWeight: 700, lineHeight: 1.0, marginBottom: '1.5rem', color: '#f0ebe2' }}>
            Conecte-se<br /><em style={{ fontStyle: 'italic', color: 'rgba(240,235,226,0.25)', fontWeight: 300 }}>e acompanhe</em>
          </h2>
          <p className="reveal reveal-up delay-2" style={{ fontSize: '1rem', lineHeight: 1.8, color: 'rgba(240,235,226,0.5)', maxWidth: 480, fontWeight: 300, marginBottom: '4rem' }}>
            Acompanhe o trabalho do Prof. Gledson nas redes sociais e no canal do YouTube, onde compartilha reflexões filosóficas, pedagógicas e culturais.
          </p>

          {/* Social cards */}
          <div className="social-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '4rem' }}>
            {SOCIALS.map((s, i) => (
              <SocialCard key={s.name} social={s} delay={i} />
            ))}
          </div>

          {/* Info strip */}
          <div className="reveal reveal-up info-strip delay-4" style={{ borderTop: '1px solid rgba(29,112,162,0.18)', paddingTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[
              { l: 'ATUAÇÃO', v: 'Docência & Palestras' },
              { l: 'CIDADE', v: 'Fortaleza, Ceará — Brasil' },
              { l: 'ÁREA', v: 'Filosofia & Ciências Humanas' },
            ].map(item => (
              <div key={item.l}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#1d70a2', marginBottom: '0.5rem' }}>{item.l}</div>
                <div style={{ color: 'rgba(240,235,226,0.65)', fontSize: '0.9rem' }}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-container" style={{ background: '#040302', borderTop: '1px solid rgba(29,112,162,0.12)', padding: '2.5rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 700, color: '#1d70a2', marginBottom: '0.25rem' }}>Prof. Gledson de Oliveira Albuquerque</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(240,235,226,0.3)' }}>FILÓSOFO · SOCIÓLOGO · EDUCADOR</div>
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(240,235,226,0.2)' }}>
          FORTALEZA · CE · BRASIL
        </div>
      </footer>
    </div>
  )
}

/* ─── Area row ─── */
function AreaRow({ area, delay }: { area: typeof AREAS[0]; delay: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`reveal reveal-up area-row delay-${Math.min(delay + 2, 6)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '2.5rem', alignItems: 'center',
        padding: '2rem 0',
        borderBottom: '1px solid rgba(29,112,162,0.15)',
        transition: 'padding 0.3s',
        paddingLeft: hovered ? '1rem' : 0,
        cursor: 'default',
      }}
    >
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: hovered ? '#1d70a2' : 'rgba(29,112,162,0.45)', letterSpacing: '0.1em', transition: 'color 0.3s' }}>{area.n}</div>
      <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: hovered ? '#1d70a2' : '#f0ebe2', transition: 'color 0.3s' }}>{area.t}</h3>
      <p className="area-desc" style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(240,235,226,0.4)', fontWeight: 300, opacity: hovered ? 1 : 0.6, transition: 'opacity 0.3s' }}>{area.d}</p>
    </div>
  )
}

/* ─── Social card ─── */
function SocialCard({ social, delay }: { social: typeof SOCIALS[0]; delay: number }) {
  const [hovered, setHovered] = useState(false)
  const isYT = social.name === 'YouTube'
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`reveal reveal-up delay-${delay + 2}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '1.25rem',
        padding: '1.5rem 1.75rem',
        border: `1px solid ${hovered ? social.color + '66' : 'rgba(29,112,162,0.18)'}`,
        background: hovered ? social.color + '0d' : 'transparent',
        textDecoration: 'none',
        transition: 'border-color 0.25s, background 0.25s, transform 0.25s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        ...(isYT && hovered ? { animation: 'glowPulse 2s ease infinite' } : {}),
      }}
    >
      <div style={{
        width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? social.color + '22' : 'rgba(29,112,162,0.1)',
        flexShrink: 0,
        transition: 'background 0.25s',
        color: hovered ? social.color : '#1d70a2',
      }}>
        {social.icon}
      </div>
      <div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.05rem', fontWeight: 700, color: hovered ? '#f0ebe2' : 'rgba(240,235,226,0.7)', marginBottom: '0.2rem', transition: 'color 0.25s' }}>{social.label}</div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.12em', color: hovered ? social.color : 'rgba(240,235,226,0.3)', transition: 'color 0.25s' }}>
          {isYT ? 'INSCREVA-SE NO CANAL' : `SEGUIR NO ${social.name.toUpperCase()}`}
        </div>
      </div>
      <div style={{ marginLeft: 'auto', color: hovered ? social.color : 'rgba(240,235,226,0.2)', transition: 'color 0.25s, transform 0.25s', transform: hovered ? 'translateX(4px)' : 'translateX(0)' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </a>
  )
}
