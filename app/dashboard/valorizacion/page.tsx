'use client'
import { useState } from 'react'

const MADERAS = [
  { id: 'pino', label: 'Pino radiata', factor: 1.0 },
  { id: 'encino', label: 'Encino / Roble', factor: 1.45 },
  { id: 'haya', label: 'Haya europea', factor: 1.6 },
  { id: 'olivo', label: 'Olivo', factor: 1.9 },
]

const ACABADOS = [
  { id: 'cera', label: 'Cera de abeja', extra: 0 },
  { id: 'aceite', label: 'Aceite de linaza', extra: 5000 },
  { id: 'natural', label: 'Sin acabado', extra: -8000 },
]

const BASE_PRICES: Record<string, number> = {
  'estanteria':   145000,
  'cama':         195000,
  'torre':        85000,
  'mesa-silla':   120000,
  'estacion':     155000,
  'armario':      265000,
}

const MUEBLES = [
  { id: 'estanteria', label: 'Estantería Montessori' },
  { id: 'cama',       label: 'Cama piso Montessori' },
  { id: 'torre',      label: 'Torre de aprendizaje' },
  { id: 'mesa-silla', label: 'Mesa y silla' },
  { id: 'estacion',   label: 'Estación de arte' },
  { id: 'armario',    label: 'Armario Montessori' },
]

function fmt(n: number) {
  return n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
}

export default function ValorizacionPage() {
  const [mueble, setMueble] = useState('estanteria')
  const [madera, setMadera] = useState('pino')
  const [acabado, setAcabado] = useState('cera')
  const [personalizado, setPersonalizado] = useState(false)
  const [cantVidas, setCantVidas] = useState(1)

  const base = BASE_PRICES[mueble] ?? 145000
  const maderaFactor = MADERAS.find(m => m.id === madera)?.factor ?? 1
  const acabadoExtra = ACABADOS.find(a => a.id === acabado)?.extra ?? 0
  const personalizadoExtra = personalizado ? 35000 : 0
  const subtotal = Math.round(base * maderaFactor) + acabadoExtra + personalizadoExtra
  const iva = Math.round(subtotal * 0.19)
  const total = subtotal + iva
  const totalCant = total * cantVidas

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
          Valorización
        </h1>
        <p className="text-sm text-ink-soft mt-1">Calcula el precio de un pedido según tipo de mueble y materiales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        {/* Form */}
        <div className="md:col-span-3 bg-white border border-border-bk rounded-2xl p-7 flex flex-col gap-6">

          {/* Mueble */}
          <div>
            <label className="block text-xs font-medium text-ink uppercase tracking-wide mb-3">Tipo de mueble</label>
            <div className="grid grid-cols-2 gap-2">
              {MUEBLES.map(m => (
                <button key={m.id} onClick={() => setMueble(m.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                    mueble === m.id
                      ? 'bg-ink text-white'
                      : 'border border-border-bk text-ink-soft hover:border-wood'
                  }`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Madera */}
          <div>
            <label className="block text-xs font-medium text-ink uppercase tracking-wide mb-3">Madera</label>
            <div className="flex flex-col gap-2">
              {MADERAS.map(m => (
                <button key={m.id} onClick={() => setMadera(m.id)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                    madera === m.id
                      ? 'bg-ink text-white'
                      : 'border border-border-bk text-ink-soft hover:border-wood'
                  }`}>
                  <span>{m.label}</span>
                  <span className={`text-xs ${madera === m.id ? 'text-white/60' : 'text-ink-soft/50'}`}>
                    ×{m.factor.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Acabado */}
          <div>
            <label className="block text-xs font-medium text-ink uppercase tracking-wide mb-3">Acabado</label>
            <div className="flex gap-2 flex-wrap">
              {ACABADOS.map(a => (
                <button key={a.id} onClick={() => setAcabado(a.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    acabado === a.id
                      ? 'bg-ink text-white'
                      : 'border border-border-bk text-ink-soft hover:border-wood'
                  }`}>
                  {a.label}
                  {a.extra !== 0 && (
                    <span className={`ml-1.5 ${acabado === a.id ? 'text-white/60' : 'text-ink-soft/50'}`}>
                      {a.extra > 0 ? `+${fmt(a.extra)}` : fmt(a.extra)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPersonalizado(!personalizado)}
              className={`w-10 h-6 rounded-full transition-all ${personalizado ? 'bg-wood' : 'bg-border-bk'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${personalizado ? 'translate-x-4' : ''}`} />
            </button>
            <div>
              <p className="text-sm font-medium text-ink">Diseño personalizado</p>
              <p className="text-xs text-ink-soft/60">Medidas a pedido + {fmt(35000)}</p>
            </div>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-xs font-medium text-ink uppercase tracking-wide mb-2">Cantidad de unidades</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setCantVidas(Math.max(1, cantVidas - 1))}
                className="w-8 h-8 rounded-lg border border-border-bk text-ink-soft hover:border-wood transition-colors text-lg font-bold flex items-center justify-center">
                −
              </button>
              <span className="text-lg font-bold text-ink w-8 text-center">{cantVidas}</span>
              <button onClick={() => setCantVidas(cantVidas + 1)}
                className="w-8 h-8 rounded-lg border border-border-bk text-ink-soft hover:border-wood transition-colors text-lg font-bold flex items-center justify-center">
                +
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-ink text-white rounded-2xl p-6">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-4">Resumen</p>

            <div className="flex flex-col gap-3 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-white/60">Precio base</span>
                <span>{fmt(base)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Madera (×{maderaFactor.toFixed(2)})</span>
                <span>{fmt(Math.round(base * maderaFactor) - base)}</span>
              </div>
              {acabadoExtra !== 0 && (
                <div className="flex justify-between">
                  <span className="text-white/60">Acabado</span>
                  <span>{acabadoExtra > 0 ? '+' : ''}{fmt(acabadoExtra)}</span>
                </div>
              )}
              {personalizado && (
                <div className="flex justify-between">
                  <span className="text-white/60">Personalizado</span>
                  <span>+{fmt(35000)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white/60">IVA (19%)</span>
                <span className="text-white/60">{fmt(iva)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total c/IVA</span>
                <span className="text-xl font-bold text-wood-light">{fmt(total)}</span>
              </div>
            </div>

            {cantVidas > 1 && (
              <div className="bg-white/8 rounded-xl p-3 text-center">
                <p className="text-xs text-white/50 mb-0.5">{cantVidas} unidades</p>
                <p className="text-lg font-bold text-wood-light">{fmt(totalCant)}</p>
              </div>
            )}
          </div>

          <button className="bg-wood text-white py-3.5 rounded-xl text-sm font-medium hover:bg-wood-dark transition-colors">
            Crear cotización formal
          </button>
          <button className="border border-border-bk text-ink-soft py-3 rounded-xl text-sm font-medium hover:border-wood transition-colors">
            Ir a nuevo pedido →
          </button>
        </div>
      </div>
    </div>
  )
}
