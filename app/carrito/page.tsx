'use client'
import Link from 'next/link'
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'
import { useCart, fmtCLP } from '@/lib/cart'

export default function CarritoPage() {
  const { items, count, subtotal, iva, total, remove, setQty, setNote, clear } = useCart()

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <PublicNav />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[2px] text-[#C8924A] mb-2">Tu pedido</p>
          <h1 className="text-3xl font-bold text-[#2C1A0E]" style={{ fontFamily: 'var(--font-display)' }}>
            Carrito de compras
          </h1>
        </div>

        {count === 0 ? (
          <div className="bg-white border border-[#E2D5C3] rounded-2xl p-16 text-center">
            <span className="text-5xl mb-4 block opacity-30">🛒</span>
            <p className="text-[#5C4033] mb-6">Tu carrito está vacío.</p>
            <Link href="/catalogo"
              className="inline-block bg-[#C8924A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#8B5E2D] transition-colors">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map(item => (
                <div key={item.slug} className="bg-white border border-[#E2D5C3] rounded-2xl p-5 flex gap-4">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-3xl shrink-0">
                    {item.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-[#2C1A0E]">{item.name}</p>
                        <p className="text-xs text-[#5C4033] opacity-60">{item.ageRange}</p>
                      </div>
                      <button
                        onClick={() => remove(item.slug)}
                        className="text-[#B8A99A] hover:text-red-400 transition-colors text-sm shrink-0 mt-0.5"
                      >
                        Eliminar
                      </button>
                    </div>

                    {/* Note */}
                    <div className="mt-3">
                      <label className="text-[10px] uppercase tracking-wide text-[#5C4033] opacity-60 block mb-1">
                        Nota (edad del niño, medida, madera)
                      </label>
                      <input
                        value={item.note ?? ''}
                        onChange={e => setNote(item.slug, e.target.value)}
                        placeholder="Ej: niño de 3 años, madera roble, sin acabado"
                        className="w-full text-sm border border-[#E2D5C3] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8924A] placeholder-[#B8A99A]"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty */}
                      <div className="flex items-center gap-2 border border-[#E2D5C3] rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQty(item.slug, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#5C4033] hover:bg-[#FAF6F0] transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-[#2C1A0E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQty(item.slug, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#5C4033] hover:bg-[#FAF6F0] transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold text-[#2C1A0E]">
                        {fmtCLP(item.priceNum * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center mt-2">
                <Link href="/catalogo" className="text-sm text-[#C8924A] hover:text-[#8B5E2D] transition-colors">
                  ← Seguir comprando
                </Link>
                <button onClick={clear} className="text-xs text-[#B8A99A] hover:text-red-400 transition-colors">
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#E2D5C3] rounded-2xl p-6 sticky top-24">
                <p className="text-xs font-medium uppercase tracking-[2px] text-[#C8924A] mb-5">
                  Resumen del pedido
                </p>

                <div className="flex flex-col gap-3 text-sm mb-5">
                  <div className="flex justify-between text-[#5C4033]">
                    <span>Subtotal ({count} {count === 1 ? 'artículo' : 'artículos'})</span>
                    <span>{fmtCLP(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#5C4033]">
                    <span>IVA (19%)</span>
                    <span>{fmtCLP(iva)}</span>
                  </div>
                  <div className="flex justify-between text-[#5C4033]">
                    <span>Envío</span>
                    <span className="text-[#7A9E7E] font-medium">A coordinar</span>
                  </div>
                  <div className="border-t border-[#E2D5C3] pt-3 flex justify-between font-bold text-[#2C1A0E] text-base">
                    <span>Total</span>
                    <span>{fmtCLP(total)}</span>
                  </div>
                </div>

                <p className="text-[10px] text-[#5C4033] opacity-50 mb-4 leading-relaxed">
                  Precio referencial. El valor exacto se confirma según medidas y material elegido.
                  Fabricación a pedido: 3–4 semanas desde el pago.
                </p>

                <Link
                  href="/checkout"
                  className="block w-full bg-[#C8924A] text-white text-center py-4 rounded-xl font-medium hover:bg-[#8B5E2D] transition-colors mb-3"
                >
                  Proceder al pago →
                </Link>
                <Link
                  href={`/contacto?producto=${encodeURIComponent(items.map(i => i.name).join(', '))}`}
                  className="block w-full border border-[#E2D5C3] text-[#5C4033] text-center py-3 rounded-xl text-sm hover:border-[#C8924A] transition-colors"
                >
                  Prefiero cotización
                </Link>

                {/* Trust badges */}
                <div className="mt-5 flex flex-col gap-2">
                  {[
                    '🛡 Pago 100% seguro',
                    '🌿 Madera natural certificada',
                    '🔄 Cambios en 30 días',
                  ].map(b => (
                    <p key={b} className="text-xs text-[#5C4033] opacity-60">{b}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
