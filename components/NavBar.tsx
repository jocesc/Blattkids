'use client'

import { logout } from '@/app/actions/auth'

interface NavBarProps {
  displayName: string
  idioma: 'es' | 'en'
  onIdiomaChange: (l: 'es' | 'en') => void
}

export default function NavBar({ displayName, idioma, onIdiomaChange }: NavBarProps) {
  const initials = displayName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <nav className="bg-ink h-[60px] px-8 flex items-center justify-between sticky top-0 z-50 shrink-0">
      {/* Logo */}
      <span className="text-wood-light text-[22px] font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
        Blatt<span className="text-sage-light">kids</span>
      </span>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Lang toggle */}
        <button
          onClick={() => onIdiomaChange(idioma === 'es' ? 'en' : 'es')}
          className="text-white text-[13px] bg-white/10 border border-white/20 rounded-full px-3 py-1 hover:bg-white/20 transition-colors"
        >
          🌐 <span className={idioma === 'es' ? 'font-medium' : 'opacity-50'}>ES</span>
          {' / '}
          <span className={idioma === 'en' ? 'font-medium' : 'opacity-50'}>EN</span>
        </button>

        {/* User avatar + logout */}
        <form action={logout}>
          <button
            type="submit"
            title={`${displayName} · Cerrar sesión`}
            className="w-[34px] h-[34px] rounded-full bg-wood flex items-center justify-center text-white text-sm font-medium hover:bg-wood-dark transition-colors"
          >
            {initials}
          </button>
        </form>
      </div>
    </nav>
  )
}
