import type { BlattkidsResult } from '@/types/blattkids'

export default function TabPedagogia({ result }: { result: BlattkidsResult }) {
  const fp = result.ficha_pedagogica

  return (
    <div>
      <div className="bg-gradient-to-br from-[#f0f7f1] to-[#e8f4ea] border border-sage-light rounded-xl p-5 mb-5">
        <p className="text-sm font-medium text-sage mb-2">¿Qué desarrolla este mueble en el niño?</p>
        <p className="text-sm text-ink leading-relaxed">{fp.que_desarrolla}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {fp.principios_montessori.map((p, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white border border-sage-light text-sage">
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-ink mb-1">¿Cómo lo usa el niño?</p>
        <p className="text-sm text-ink-soft leading-relaxed">{fp.como_lo_usa_el_nino}</p>
      </div>

      {fp.beneficios_observables.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-ink mb-2">Beneficios observables</p>
          <ul className="flex flex-col gap-1.5">
            {fp.beneficios_observables.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                <span className="text-sage mt-0.5">•</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
