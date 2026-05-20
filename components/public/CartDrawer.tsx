'use client'
import Link from 'next/link'
import { useCart, fmtCLP } from '@/lib/cart'

export default function CartDrawer() {
  const { items, open, count, subtotal, iva, total, remove, setQty, setNote, closeDrawer } = useCart()

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-[2px]"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2D5C3]">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛒</span>
            <span className="font-bold text-[#2C1A0E]" style={{ fontFamily: 'var(--font-display)' }}>
              Carrito
            </span>
            {count > 0 && (
              <span className="bg-[#C8924A] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button onClick={closeDrawer} className="text-[#5C4033] hover:text-[#2C1A0E] transition-colors p-1">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="text-5xl opacity-30">🛒</span>
              <p className="text-[#5C4033] text-sm">Tu carrito está vacío</p>
              <button
                onClick={closeDrawer}
                className="text-sm text-[#C8924A] font-medium hover:text-[#8B5E2D] transition-colors"
              >
                Seguir explorando →
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map(item => (
                <li key={item.slug} className="flex gap-4 pb-5 border-b border-[#E2D5C3] last:border-0">
                  {/* Emoji icon */}
                  <div className="w-14 h-14 rounded-xl bg-[#FAF6F0] flex items-center justify-center shrink-0 text-2xl">
                    {item.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2C1A0E] text-sm truncate">{item.name}</p>
                    <p className="text-xs text-[#5C4033] opacity-60 mb-1">{item.ageRange}</p>
                    <p className="text-sm font-bold text-[#2C1A0E]">{fmtCLP(item.priceNum)}</p>

                    {/* Note */}
                    <input
                      placeholder="Nota: edad, medida, madera…"
                      value={item.note ?? ''}
                      onChange={e => setNote(item.slug, e.target.value)}
                      className="mt-2 w-full text-xs border border-[#E2D5C3] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#C8924A] placeholder-[#B8A99A]"
                    />
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => remove(item.slug)}
                      className="text-[#B8A99A] hover:text-red-400 transition-colors text-xs"
                    >
                      ✕
                    </button>
                    {/* Qty stepper */}
                    <div className="flex items-center gap-1.5 border border-[#E2D5C3] rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQty(item.slug, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#5C4033] hover:bg-[#FAF6F0] transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-medium text-[#2C1A0E]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQty(item.slug, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#5C4033] hover:bg-[#FAF6F0] transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs font-bold text-[#2C1A0E]">
                      {fmtCLP(item.priceNum * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E2D5C3] px-6 py-5 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-[#5C4033]">
                <span>Subtotal</span>
                <span>{fmtCLP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#5C4033]">
                <span>IVA (19%)</span>
                <span>{fmtCLP(iva)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#2C1A0E] text-base mt-1">
                <span>Total</span>
                <span>{fmtCLP(total)}</span>
              </div>
            </div>
            <p className="text-[10px] text-[#5C4033] opacity-50 text-center">
              Precio referencial · varía según medidas y material final
            </p>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block w-full bg-[#C8924A] text-white text-center py-3.5 rounded-xl font-medium text-sm hover:bg-[#8B5E2D] transition-colors"
            >
              Ir a pagar →
            </Link>
            <Link
              href="/carrito"
              onClick={closeDrawer}
              className="block w-full border border-[#E2D5C3] text-[#5C4033] text-center py-3 rounded-xl text-sm hover:border-[#C8924A] transition-colors"
            >
              Ver carrito completo
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
