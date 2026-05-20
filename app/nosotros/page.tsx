import Link from 'next/link'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'

const values = [
  { icon: '🌿', title: 'Natural', text: 'Solo madera real, acabados naturales (cera de abeja, aceite de linaza). Sin plásticos, sin pinturas sintéticas, sin tóxicos.' },
  { icon: '📐', title: 'Preciso', text: 'Cada medida está validada por la tabla antropométrica Montessori. Ninguna dimensión es arbitraria.' },
  { icon: '🛡', title: 'Seguro', text: 'Cumplimiento de normas EN 71-1 y ASTM F963. Cantos redondeados, materiales certificados E0, sin gaps de atrapamiento.' },
  { icon: '♾', title: 'Duradero', text: 'Diseñado para durar años — no solo temporadas. La madera maciza envejece con dignidad.' },
]

export default function NosotrosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <PublicNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-[#E2D5C3]">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <p className="text-xs font-medium uppercase tracking-[2px] text-[#C8924A] mb-4">Nuestra historia</p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#2C1A0E] max-w-2xl leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}>
              Creemos que el entorno forma al niño
            </h1>
            <div className="mt-4 h-[3px] w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #C8924A, #7A9E7E)' }} />
          </div>
        </section>

        {/* Story */}
        <section className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[#5C4033] leading-relaxed mb-5">
                Blattkids nació de una pregunta simple: ¿por qué los muebles infantiles son de plástico brillante,
                llenos de personajes de dibujos animados, y con medidas que no tienen ninguna relación con el cuerpo
                real del niño?
              </p>
              <p className="text-[#5C4033] leading-relaxed mb-5">
                La pedagogía Montessori lleva más de un siglo demostrando que el entorno físico es un tercer educador.
                Un mueble bien diseñado no es solo funcional — es una invitación al aprendizaje, a la autonomía y al orden.
              </p>
              <p className="text-[#5C4033] leading-relaxed">
                Cada pieza que fabricamos está pensada desde la antropometría del niño, validada con las normas de
                seguridad internacionales, y construida con materiales que respetan tanto al niño como al planeta.
              </p>
            </div>

            {/* Accent box */}
            <div className="bg-[#2C1A0E] rounded-2xl p-8 text-white">
              <p className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>0 – 10 años</p>
              <p className="text-white/60 text-sm mb-6">Diseñamos para cada etapa del desarrollo</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: '8', label: 'rangos de edad' },
                  { n: '6', label: 'tipos de mueble' },
                  { n: '2', label: 'normas de seguridad' },
                  { n: '100%', label: 'madera natural' },
                ].map(s => (
                  <div key={s.label} className="border border-white/10 rounded-xl p-4">
                    <p className="text-2xl font-bold text-[#E8C99A]">{s.n}</p>
                    <p className="text-xs text-white/50 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white border-y border-[#E2D5C3]">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <p className="text-xs font-medium uppercase tracking-[2px] text-[#C8924A] mb-10">Nuestros valores</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map(v => (
                <div key={v.title}>
                  <span className="text-3xl mb-4 block">{v.icon}</span>
                  <h3 className="font-bold text-[#2C1A0E] text-base mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    {v.title}
                  </h3>
                  <p className="text-sm text-[#5C4033] leading-relaxed">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Montessori */}
        <section className="max-w-6xl mx-auto px-6 py-14">
          <p className="text-xs font-medium uppercase tracking-[2px] text-[#C8924A] mb-6">Filosofía Montessori</p>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-[#2C1A0E] mb-5"
              style={{ fontFamily: 'var(--font-display)' }}>
              ¿Por qué Montessori?
            </h2>
            <p className="text-[#5C4033] leading-relaxed mb-4">
              Maria Montessori observó que los niños aprenden mejor cuando pueden moverse libremente en un entorno
              preparado para ellos. Esto incluye muebles a su escala, ordenados, hermosos y accesibles sin necesidad
              de ayuda adulta.
            </p>
            <p className="text-[#5C4033] leading-relaxed mb-4">
              Los cinco criterios que validamos en cada diseño son: <strong className="text-[#2C1A0E]">independencia</strong>
              (el niño puede usarlo solo), <strong className="text-[#2C1A0E]">orden</strong> (invita a mantener las cosas en su lugar),
              <strong className="text-[#2C1A0E]"> belleza</strong> (estéticamente calmante), <strong className="text-[#2C1A0E]">realidad</strong> (materiales genuinos)
              y <strong className="text-[#2C1A0E]">libertad con límites</strong> (el diseño define el espacio de acción del niño).
            </p>
            <p className="text-[#5C4033] leading-relaxed">
              Cada medida está calculada a partir de la tabla antropométrica Montessori certificada —
              no son estimaciones, son datos.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#FAF6F0] border-t border-[#E2D5C3]">
          <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-[#2C1A0E] mb-1"
                style={{ fontFamily: 'var(--font-display)' }}>
                ¿Hablamos de tu proyecto?
              </h3>
              <p className="text-sm text-[#5C4033]">Cuéntanos qué necesitas y te enviamos una cotización.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/catalogo"
                className="border border-[#E2D5C3] text-[#2C1A0E] px-6 py-3 rounded-xl text-sm font-medium hover:border-[#C8924A] transition-colors">
                Ver catálogo
              </Link>
              <Link href="/contacto"
                className="bg-[#C8924A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#8B5E2D] transition-colors">
                Contactar
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
