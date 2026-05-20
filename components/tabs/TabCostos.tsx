import type { BlattkidsResult } from '@/types/blattkids'

function clp(n: number) {
  return `$${n.toLocaleString('es-CL')}`
}

export default function TabCostos({ result }: { result: BlattkidsResult }) {
  const { materiales, fabricacion, resumen, nota_precios } = result.costos_clp

  return (
    <div>
      {/* Materiales */}
      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft mb-3">Materiales</p>
      <div className="mb-5">
        {materiales.map((m, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-border-bk text-sm">
            <div>
              <span className="text-ink-soft">{m.item}</span>
              <span className="text-ink-soft opacity-60 text-xs ml-2">({m.especificacion} · {m.cantidad})</span>
            </div>
            <span className="font-medium text-ink">{clp(m.total)}</span>
          </div>
        ))}
        <div className="flex justify-between items-center py-2.5 text-sm font-semibold text-ink">
          <span>Subtotal materiales</span>
          <span>{clp(resumen.subtotal_materiales)}</span>
        </div>
      </div>

      {/* Fabricación */}
      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft mb-3">Fabricación</p>
      <div className="mb-5">
        {fabricacion.map((f, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-border-bk text-sm">
            <div>
              <span className="text-ink-soft">{f.concepto}</span>
              <span className="text-ink-soft opacity-60 text-xs ml-2">({f.horas}h × {clp(f.valor_hora)})</span>
            </div>
            <span className="font-medium text-ink">{clp(f.total)}</span>
          </div>
        ))}
        <div className="flex justify-between items-center py-2.5 text-sm font-semibold text-ink">
          <span>Subtotal fabricación</span>
          <span>{clp(resumen.subtotal_fabricacion)}</span>
        </div>
      </div>

      {/* Price box */}
      <div className="bg-ink rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/70">Precio de venta sugerido · Margen {resumen.margen_porcentaje}%</p>
          <p className="text-xs text-white/40 mt-0.5">Costo producción {clp(resumen.costo_total_produccion)} CLP</p>
        </div>
        <p className="text-2xl font-bold text-wood-light" style={{ fontFamily: 'var(--font-display)' }}>
          {clp(resumen.precio_venta_sugerido)} <span className="text-sm font-normal text-white/50">CLP</span>
        </p>
      </div>

      {/* Precio mínimo */}
      <div className="flex justify-between items-center mt-3 px-1 text-sm">
        <span className="text-ink-soft opacity-70">Precio mínimo sin ganancia</span>
        <span className="font-medium text-ink-soft">{clp(resumen.precio_minimo_sin_ganancia)} CLP</span>
      </div>

      {nota_precios && (
        <p className="text-xs text-ink-soft opacity-60 mt-4 leading-relaxed">{nota_precios}</p>
      )}
    </div>
  )
}
