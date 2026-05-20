import type { BlattkidsResult } from '@/types/blattkids'

export default function TabPlanos({ result }: { result: BlattkidsResult }) {
  const d = result.diseno

  return (
    <div>
      {/* Dimensiones */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <DimCard label="Alto" value={`${d.dimensiones_generales.alto_cm} cm`} />
        <DimCard label="Ancho" value={`${d.dimensiones_generales.ancho_cm} cm`} />
        <DimCard label="Profundidad" value={`${d.dimensiones_generales.profundidad_cm} cm`} />
      </div>

      <p className="text-sm text-ink-soft leading-relaxed mb-6">{d.descripcion_forma}</p>

      {/* ASCII Views */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft mb-2">Vista Frontal</p>
          <pre className="ascii-art">{d.vista_frontal_ascii}</pre>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft mb-2">Vista Lateral</p>
          <pre className="ascii-art">{d.vista_lateral_ascii}</pre>
        </div>
      </div>

      {d.notas_diseno && (
        <div className="bg-cream rounded-xl p-4 border border-border-bk">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft mb-1">Notas de diseño</p>
          <p className="text-sm text-ink leading-relaxed">{d.notas_diseno}</p>
        </div>
      )}

      <p className="text-xs text-ink-soft opacity-60 text-center mt-4">
        Los planos técnicos detallados con cotas completas se exportan en el PDF
      </p>
    </div>
  )
}

function DimCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cream rounded-xl p-4 text-center border border-border-bk">
      <p className="text-[10px] uppercase tracking-wide text-ink-soft opacity-60 mb-1">{label}</p>
      <p className="text-[26px] text-ink" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
    </div>
  )
}
