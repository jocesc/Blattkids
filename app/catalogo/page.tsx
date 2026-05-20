'use client'
import { useState } from 'react'
import Link from 'next/link'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'
import { products, categories, ageFilters } from '@/lib/products'

export default function CatalogoPage() {
  const [cat, setCat] = useState('all')
  const [age, setAge] = useState('all')

  const filtered = products.filter(p => {
    const catOk = cat === 'all' || p.category === cat
    const ageFilter = ageFilters.find(a => a.value === age)
    const ageOk = !ageFilter || age === 'all' || (p.ageMin <= ageFilter.max! && p.ageMax >= ageFilter.min!)
    return catOk && ageOk
  })

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <PublicNav />

      {/* Header */}
      <div className="bg-white border-b border-[#E2D5C3]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#C8924A] mb-3">
            Catálogo
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A0F07] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)' }}>
            Muebles Montessori
          </h1>
          <p className="text-[#5C4033] mt-3 max-w-lg leading-relaxed">
            Diseñados con medidas certificadas para cada etapa del desarrollo, de 0 a 10 años.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-[#E2D5C3] sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex flex-wrap gap-6 items-center">

          {/* Category */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(c => (
              <button key={c.value} onClick={() => setCat(c.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  cat === c.value
                    ? 'bg-[#1A0F07] text-white'
                    : 'border border-[#E2D5C3] text-[#5C4033] hover:border-[#C8924A] hover:text-[#C8924A]'
                }`}>
                {c.label}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-[#E2D5C3] hidden md:block" />

          {/* Age */}
          <div className="flex flex-wrap gap-1.5">
            {ageFilters.map(a => (
              <button key={a.value} onClick={() => setAge(a.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  age === a.value
                    ? 'bg-[#C8924A] text-white'
                    : 'border border-[#E2D5C3] text-[#5C4033] hover:border-[#C8924A] hover:text-[#C8924A]'
                }`}>
                {a.label}
              </button>
            ))}
          </div>

          {filtered.length < products.length && (
            <p className="text-xs text-[#5C4033] opacity-50 ml-auto hidden md:block">
              {filtered.length} de {products.length} productos
            </p>
          )}
        </div>
      </div>

      {/* Grid */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-28 flex flex-col items-center">
            <span className="text-5xl mb-5 opacity-20">🔍</span>
            <p className="text-[#5C4033] font-medium mb-2">Sin resultados para esa combinación</p>
            <button onClick={() => { setCat('all'); setAge('all') }}
              className="text-sm text-[#C8924A] hover:text-[#8B5E2D] transition-colors mt-1">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <Link key={p.slug} href={`/catalogo/${p.slug}`}
                className="group bg-white border border-[#E2D5C3] rounded-2xl overflow-hidden
                           hover:border-[#C8924A]/40 hover:shadow-[0_8px_32px_rgba(26,15,7,0.08)]
                           transition-all duration-300">

                {/* Image area */}
                <div className="h-52 flex items-center justify-center relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${p.color}25, ${p.color}08)` }}>
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-500 ease-out">
                    {p.emoji}
                  </span>
                  {/* Age badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-medium bg-white/90 backdrop-blur-sm
                                     border border-white/50 rounded-full px-2.5 py-1 text-[#5C4033]">
                      {p.ageRange}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="font-bold text-[#1A0F07] text-lg mb-1 tracking-[-0.01em]"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    {p.name}
                  </h2>
                  <p className="text-sm text-[#5C4033] mb-4 line-clamp-2 leading-relaxed">{p.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A0F07] text-base">{p.price}</span>
                    <span className="text-xs text-[#C8924A] font-medium group-hover:translate-x-1 transition-transform duration-200">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
