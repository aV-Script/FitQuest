import { useEffect, useRef } from 'react'

/**
 * BrandingPanel — lato sinistro della login page.
 *
 * Struttura visiva:
 * - Logo grande con animazione
 * - Tagline che comunica il valore
 * - 3 feature highlights con icone
 * - Sfondo con pattern esagonale + glow animato
 * - Linee dati decorative in movimento (canvas)
 */
export function BrandingPanel() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animFrame

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Linee dati — ispirazione Bloomberg terminal
    const lines = Array.from({ length: 12 }, (_, i) => ({
      x:     Math.random() * canvas.width,
      y:     (canvas.height / 12) * i + Math.random() * 40,
      speed: 0.3 + Math.random() * 0.5,
      width: 40 + Math.random() * 120,
      alpha: 0.03 + Math.random() * 0.06,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      lines.forEach(line => {
        const grad = ctx.createLinearGradient(line.x, 0, line.x + line.width, 0)
        grad.addColorStop(0,   `rgba(14,196,82,0)`)
        grad.addColorStop(0.4, `rgba(14,196,82,${line.alpha})`)
        grad.addColorStop(0.6, `rgba(46,207,255,${line.alpha})`)
        grad.addColorStop(1,   `rgba(46,207,255,0)`)

        ctx.strokeStyle = grad
        ctx.lineWidth   = 1
        ctx.beginPath()
        ctx.moveTo(line.x, line.y)
        ctx.lineTo(line.x + line.width, line.y)
        ctx.stroke()

        line.x += line.speed
        if (line.x > canvas.width + 50) {
          line.x     = -line.width
          line.y     = Math.random() * canvas.height
          line.width = 40 + Math.random() * 120
        }
      })

      animFrame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const features = [
    {
      icon:  '⚡',
      title: 'Performance tracking',
      desc:  'Statistiche atletiche in tempo reale con sistema di ranking',
      color: '#0ec452',
    },
    {
      icon:  '📊',
      title: 'Analisi avanzata',
      desc:  'Percentili, grafici storici e composizione corporea BIA',
      color: '#2ecfff',
    },
    {
      icon:  '📅',
      title: 'Gestione allenamenti',
      desc:  'Calendario, presenze e ricorrenze in un unico posto',
      color: '#0ec452',
    },
  ]

  return (
    <div
      className="relative hidden lg:flex flex-col justify-between overflow-hidden"
      style={{ background: 'var(--bg-base)', padding: 48 }}
    >
      {/* Canvas linee dati */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Pattern esagonale */}
      <div className="absolute inset-0 bg-hex opacity-40 pointer-events-none" />

      {/* Glow radiale verde */}
      <div
        className="absolute pointer-events-none"
        style={{
          top:       '30%',
          left:      '20%',
          width:     400,
          height:    400,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(14,196,82,0.08) 0%, transparent 70%)',
        }}
      />
      {/* Glow radiale ciano */}
      <div
        className="absolute pointer-events-none"
        style={{
          top:       '70%',
          left:      '70%',
          width:     300,
          height:    300,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(46,207,255,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Contenuto */}
      <div className="relative z-10 flex flex-col h-full gap-0">

        {/* Logo */}
        <div className="animate-fade-up">
          <div
            className="text-gradient"
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      52,
              fontWeight:    900,
              lineHeight:    1,
              letterSpacing: '-0.04em',
              marginBottom:  8,
            }}
          >
            RankEX
          </div>
          <div
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      11,
              fontWeight:    600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color:         'var(--text-tertiary)',
            }}
          >
            Youth Soccer Project
          </div>
          <div
            style={{
              marginTop:    20,
              height:       2,
              width:        64,
              background:   'var(--gradient-primary)',
              borderRadius: 99,
            }}
          />
        </div>

        {/* Hero text */}
        <div
          className="flex-1 flex flex-col justify-center animate-fade-up"
          style={{ animationDelay: '100ms' }}
        >
          <h1
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      38,
              fontWeight:    900,
              lineHeight:    1.15,
              letterSpacing: '-0.02em',
              color:         'var(--text-primary)',
              marginBottom:  16,
              maxWidth:      380,
            }}
          >
            Trasforma i dati in{' '}
            <span className="text-gradient">performance</span>
          </h1>
          <p
            style={{
              fontSize:   15,
              color:      'var(--text-tertiary)',
              lineHeight: 1.7,
              maxWidth:   340,
            }}
          >
            La piattaforma professionale per il tracking
            atletico di accademie sportive e personal trainer.
          </p>
        </div>

        {/* Feature list */}
        <div
          className="flex flex-col gap-5 animate-fade-up"
          style={{ animationDelay: '200ms' }}
        >
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                style={{
                  width:          40,
                  height:         40,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  background:     f.color + '12',
                  border:         `1px solid ${f.color}22`,
                  borderRadius:   'var(--radius-lg)',
                  fontSize:       18,
                  flexShrink:     0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily:   'Montserrat, sans-serif',
                    fontSize:     13,
                    fontWeight:   700,
                    color:        'var(--text-primary)',
                    marginBottom: 3,
                  }}
                >
                  {f.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: '350ms', marginTop: 32 }}
        >
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', opacity: 0.5 }}>
            © {new Date().getFullYear()} RankEX — Tutti i diritti riservati
          </p>
        </div>
      </div>
    </div>
  )
}
