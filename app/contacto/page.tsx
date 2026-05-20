'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'

const PRODUCTS = [
  'Estantería Montessori',
  'Cama piso Montessori',
  'Torre de aprendizaje',
  'Mesa y silla Montessori',
  'Estación de arte',
  'Armario Montessori',
  'Diseño personalizado',
  'Otro',
]

function ContactForm() {
  const searchParams = useSearchParams()
  const productParam = searchParams.get('producto') ?? ''

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    producto: '',
    mensaje: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (productParam) {
      setForm(f => ({ ...f, producto: productParam }))
    }
  }, [productParam])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    // Simulate submission delay — replace with real API call when ready
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-white border border-[#E2D5C3] rounded-2xl p-10 text-center">
        <span className="text-5xl mb-5 block">🌿</span>
        <h2 className="text-2xl font-bold text-[#2C1A0E] mb-3"
          style={{ fontFamily: 'var(--font-display)' }}>
          Mensaje recibido
        </h2>
        <p className="text-[#5C4033] mb-6 max-w-sm mx-auto">
          Gracias por escribirnos. Te responderemos en menos de 24 horas hábiles con una cotización detallada.
        </p>
        <Link href="/catalogo"
          className="inline-block bg-[#C8924A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#8B5E2D] transition-colors">
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2D5C3] rounded-2xl p-8 md:p-10 flex flex-col gap-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#2C1A0E] uppercase tracking-wide">
            Nombre <span className="text-[#C8924A]">*</span>
          </label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Tu nombre"
            className="border border-[#E2D5C3] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] placeholder-[#B8A99A] focus:outline-none focus:border-[#C8924A] transition-colors"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#2C1A0E] uppercase tracking-wide">
            Correo electrónico <span className="text-[#C8924A]">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="tu@email.com"
            className="border border-[#E2D5C3] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] placeholder-[#B8A99A] focus:outline-none focus:border-[#C8924A] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Teléfono */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#2C1A0E] uppercase tracking-wide">
            Teléfono
          </label>
          <input
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
            placeholder="+56 9 XXXX XXXX"
            className="border border-[#E2D5C3] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] placeholder-[#B8A99A] focus:outline-none focus:border-[#C8924A] transition-colors"
          />
        </div>

        {/* Producto */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#2C1A0E] uppercase tracking-wide">
            Producto de interés
          </label>
          <select
            name="producto"
            value={form.producto}
            onChange={handleChange}
            className="border border-[#E2D5C3] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] focus:outline-none focus:border-[#C8924A] transition-colors bg-white appearance-none"
          >
            <option value="">Seleccionar...</option>
            {PRODUCTS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mensaje */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#2C1A0E] uppercase tracking-wide">
          Mensaje <span className="text-[#C8924A]">*</span>
        </label>
        <textarea
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Cuéntanos qué necesitas: edad del niño, espacio disponible, madera preferida, presupuesto aproximado..."
          className="border border-[#E2D5C3] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] placeholder-[#B8A99A] focus:outline-none focus:border-[#C8924A] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={sending || !form.nombre || !form.email || !form.mensaje}
        className="bg-[#C8924A] text-white py-3.5 rounded-xl font-medium text-sm hover:bg-[#8B5E2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {sending ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Enviando…
          </>
        ) : 'Enviar mensaje'}
      </button>

      <p className="text-xs text-[#5C4033] opacity-60 text-center">
        También puedes escribirnos directamente a{' '}
        <a href="mailto:hola@blattkids.cl" className="underline hover:text-[#C8924A]">
          hola@blattkids.cl
        </a>
      </p>
    </form>
  )
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <PublicNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-[#E2D5C3]">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <p className="text-xs font-medium uppercase tracking-[2px] text-[#C8924A] mb-4">Cotiza tu proyecto</p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#2C1A0E] max-w-xl leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}>
              Hablemos de lo que necesitas
            </h1>
            <div className="mt-4 h-[3px] w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #C8924A, #7A9E7E)' }} />
          </div>
        </section>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">

            {/* Sidebar info */}
            <div className="md:col-span-2 flex flex-col gap-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[2px] text-[#C8924A] mb-4">Cómo funciona</p>
                <ol className="flex flex-col gap-5">
                  {[
                    { n: '01', title: 'Cuéntanos tu proyecto', text: 'Edad del niño, qué mueble necesitas y el espacio disponible.' },
                    { n: '02', title: 'Te enviamos una cotización', text: 'Recibe un presupuesto detallado con materiales y tiempos en menos de 24h.' },
                    { n: '03', title: 'Confirmamos y fabricamos', text: 'Una vez aprobado, iniciamos la producción. Entrega en 3–4 semanas.' },
                  ].map(step => (
                    <li key={step.n} className="flex gap-4">
                      <span className="text-2xl font-bold text-[#E2D5C3] shrink-0 leading-none mt-0.5"
                        style={{ fontFamily: 'var(--font-display)' }}>
                        {step.n}
                      </span>
                      <div>
                        <p className="font-bold text-[#2C1A0E] text-sm mb-1">{step.title}</p>
                        <p className="text-xs text-[#5C4033] leading-relaxed">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Contact data */}
              <div className="bg-[#2C1A0E] rounded-2xl p-6 text-white">
                <p className="text-xs font-medium uppercase tracking-[2px] text-white/40 mb-4">Contacto directo</p>
                <div className="flex flex-col gap-3 text-sm">
                  <a href="mailto:hola@blattkids.cl"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span>✉</span> hola@blattkids.cl
                  </a>
                  <a href="https://wa.me/56912345678"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span>💬</span> +56 9 1234 5678
                  </a>
                  <span className="flex items-center gap-2 text-white/40">
                    <span>📍</span> Santiago, Chile
                  </span>
                </div>
                <div className="border-t border-white/10 mt-5 pt-5">
                  <p className="text-xs text-white/40 leading-relaxed">
                    Tiempo de respuesta habitual: menos de 24 horas hábiles.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-3">
              <Suspense fallback={
                <div className="bg-white border border-[#E2D5C3] rounded-2xl p-10 text-center text-sm text-[#5C4033]">
                  Cargando formulario…
                </div>
              }>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
