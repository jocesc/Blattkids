import { notFound } from 'next/navigation'
import Link from 'next/link'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'
import AddToCartButton from '@/components/public/AddToCartButton'
import { products } from '@/lib/products'

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = products.find(p => p.slug === slug)
  if (!product) notFound()

  const related = products.filter(p => p.slug !== slug && p.category === product.category).slice(0, 3)
  const others = related.length < 2 ? products.filter(p => p.slug !== slug).slice(0, 3) : related

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <PublicNav />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-xs text-[#5C4033]">
            <Link href="/" className="hover:text-[#C8924A] transition-colors">Inicio</Link>
            <span className="mx-2 opacity-40">·</span>
            <Link href="/catalogo" className="hover:text-[#C8924A] transition-colors">Catálogo</Link>
            <span className="mx-2 opacity-40">·</span>
            <span className="text-[#1A0F07]">{product.name}</span>
          </p>
        </div>

        {/* Product hero */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-white border border-[#E2D5C3] rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* Visual */}
              <div className="relative flex items-center justify-center min-h-[300px] md:min-h-[420px]"
                style={{ background: `linear-gradient(135deg, ${product.color}22, ${product.color}08)` }}>
                <span className="text-[120px] md:text-[140px] select-none">{product.emoji}</span>
                {/* Category badge */}
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider
                                   bg-white/90 backdrop-blur-sm border border-white/60
                                   rounded-full px-3 py-1.5 text-[#5C4033]">
                    {product.category.replace('-', ' & ')}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-8 md:p-10 flex flex-col">
                <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#C8924A] mb-3">
                  {product.ageRange}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1A0F07] tracking-[-0.02em] mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}>
                  {product.name}
                </h1>
                <p className="text-[#5C4033] leading-relaxed mb-7">{product.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-3xl font-bold text-[#1A0F07]">{product.price}</p>
                </div>
                <p className="text-xs text-[#5C4033] opacity-50 mb-7">
                  Precio referencial · varía según material y medidas exactas
                </p>

                {/* CTAs */}
                <div className="flex flex-col gap-2.5 mt-auto">
                  <AddToCartButton product={product} />
                  <Link href="/checkout"
                    className="block w-full bg-[#1A0F07] text-white text-center py-3.5 rounded-xl
                               font-semibold text-sm hover:bg-[#5C4033] transition-colors">
                    Comprar ahora →
                  </Link>
                  <Link href={`/contacto?producto=${encodeURIComponent(product.name)}`}
                    className="block w-full border border-[#E2D5C3] text-[#5C4033] text-center py-3 rounded-xl
                               text-sm hover:border-[#C8924A] hover:text-[#C8924A] transition-colors">
                    Solicitar cotización personalizada
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="max-w-6xl mx-auto px-6 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Features */}
            <div className="bg-white border border-[#E2D5C3] rounded-2xl p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#C8924A] mb-5">
                Características
              </p>
              <ul className="flex flex-col gap-3.5">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#5C4033] leading-relaxed">
                    <span className="text-[#7A9E7E] shrink-0 mt-0.5 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specs */}
            <div className="bg-white border border-[#E2D5C3] rounded-2xl p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#C8924A] mb-5">
                Especificaciones
              </p>
              <div className="grid grid-cols-2 gap-y-5">
                {[
                  { label: 'Dimensiones',         value: product.dimensions },
                  { label: 'Material',             value: product.material   },
                  { label: 'Rango de edad',        value: product.ageRange   },
                  { label: 'Normas de seguridad',  value: 'EN 71-1 · ASTM F963' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-[10px] text-[#5C4033] opacity-50 uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-sm font-semibold text-[#1A0F07] leading-snug">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {others.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 pb-20">
            <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#C8924A] mb-7">
              También te puede interesar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {others.map(p => (
                <Link key={p.slug} href={`/catalogo/${p.slug}`}
                  className="group bg-white border border-[#E2D5C3] rounded-2xl overflow-hidden
                             hover:border-[#C8924A]/40 hover:shadow-[0_4px_20px_rgba(26,15,7,0.07)]
                             transition-all duration-300">
                  <div className="h-36 flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${p.color}22, ${p.color}08)` }}>
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {p.emoji}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-medium text-[#C8924A] mb-0.5 uppercase tracking-wide">{p.ageRange}</p>
                    <p className="font-bold text-[#1A0F07] text-sm">{p.name}</p>
                    <p className="text-xs text-[#5C4033] mt-0.5">{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
