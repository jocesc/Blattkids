import type { BlattkidsResult } from '@/types/blattkids'

export default function TabSeguridad({ result }: { result: BlattkidsResult }) {
  const { validacion_montessori: vm, normas, advertencias } = result.seguridad

  const checks = [
    { label: 'Acceso independiente del niño', ok: vm.acceso_sin_adulto, note: vm.acceso_sin_adulto_nota },
    { label: 'Peso manejable por el niño', ok: vm.peso_manejable, note: vm.peso_manejable_nota },
    { label: 'Invita al orden visual', ok: vm.orden_visual, note: '' },
    { label: 'Belleza humble (sin excesos)', ok: vm.belleza_humble, note: '' },
    { label: 'Promueve independencia progresiva', ok: vm.independencia_progresiva, note: '' },
    { label: `Norma EN 71-1 · ${normas.en71_nota}`, ok: normas.en71_cumple, note: '' },
    { label: `Norma ASTM F963 · ${normas.astm_f963_nota}`, ok: normas.astm_f963_cumple, note: '' },
  ]

  return (
    <div>
      {/* Material badge */}
      <div className="flex gap-3 mb-5">
        <div className="text-xs bg-cream border border-border-bk rounded-full px-3 py-1">
          Material: <strong>{normas.material_certificado}</strong>
        </div>
        <div className="text-xs bg-cream border border-border-bk rounded-full px-3 py-1">
          Cantos: <strong>Radio {normas.cantos_radio_mm} mm</strong>
        </div>
      </div>

      {/* Validation checklist */}
      <div className="flex flex-col gap-3 mb-6">
        {checks.map((c, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-cream">
            <span className={`text-lg shrink-0 ${c.ok ? 'text-success' : 'text-warn'}`}>
              {c.ok ? '✅' : '❌'}
            </span>
            <div>
              <p className="text-sm text-ink">{c.label}</p>
              {c.note && <p className="text-xs text-ink-soft opacity-70 mt-0.5">{c.note}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Warnings */}
      {advertencias.length > 0 && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-warn mb-2">Advertencias</p>
          <div className="flex flex-col gap-2">
            {advertencias.map((adv, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#fdf6e8] border border-[#f5dda0]">
                <span className="text-lg shrink-0">⚠️</span>
                <p className="text-sm text-ink-soft">{adv}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
