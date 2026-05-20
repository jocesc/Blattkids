'use client'

import { useState } from 'react'
import type { BlattkidsResult, TabName } from '@/types/blattkids'
import TabPedagogia from './tabs/TabPedagogia'
import TabPlanos from './tabs/TabPlanos'
import TabPiezas from './tabs/TabPiezas'
import TabSeguridad from './tabs/TabSeguridad'
import TabCostos from './tabs/TabCostos'

interface ResultPanelProps {
  result: BlattkidsResult
  onExportPDF: () => void
  onExportDOCX: () => void
  exporting: boolean
}

const TABS: { id: TabName; label: string }[] = [
  { id: 'pedagogia', label: '📚 Pedagógico' },
  { id: 'planos', label: '📐 Planos' },
  { id: 'piezas', label: '🔩 Piezas CNC' },
  { id: 'seguridad', label: '🔒 Seguridad' },
  { id: 'costos', label: '💰 Costos' },
]

function clp(n: number) {
  return `$${n.toLocaleString('es-CL')}`
}

export default function ResultPanel({ result, onExportPDF, onExportDOCX, exporting }: ResultPanelProps) {
  const [activeTab, setActiveTab] = useState<TabName>('pedagogia')
  const meta = result.metadata
  const segOk = result.seguridad.normas.en71_cumple && result.seguridad.normas.astm_f963_cumple
  const precio = result.costos_clp.resumen.precio_venta_sugerido
  const aprov = result.piezas_cnc.aprovechamiento_porcentaje

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Mueble" value={meta.nombre_mueble} sub={`${meta.edad_rango} · ${meta.etapa_montessori}`} />
        <StatCard
          label="Precio de Venta Sugerido"
          value={`${clp(precio)} CLP`}
          sub={`Margen ${result.costos_clp.resumen.margen_porcentaje}% · Costo ${clp(result.costos_clp.resumen.costo_total_produccion)}`}
        />
        <StatCard
          label="Material"
          value={`${meta.material_principal} ${result.seguridad.normas.material_certificado}`}
          sub={`${result.piezas_cnc.numero_planchas} plancha(s) 1220×2440mm · ${aprov}% aprovech.`}
        />
        <StatCard
          label="Seguridad"
          value={segOk ? '✓ OK' : '⚠ Revisar'}
          sub={`EN 71 · ASTM F963 · Cantos ${result.seguridad.normas.cantos_radio_mm}mm`}
          valueColor={segOk ? 'text-success' : 'text-warn'}
        />
      </div>

      {/* Tabs selector */}
      <div className="flex gap-1 bg-cream rounded-xl p-1 mb-5 w-fit flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-[13px] transition-all ${
              activeTab === t.id
                ? 'bg-white text-ink font-medium shadow-sm'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white border border-border-bk rounded-2xl p-7 mb-4">
        <p className="text-xs font-medium uppercase tracking-[1.2px] text-wood-dark mb-4">
          {activeTab === 'pedagogia' && 'Ficha Pedagógica · Para mostrar al cliente'}
          {activeTab === 'planos' && 'Vista de Planos · Dimensiones generales'}
          {activeTab === 'piezas' && 'Lista de Corte CNC · Plancha estándar 1220×2440mm'}
          {activeTab === 'seguridad' && 'Validación de Seguridad Montessori'}
          {activeTab === 'costos' && 'Costos y Precio de Venta · CLP'}
        </p>
        {activeTab === 'pedagogia' && <TabPedagogia result={result} />}
        {activeTab === 'planos' && <TabPlanos result={result} />}
        {activeTab === 'piezas' && <TabPiezas result={result} />}
        {activeTab === 'seguridad' && <TabSeguridad result={result} />}
        {activeTab === 'costos' && <TabCostos result={result} />}
      </div>

      {/* Export bar */}
      <div className="flex items-center gap-3 p-4 bg-white border border-border-bk rounded-xl">
        <span className="text-sm text-ink-soft flex-1">
          📄 Documento listo — exporta el reporte completo con planos y BOM
        </span>
        <button
          onClick={onExportPDF}
          disabled={exporting}
          className="flex items-center gap-2 bg-[#E8453C] hover:bg-[#d03c34] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
        >
          ⬇ PDF
        </button>
        <button
          onClick={onExportDOCX}
          disabled={exporting}
          className="flex items-center gap-2 bg-[#2B5EBE] hover:bg-[#244fa8] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
        >
          ⬇ DOCX
        </button>
      </div>
    </div>
  )
}

function StatCard({
  label, value, sub, valueColor = 'text-ink',
}: {
  label: string
  value: string
  sub?: string
  valueColor?: string
}) {
  return (
    <div className="bg-white border border-border-bk rounded-xl p-5 flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-[1px] text-ink-soft opacity-60">{label}</span>
      <span className={`text-[26px] leading-tight ${valueColor}`} style={{ fontFamily: 'var(--font-display)' }}>
        {value}
      </span>
      {sub && <span className="text-xs text-sage font-medium">{sub}</span>}
    </div>
  )
}
