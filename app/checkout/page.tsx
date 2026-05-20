'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'
import { useCart, fmtCLP } from '@/lib/cart'

type Step = 'datos' | 'pago'

const REGIONES = [
  'Región Metropolitana', 'Valparaíso', 'Biobío', 'Maule', 'Los Lagos',
  "O'Higgins", 'Araucanía', 'Los Ríos', 'Coquimbo', 'Atacama', 'Antofagasta',
  'Tarapacá', 'Arica y Parinacota', 'Magallanes', 'Aysén',
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, iva, total, count, clear } = useCart()
  const [step, setStep] = useState<Step>('datos')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    direccion: '', ciudad: '', region: 'Región Metropolitana', depto: '',
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (count === 0) router.replace('/catalogo')
  }, [count, router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function emailValido(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function datosValidos() {
    return form.nombre && form.apellido && emailValido(form.email) &&
      form.telefono && form.direccion && form.ciudad && form.region
  }

  async function handlePagar() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map(i => ({
            slug: i.slug,
            name: i.name,
            quantity: i.quantity,
            priceNum: i.priceNum,
            note: i.note ?? '',
          })),
          subtotal, iva, total,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Error procesando el pago')
      }

      const data = await res.json()

      // If the payment provider returns a redirect URL, go there
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
        return
      }

      // Stub: payment provider not yet configured → go to success page
      clear()
      router.push(`/checkout/exito?orden=${data.orderId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (count === 0) return null

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <PublicNav />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">

        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          {(['datos', 'pago'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              {i > 0 && <div className="w-12 h-px bg-[#E2D5C3]" />}
              <div className={`flex items-center gap-2 text-sm font-medium ${step === s ? 'text-[#C8924A]' : s === 'pago' && step === 'datos' ? 'text-[#5C4033] opacity-40' : 'text-[#5C4033]'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? 'bg-[#C8924A] text-white' : 'bg-[#E2D5C3] text-[#5C4033]'}`}>
                  {i + 1}
                </span>
                <span className="capitalize">{s === 'datos' ? 'Datos de envío' : 'Pagar'}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: form */}
          <div className="lg:col-span-2">
            {step === 'datos' && (
              <div className="bg-white border border-[#E2D5C3] rounded-2xl p-8 flex flex-col gap-5">
                <p className="text-xs font-medium uppercase tracking-[2px] text-[#C8924A]">
                  Datos de contacto y entrega
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    { name: 'nombre',    label: 'Nombre',        type: 'text',  placeholder: 'Tu nombre' },
                    { name: 'apellido',  label: 'Apellido',      type: 'text',  placeholder: 'Tu apellido' },
                    { name: 'email',     label: 'Correo',        type: 'email', placeholder: 'tu@email.com' },
                    { name: 'telefono',  label: 'Teléfono',      type: 'tel',   placeholder: '+56 9 XXXX XXXX' },
                  ] as const).map(f => (
                    <div key={f.name} className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-[#2C1A0E] uppercase tracking-wide">
                        {f.label} <span className="text-[#C8924A]">*</span>
                      </label>
                      <input
                        name={f.name}
                        type={f.type}
                        value={form[f.name]}
                        onChange={handleChange}
                        required
                        placeholder={f.placeholder}
                        className="border border-[#E2D5C3] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] placeholder-[#B8A99A] focus:outline-none focus:border-[#C8924A] transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#2C1A0E] uppercase tracking-wide">
                    Dirección <span className="text-[#C8924A]">*</span>
                  </label>
                  <input
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    required
                    placeholder="Calle, número"
                    className="border border-[#E2D5C3] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] placeholder-[#B8A99A] focus:outline-none focus:border-[#C8924A] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#2C1A0E] uppercase tracking-wide">
                      Depto / Casa
                    </label>
                    <input
                      name="depto"
                      value={form.depto}
                      onChange={handleChange}
                      placeholder="Depto 3B"
                      className="border border-[#E2D5C3] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] placeholder-[#B8A99A] focus:outline-none focus:border-[#C8924A] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#2C1A0E] uppercase tracking-wide">
                      Ciudad <span className="text-[#C8924A]">*</span>
                    </label>
                    <input
                      name="ciudad"
                      value={form.ciudad}
                      onChange={handleChange}
                      required
                      placeholder="Santiago"
                      className="border border-[#E2D5C3] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] placeholder-[#B8A99A] focus:outline-none focus:border-[#C8924A] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#2C1A0E] uppercase tracking-wide">
                      Región <span className="text-[#C8924A]">*</span>
                    </label>
                    <select
                      name="region"
                      value={form.region}
                      onChange={handleChange}
                      className="border border-[#E2D5C3] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] focus:outline-none focus:border-[#C8924A] transition-colors bg-white"
                    >
                      {REGIONES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setStep('pago')}
                  disabled={!datosValidos()}
                  className="mt-2 bg-[#C8924A] text-white py-4 rounded-xl font-medium hover:bg-[#8B5E2D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuar al pago →
                </button>
              </div>
            )}

            {step === 'pago' && (
              <div className="bg-white border border-[#E2D5C3] rounded-2xl p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-[2px] text-[#C8924A]">Método de pago</p>
                  <button onClick={() => setStep('datos')} className="text-xs text-[#5C4033] hover:text-[#C8924A] transition-colors">
                    ← Volver
                  </button>
                </div>

                {/* Shipping summary */}
                <div className="bg-[#FAF6F0] rounded-xl p-4 text-sm text-[#5C4033]">
                  <p className="font-medium text-[#2C1A0E] mb-1">{form.nombre} {form.apellido}</p>
                  <p>{form.direccion}{form.depto ? `, ${form.depto}` : ''}</p>
                  <p>{form.ciudad}, {form.region}</p>
                  <p className="mt-1">{form.email} · {form.telefono}</p>
                </div>

                {/* Payment methods — stubs */}
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium text-[#2C1A0E]">Plataforma de pago</p>

                  {[
                    { id: 'flow',  label: 'Flow',          sub: 'Tarjetas, débito, transferencia — Chile',  icon: '🏦' },
                    { id: 'mp',    label: 'Mercado Pago',   sub: 'Tarjetas y cuotas',                        icon: '💳' },
                    { id: 'stripe',label: 'Stripe / Visa',  sub: 'Tarjetas internacionales',                 icon: '🌐' },
                  ].map(m => (
                    <label key={m.id}
                      className="flex items-center gap-4 border border-[#E2D5C3] rounded-xl px-4 py-3.5 cursor-pointer hover:border-[#C8924A] transition-colors opacity-60"
                      title="Próximamente — elige tu pasarela en /api/checkout">
                      <span className="text-xl">{m.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-[#2C1A0E]">{m.label}</p>
                        <p className="text-xs text-[#5C4033]">{m.sub}</p>
                      </div>
                      <span className="ml-auto text-[10px] bg-[#E2D5C3] text-[#5C4033] px-2 py-0.5 rounded-full">
                        Próximamente
                      </span>
                    </label>
                  ))}

                  {/* "Coordinar pago" while provider is not wired */}
                  <label className="flex items-center gap-4 border-2 border-[#C8924A] rounded-xl px-4 py-3.5 cursor-pointer bg-[#C8924A]/5">
                    <span className="text-xl">💬</span>
                    <div>
                      <p className="text-sm font-medium text-[#2C1A0E]">Coordinar pago por WhatsApp</p>
                      <p className="text-xs text-[#5C4033]">Enviamos instrucciones por correo y WhatsApp</p>
                    </div>
                    <span className="ml-auto w-4 h-4 rounded-full border-2 border-[#C8924A] bg-[#C8924A] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePagar}
                  disabled={loading}
                  className="bg-[#C8924A] text-white py-4 rounded-xl font-medium text-base hover:bg-[#8B5E2D] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Procesando…
                    </>
                  ) : `Confirmar pedido · ${fmtCLP(total)}`}
                </button>

                <p className="text-[10px] text-[#5C4033] opacity-50 text-center leading-relaxed">
                  Al confirmar aceptas nuestros términos. Fabricación a pedido — 3 a 4 semanas.
                  Precio puede variar según material y medidas exactas confirmadas.
                </p>
              </div>
            )}
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E2D5C3] rounded-2xl p-6 sticky top-24">
              <p className="text-xs font-medium uppercase tracking-[2px] text-[#C8924A] mb-4">
                Tu pedido
              </p>

              <ul className="flex flex-col gap-3 mb-5">
                {items.map(item => (
                  <li key={item.slug} className="flex items-start gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2C1A0E] truncate">{item.name}</p>
                      {item.note && (
                        <p className="text-xs text-[#5C4033] opacity-60 truncate">{item.note}</p>
                      )}
                      <p className="text-xs text-[#5C4033]">×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-[#2C1A0E] shrink-0">
                      {fmtCLP(item.priceNum * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-[#E2D5C3] pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-[#5C4033]">
                  <span>Subtotal</span>
                  <span>{fmtCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#5C4033]">
                  <span>IVA</span>
                  <span>{fmtCLP(iva)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#2C1A0E] text-base mt-1">
                  <span>Total</span>
                  <span>{fmtCLP(total)}</span>
                </div>
              </div>

              <Link href="/carrito" className="block text-xs text-[#C8924A] hover:text-[#8B5E2D] transition-colors mt-4 text-center">
                Modificar carrito
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
