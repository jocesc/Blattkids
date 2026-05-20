import Link from 'next/link'

export default function PublicFooter() {
  return (
    <footer className="bg-[#1A0F07] text-white">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/8">

          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-2xl font-bold mb-3 tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}>
              Blattkids
            </p>
            <p className="text-sm text-white/45 leading-relaxed max-w-xs">
              Muebles Montessori de madera natural para niños de 0 a 10 años.
              Diseñados para la independencia, el orden y la belleza.
            </p>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mt-5">
              {['EN 71-1', 'ASTM F963', '100% natural'].map(b => (
                <span key={b}
                  className="text-[10px] font-medium text-white/30 border border-white/10 rounded-full px-3 py-1">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-white/25 mb-5">Navegar</p>
            <div className="flex flex-col gap-3">
              {[
                { href: '/',          label: 'Inicio'   },
                { href: '/catalogo',  label: 'Catálogo' },
                { href: '/nosotros',  label: 'Nosotros' },
                { href: '/contacto',  label: 'Contacto' },
                { href: '/carrito',   label: 'Carrito'  },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="text-sm text-white/45 hover:text-white transition-colors w-fit">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-white/25 mb-5">Contacto</p>
            <div className="flex flex-col gap-3 text-sm text-white/45">
              <span>Santiago, Chile</span>
              <a href="mailto:hola@blattkids.cl"
                className="hover:text-white transition-colors">
                hola@blattkids.cl
              </a>
              <a href="https://wa.me/56912345678"
                className="hover:text-white transition-colors">
                +56 9 1234 5678
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-7 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/20">
            © {new Date().getFullYear()} Blattkids. Todos los derechos reservados.
          </p>
          <p className="text-[11px] text-white/20">
            Filosofía Montessori · Santiago, Chile
          </p>
        </div>
      </div>
    </footer>
  )
}
