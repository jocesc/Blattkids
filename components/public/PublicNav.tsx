'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/lib/cart'
import CartDrawer from './CartDrawer'

const links = [
  { href: '/',         label: 'Inicio'   },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export default function PublicNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, openDrawer } = useCart()

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur border-b border-[#E2D5C3]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-[#2C1A0E]" style={{ fontFamily: 'var(--font-display)' }}>
            Blattkids
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`text-sm transition-colors ${
                  pathname === l.href
                    ? 'text-[#C8924A] font-medium'
                    : 'text-[#5C4033] hover:text-[#2C1A0E]'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side: CTA + cart + equipo */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/contacto"
              className="bg-[#C8924A] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#8B5E2D] transition-colors">
              Cotizar
            </Link>

            {/* Cart icon */}
            <button
              onClick={openDrawer}
              className="relative p-2 text-[#5C4033] hover:text-[#2C1A0E] transition-colors"
              aria-label="Carrito de compras"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C8924A] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            <Link href="/dashboard"
              className="text-xs text-[#5C4033] hover:text-[#2C1A0E] transition-colors opacity-40 hover:opacity-100">
              Equipo
            </Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={openDrawer}
              className="relative p-2 text-[#5C4033]"
              aria-label="Carrito"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C8924A] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-[#2C1A0E]">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#E2D5C3] bg-[#FAF6F0] px-6 py-5 flex flex-col gap-4">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="text-sm text-[#5C4033] hover:text-[#2C1A0E]">
                {l.label}
              </Link>
            ))}
            <Link href="/contacto" onClick={() => setMenuOpen(false)}
              className="mt-2 bg-[#C8924A] text-white px-5 py-2.5 rounded-xl text-sm font-medium text-center">
              Cotizar mueble
            </Link>
          </div>
        )}
      </nav>

      {/* Cart drawer rendered at nav level so it's always available */}
      <CartDrawer />
    </>
  )
}
