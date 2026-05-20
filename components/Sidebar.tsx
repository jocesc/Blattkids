'use client'

import type { Design } from '@/types/blattkids'

interface SidebarProps {
  view: 'new' | 'history'
  onViewChange: (v: 'new' | 'history') => void
  recentDesigns: Design[]
  onSelectDesign: (d: Design) => void
}

export default function Sidebar({ view, onViewChange, recentDesigns, onSelectDesign }: SidebarProps) {
  return (
    <aside className="w-[240px] bg-white border-r border-border-bk flex flex-col py-6 shrink-0 overflow-y-auto">
      {/* Main nav */}
      <div className="px-5 mb-2">
        <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-ink-soft opacity-50 mb-2 px-2">Principal</p>
        <SidebarBtn active={view === 'new'} icon="✦" onClick={() => onViewChange('new')}>
          Nuevo Diseño
        </SidebarBtn>
        <SidebarBtn active={view === 'history'} icon="📁" onClick={() => onViewChange('history')}>
          Historial
        </SidebarBtn>
      </div>

      <div className="h-px bg-border-bk mx-5 my-4" />

      {/* Recent designs */}
      <div className="px-5 mb-2">
        <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-ink-soft opacity-50 mb-2 px-2">Diseños Recientes</p>
      </div>

      <div className="flex flex-col gap-0.5 px-2">
        {recentDesigns.slice(0, 10).map(d => (
          <button
            key={d.id}
            onClick={() => onSelectDesign(d)}
            className="text-left rounded-lg px-3 py-2.5 hover:bg-cream transition-colors"
          >
            <p className="text-[13px] font-medium text-ink truncate">{d.result_json.metadata?.nombre_mueble || 'Diseño'}</p>
            <p className="text-[11px] text-ink-soft opacity-60 mt-0.5">
              {d.result_json.metadata?.edad_rango} · {d.result_json.metadata?.material_principal} · {new Date(d.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
            </p>
            <span className="inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-sage-light text-sage font-medium mt-1">
              {d.result_json.metadata?.area_pedagogica || d.idioma}
            </span>
          </button>
        ))}

        {recentDesigns.length === 0 && (
          <p className="text-[12px] text-ink-soft opacity-50 px-3 py-2">Sin diseños aún</p>
        )}
      </div>

      <div className="h-px bg-border-bk mx-5 my-4" />

      <div className="px-5">
        <SidebarBtn active={false} icon="⚙️" onClick={() => {}}>
          Configuración
        </SidebarBtn>
      </div>
    </aside>
  )
}

function SidebarBtn({
  active, icon, children, onClick,
}: {
  active: boolean
  icon: string
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
        active
          ? 'bg-wood text-white font-medium'
          : 'text-ink-soft hover:bg-cream hover:text-ink'
      }`}
    >
      <span className="w-5 text-center text-base">{icon}</span>
      {children}
    </button>
  )
}
