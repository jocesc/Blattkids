import Link from 'next/link'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'
import { products } from '@/lib/products'

const featured = products.filter(p => p.featured)

const pillars = [
  {
    n: '01',
    title: 'Independencia',
    text: 'Cada pieza está pensada para que el niño la use solo — sin ayuda del adulto. Medidas exactas para cada etapa.',
  },
  {
    n: '02',
    title: 'Materiales reales',
    text: 'Madera maciza, cera de abeja, aceite de linaza. Sin plásticos, pinturas sintéticas ni tóxicos de ningún tipo.',
  },
  {
    n: '03',
    title: 'Medidas certificadas',
    text: 'Cada dimensión proviene de la tabla antropométrica Montessori certificada. No son estimaciones — son datos.',
  },
]

const TICKER = [
  '✦ Madera natural',
  '· Medidas Montessori',
  '· EN 71-1 · ASTM F963',
  '· Hecho en Chile',
  '· Cera de abeja',
  '· 0 a 10 años',
  '· Sin plásticos ni tóxicos',
  '· Fabricación a pedido',
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      {/* ── Ticker strip ────────────────────────────────────────── */}
      <div className="bg-[#1A0F07] overflow-hidden py-2.5 shrink-0">
        <div style={{ animation: 'marquee 30s linear infinite', width: 'max-content' }}
          className="flex items-center">
          {[0, 1].map(rep => (
            <div key={rep} className="flex items-center">
              {TICKER.map((item, i) => (
                <span key={i} className="text-white/40 text-[11px] tracking-widest mx-7 shrink-0 uppercase">
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative bg-cream overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-40 -top-40 w-[520px] h-[520px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,146,74,0.08) 0%, transparent 70%)' }} />
        <div className="pointer-events-none absolute -left-20 bottom-0 w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(122,158,126,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 lg:py-32
                        grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14 items-center">

          {/* Left: content */}
          <div>
            {/* Pill label */}
            <div className="animate-fade-up inline-flex items-center gap-2 bg-white border border-[#E2D5C3] rounded-full px-4 py-2 mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8924A]" />
              <span className="text-xs text-[#5C4033] font-medium tracking-wide">
                Muebles Montessori · 0 a 10 años
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up animate-fade-up-delay-1 font-bold leading-[0.90] tracking-[-0.03em] text-[#1A0F07]
                           text-[52px] sm:text-[64px] md:text-[76px] lg:text-[84px]"
              style={{ fontFamily: 'var(--font-display)' }}>
              Muebles<br />
              que crecen<br />
              <em className="not-italic" style={{ color: '#C8924A' }}>con tu hijo.</em>
            </h1>

            <p className="animate-fade-up animate-fade-up-delay-2 text-base md:text-lg text-[#5C4033] leading-relaxed
                          max-w-[440px] mt-7 mb-9">
              Diseñados con medidas certificadas para favorecer la independencia
              y el desarrollo natural. Madera real, sin plásticos.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up animate-fade-up-delay-2 flex flex-wrap gap-3 mb-10">
              <Link href="/catalogo"
                className="bg-[#1A0F07] text-white px-7 py-3.5 rounded-xl text-sm font-semibold
                           hover:bg-[#5C4033] transition-colors">
                Explorar catálogo
              </Link>
              <Link href="/nosotros"
                className="border border-[#E2D5C3] text-[#1A0F07] px-7 py-3.5 rounded-xl text-sm font-medium
                           hover:border-[#C8924A] hover:text-[#C8924A] transition-colors">
                Nuestra historia
              </Link>
            </div>

            {/* Trust pills */}
            <div className="animate-fade-up animate-fade-up-delay-3 flex flex-wrap gap-2">
              {[
                '🌿 Madera natural',
                '📐 Medidas certificadas',
                '🛡 Sin tóxicos',
                '🇨🇱 Hecho en Chile',
              ].map(s => (
                <span key={s}
                  className="text-[11px] text-[#5C4033] bg-white border border-[#E2D5C3] rounded-full px-3 py-1.5 tracking-wide">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Right: scattered product cards */}
          <div className="hidden lg:block relative" style={{ height: 440 }}>
            {featured.slice(0, 3).map((p, i) => {
              const pos: React.CSSProperties[] = [
                { position: 'absolute', top: 0,   left: 0,   width: 192, transform: 'rotate(-2deg)',  zIndex: 3 },
                { position: 'absolute', top: 48,  right: 0,  width: 185, transform: 'rotate(2.5deg)', zIndex: 2 },
                { position: 'absolute', bottom: 0, left: 36, width: 196, transform: 'rotate(-1deg)',  zIndex: 1 },
              ]
              return (
                <Link key={p.slug} href={`/catalogo/${p.slug}`}
                  style={pos[i]}
                  className="block bg-white border border-[#E2D5C3] rounded-2xl overflow-hidden
                             shadow-[0_4px_24px_rgba(26,15,7,0.10)] hover:shadow-[0_8px_32px_rgba(26,15,7,0.16)]
                             transition-shadow duration-300">
                  <div className="h-28 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${p.color}28, ${p.color}10)` }}>
                    <span className="text-5xl">{p.emoji}</span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[10px] font-semibold text-[#C8924A] uppercase tracking-wider mb-0.5">{p.ageRange}</p>
                    <p className="text-sm font-bold text-[#1A0F07] leading-snug">{p.name}</p>
                    <p className="text-xs text-[#5C4033] mt-0.5">{p.price}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #E2D5C3 30%, #E2D5C3 70%, transparent)' }} />
      </section>

      {/* ── Pillars ─────────────────────────────────────────────── */}
      <section className="bg-white border-y border-[#E2D5C3]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E2D5C3]">
            {pillars.map((p, i) => (
              <div key={p.title} className={`py-8 md:py-0 md:px-10 ${i === 0 ? 'md:pl-0' : ''} ${i === 2 ? 'md:pr-0' : ''}`}>
                <p className="text-[48px] font-bold leading-none mb-4 select-none"
                  style={{ fontFamily: 'var(--font-display)', color: '#F0EBE3' }}>
                  {p.n}
                </p>
                <h3 className="text-base font-bold text-[#1A0F07] mb-2">{p.title}</h3>
                <p className="text-sm text-[#5C4033] leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured products ───────────────────────────────────── */}
      <section className="bg-cream">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#C8924A] mb-3">Catálogo</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A0F07] tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-display)' }}>
                Muebles destacados
              </h2>
            </div>
            <Link href="/catalogo"
              className="hidden md:block text-sm font-medium text-[#5C4033] hover:text-[#C8924A] transition-colors">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featured.map(p => (
              <Link key={p.slug} href={`/catalogo/${p.slug}`}
                className="group bg-white border border-[#E2D5C3] rounded-2xl overflow-hidden
                           hover:border-[#C8924A]/40 hover:shadow-[0_8px_32px_rgba(26,15,7,0.08)]
                           transition-all duration-300">
                {/* Image */}
                <div className="h-52 flex items-center justify-center relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${p.color}25, ${p.color}08)` }}>
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-500 ease-out">
                    {p.emoji}
                  </span>
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-medium bg-white/90 backdrop-blur-sm border border-white/50
                                     rounded-full px-2.5 py-1 text-[#5C4033]">
                      {p.ageRange}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-[#1A0F07] text-lg mb-1 tracking-[-0.01em]"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    {p.name}
                  </h3>
                  <p className="text-sm text-[#5C4033] mb-4 line-clamp-2 leading-relaxed">{p.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A0F07]">{p.price}</span>
                    <span className="text-xs text-[#C8924A] font-medium group-hover:translate-x-1 transition-transform">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link href="/catalogo"
              className="text-sm font-semibold text-[#C8924A] hover:text-[#8B5E2D] transition-colors">
              Ver todos los muebles →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────── */}
      <section className="bg-white border-y border-[#E2D5C3]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: '0–10',   label: 'años de cobertura' },
              { n: '6',      label: 'tipos de mueble'   },
              { n: '100%',   label: 'madera natural'    },
              { n: '2',      label: 'normas de seguridad' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-bold text-[#1A0F07] tracking-[-0.02em] mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}>
                  {s.n}
                </p>
                <p className="text-xs text-[#5C4033] uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA dark ────────────────────────────────────────────── */}
      <section className="bg-[#1A0F07]">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#C8924A] mb-4">Diseño a medida</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.02em] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}>
              ¿Tu espacio tiene medidas especiales?
            </h2>
            <p className="text-white/50 leading-relaxed max-w-md">
              Fabricamos cada mueble a pedido según la edad de tu hijo y el espacio disponible.
              Cuéntanos tu proyecto y cotizamos en menos de 24 horas.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <Link href="/catalogo"
              className="border border-white/15 text-white/70 px-7 py-3.5 rounded-xl text-sm font-medium
                         hover:border-white/40 hover:text-white transition-colors text-center">
              Ver catálogo
            </Link>
            <Link href="/contacto"
              className="bg-[#C8924A] text-white px-7 py-3.5 rounded-xl text-sm font-semibold
                         hover:bg-[#8B5E2D] transition-colors text-center">
              Solicitar cotización
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
