'use client'

import { useState } from 'react'
import type { Design } from '@/types/blattkids'

function clp(n: number) {
  return `$${n.toLocaleString('es-CL')}`
}

interface HistoryViewProps {
  designs: Design[]
  onSelect: (d: Design) => void
  onDelete: (id: string) => void
}

export default function HistoryView({ designs, onSelect, onDelete }: HistoryViewProps) {
  const [filter, setFilter] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = designs.filter(d => {
    if (!filter) return true
    const q = filter.toLowerCase()
    return (
      d.result_json.metadata?.nombre_mueble?.toLowerCase().includes(q) ||
      d.result_json.metadata?.area_pedagogica?.toLowerCase().includes(q) ||
      d.result_json.metadata?.edad_rango?.toLowerCase().includes(q) ||
      d.prompt_text?.toLowerCase().includes(q)
    )
  })

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await fetch('/api/designs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      onDelete(id)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[28px] font-bold text-ink leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Historial de Diseños
          </h1>
          <p className="text-sm text-ink-soft opacity-70 mt-1">{designs.length} diseños guardados</p>
        </div>
      </div>

      <div className="h-[3px] rounded-full mb-6" style={{ background: 'linear-gradient(90deg, var(--color-wood), var(--color-sage))' }} />

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Buscar por nombre, área, edad..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full max-w-sm border border-border-bk rounded-xl px-4 py-2.5 text-sm bg-white text-ink outline-none focus:border-wood transition-colors"
        />
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-border-bk rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-ink font-medium">
            {designs.length === 0 ? 'Aún no hay diseños guardados' : 'Sin resultados para ese filtro'}
          </p>
          <p className="text-sm text-ink-soft opacity-60 mt-1">
            {designs.length === 0
              ? 'Genera tu primer diseño desde "Nuevo Diseño"'
              : 'Intenta con otro término de búsqueda'}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map(d => {
          const m = d.result_json.metadata || {}
          const precio = d.result_json.costos_clp?.resumen?.precio_venta_sugerido
          const segOk = d.result_json.seguridad?.normas?.en71_cumple && d.result_json.seguridad?.normas?.astm_f963_cumple

          return (
            <div
              key={d.id}
              className="bg-white border border-border-bk rounded-2xl p-5 flex items-center gap-4 hover:border-wood/40 transition-colors group"
            >
              {/* Click area */}
              <button
                onClick={() => onSelect(d)}
                className="flex-1 text-left min-w-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-semibold text-ink truncate">{m.nombre_mueble || 'Diseño'}</p>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ${segOk ? 'bg-green-50 text-success' : 'bg-yellow-50 text-warn'}`}>
                    {segOk ? '✓ OK' : '⚠ Revisar'}
                  </span>
                </div>
                <p className="text-sm text-ink-soft">
                  {m.edad_rango} · {m.etapa_montessori} · {m.area_pedagogica}
                </p>
                <p className="text-xs text-ink-soft opacity-60 mt-1">
                  {m.material_principal} · {new Date(d.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </button>

              {/* Price */}
              {precio && (
                <div className="text-right shrink-0">
                  <p className="text-xs text-ink-soft opacity-60">Precio venta</p>
                  <p className="text-base font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
                    {clp(precio)} CLP
                  </p>
                </div>
              )}

              {/* Delete */}
              <button
                onClick={() => handleDelete(d.id)}
                disabled={deleting === d.id}
                className="text-ink-soft/30 hover:text-red-400 transition-colors text-lg opacity-0 group-hover:opacity-100 shrink-0"
                title="Eliminar diseño"
              >
                {deleting === d.id ? '⌛' : '🗑'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
