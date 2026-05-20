'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'

function ExitoContent() {
  const params = useSearchParams()
  const orden = params.get('orden') ?? '—'

  return (
    <div className="max-w-lg mx-auto text-center py-20 px-6">
      {/* Check animation */}
      <div className="w-20 h-20 rounded-full bg-[#7A9E7E]/15 flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">✓</span>
      </div>

      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
        ¡Pedido confirmado!
      </h1>
      <p className="text-[#5C4033] mb-2">
        Gracias por tu compra. Hemos recibido tu pedido y nos pondremos en contacto en menos de 24 horas.
      </p>

      <div className="bg-[#FAF6F0] border border-[#E2D5C3] rounded-xl px-6 py-4 inline-block mt-4 mb-8">
        <p className="text-xs text-[#5C4033] opacity-60 mb-1">Número de orden</p>
        <p className="font-mono font-bold text-[#2C1A0E] text-lg">{orden}</p>
      </div>

      <div className="flex flex-col gap-3 text-sm text-[#5C4033] mb-10">
        {[
          '📧 Recibirás una confirmación por correo',
          '💬 Te contactaremos por WhatsApp para coordinar el pago y medidas finales',
          '🪵 Fabricación: 3 a 4 semanas desde la confirmación',
          '🚚 Coordinamos el despacho contigo directamente',
        ].map(s => (
          <p key={s} className="flex items-start gap-2 justify-center">{s}</p>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/catalogo"
          className="bg-[#C8924A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#8B5E2D] transition-colors">
          Seguir comprando
        </Link>
        <Link href="/"
          className="border border-[#E2D5C3] text-[#5C4033] px-6 py-3 rounded-xl text-sm font-medium hover:border-[#C8924A] transition-colors">
          Ir al inicio
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutExitoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <PublicNav />
      <main className="flex-1">
        <Suspense fallback={<div className="py-20 text-center text-[#5C4033]">Cargando…</div>}>
          <ExitoContent />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  )
}
