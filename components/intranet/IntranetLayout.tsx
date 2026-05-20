'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { logout } from '@/app/actions/auth'

const nav = [
  { href: '/dashboard',               icon: '◼', label: 'Inicio'        },
  { href: '/dashboard/pedidos',        icon: '📦', label: 'Pedidos'       },
  { href: '/dashboard/clientes',       icon: '👤', label: 'Clientes'      },
  { href: '/dashboard/valorizacion',   icon: '🧮', label: 'Valorización'  },
  { href: '/dashboard/diseno',         icon: '✏️', label: 'Diseño IA'     },
  { href: '/dashboard/configuracion',  icon: '⚙️', label: 'Configuración' },
]

interface Props {
  displayName: string
  children: React.ReactNode
}

export default function IntranetLayout({ displayName, children }: Props) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream">

      {/* Sidebar */}
      <aside className={`flex flex-col bg-ink text-white shrink-0 transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'}`}>

        {/* Brand */}
        <div className="h-16 flex items-center px-4 border-b border-white/10 gap-3">
          {!collapsed && (
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Blattkids
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-white/40 hover:text-white transition-colors text-sm p-1"
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive(item.href)
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/55 hover:bg-white/8 hover:text-white/90'
              }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/10 p-3">
          <div className={`flex items-center gap-3 px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-7 h-7 rounded-full bg-wood/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-wood-light">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{displayName}</p>
                <form action={logout}>
                  <button type="submit" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">
                    Cerrar sesión
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-border-bk flex items-center px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <Link href="/" className="hover:text-wood transition-colors text-xs">
              ← Sitio público
            </Link>
          </div>
          <div className="ml-auto text-xs text-ink-soft/50">
            {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
