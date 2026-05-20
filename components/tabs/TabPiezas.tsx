import type { BlattkidsResult } from '@/types/blattkids'

export default function TabPiezas({ result }: { result: BlattkidsResult }) {
  const cnc = result.piezas_cnc

  return (
    <div>
      {/* Info banner */}
      <div className="flex flex-wrap gap-4 mb-5 p-3 bg-cream rounded-xl border border-border-bk text-sm">
        <Stat label="Planchas" value={`${cnc.numero_planchas} × ${cnc.plancha_estandar}`} />
        <Stat label="Aprovechamiento" value={`${cnc.aprovechamiento_porcentaje}%`} success={cnc.aprovechamiento_porcentaje >= 90} />
        <Stat label="Ensamble" value={cnc.tipo_ensamble} />
        <Stat label="Tolerancia" value={`${cnc.tolerancia_mm} mm`} />
      </div>

      {/* Pieces table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-cream">
              {['N°', 'Pieza', 'Largo', 'Ancho', 'Espesor', 'Cant.', 'Material'].map(h => (
                <th key={h} className="text-left px-3 py-2.5 text-[11px] uppercase tracking-[0.8px] text-ink-soft font-medium border-b border-border-bk">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cnc.piezas.map((p, i) => (
              <tr key={p.numero} className={`border-b border-border-bk hover:bg-cream transition-colors ${i % 2 === 1 ? 'bg-[#fdf9f4]' : ''}`}>
                <td className="px-3 py-2.5 text-ink-soft">{p.numero}</td>
                <td className="px-3 py-2.5 text-ink font-medium">{p.nombre}</td>
                <td className="px-3 py-2.5 text-ink">{p.largo_cm} cm</td>
                <td className="px-3 py-2.5 text-ink">{p.ancho_cm} cm</td>
                <td className="px-3 py-2.5 text-ink">{p.espesor_cm} cm</td>
                <td className="px-3 py-2.5 text-ink font-medium">{p.cantidad}</td>
                <td className="px-3 py-2.5 text-ink">{p.material}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assembly sequence */}
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-wood-dark mb-3">Secuencia de ensamble</p>
        <ol className="flex flex-col gap-2">
          {cnc.secuencia_ensamble.map((paso, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="min-w-[22px] h-[22px] rounded-full bg-wood text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-ink leading-relaxed">{paso}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Acabado */}
      <div className="bg-cream border border-border-bk rounded-xl p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-wood-dark mb-3">Acabado</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoRow label="Producto" value={cnc.acabado.producto} />
          <InfoRow label="Aplicación" value={cnc.acabado.aplicacion} />
          <InfoRow label="Manos" value={String(cnc.acabado.manos)} />
          <InfoRow label="Secado" value={`${cnc.acabado.tiempo_secado_horas} horas`} />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-ink-soft opacity-60">{label}</p>
      <p className={`text-sm font-medium ${success ? 'text-success' : 'text-ink'}`}>{value}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-ink-soft opacity-60">{label}</p>
      <p className="text-sm text-ink">{value}</p>
    </div>
  )
}
