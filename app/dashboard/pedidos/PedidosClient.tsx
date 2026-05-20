'use client'
import { useState } from 'react'
import type { Order, OrderStatus } from '@/lib/orders'

const ESTADOS: { value: 'all' | OrderStatus; label: string }[] = [
  { value: 'all',           label: 'Todos' },
  { value: 'pending',       label: 'Pendiente' },
  { value: 'confirmed',     label: 'Confirmado' },
  { value: 'in_production', label: 'En producción' },
  { value: 'delivered',     label: 'Entregado' },
  { value: 'cancelled',     label: 'Cancelado' },
]

const statusStyle: Record<OrderStatus, string> = {
  pending:       'bg-yellow-50 text-yellow-700',
  confirmed:     'bg-blue-50 text-blue-700',
  in_production: 'bg-[#7A9E7E]/15 text-[#3D6E42]',
  delivered:     'bg-[#C8924A]/10 text-[#8B5E2D]',
  cancelled:     'bg-red-50 text-red-500',
}

const statusLabel: Record<OrderStatus, string> = {
  pending:       'Pendiente',
  confirmed:     'Confirmado',
  in_production: 'En producción',
  delivered:     'Entregado',
  cancelled:     'Cancelado',
}

function fmt(n: number) {
  return n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

interface Props { initialOrders: Order[] }

export default function PedidosClient({ initialOrders }: Props) {
  const [filtro, setFiltro] = useState<'all' | OrderStatus>('all')
  const [busqueda, setBusqueda] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)

  const lista = initialOrders.filter(p => {
    const estadoOk = filtro === 'all' || p.status === filtro
    const q = busqueda.toLowerCase()
    const busOk = !q ||
      p.customer_name.toLowerCase().includes(q) ||
      p.customer_email.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    return estadoOk && busOk
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
            Pedidos
          </h1>
          <p className="text-sm text-ink-soft mt-1">{initialOrders.length} pedidos registrados</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por cliente, email o ID..."
          className="border border-border-bk rounded-xl px-4 py-2 text-sm text-ink bg-white focus:outline-none focus:border-wood w-72 placeholder:text-ink-soft/40"
        />
        <div className="flex gap-2 flex-wrap">
          {ESTADOS.map(e => (
            <button key={e.value} onClick={() => setFiltro(e.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                filtro === e.value ? 'bg-ink text-white' : 'border border-border-bk text-ink-soft hover:border-wood'
              }`}>
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {initialOrders.length === 0 ? (
        <div className="bg-white border border-border-bk rounded-2xl p-12 text-center">
          <p className="text-ink-soft text-sm">Aún no hay pedidos registrados.</p>
          <p className="text-ink-soft/60 text-xs mt-1">
            Aparecerán aquí cuando los clientes completen el checkout.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border-bk rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-bk bg-cream/50">
                {['ID', 'Cliente', 'Productos', 'Total', 'Estado', 'Fecha', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-ink-soft uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-bk">
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-ink-soft text-sm">Sin resultados</td>
                </tr>
              ) : lista.map(p => (
                <tr key={p.id} className="hover:bg-cream/40 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-ink-soft">{p.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink">{p.customer_name}</p>
                    <p className="text-xs text-ink-soft/60">{p.customer_email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft text-xs">
                    {p.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-ink">{fmt(p.total_clp)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[p.status]}`}>
                      {statusLabel[p.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-ink-soft">{fmtDate(p.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setSelected(p)}
                      className="text-xs text-wood hover:text-wood-dark transition-colors"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-7 max-w-lg w-full shadow-xl max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="font-mono text-xs text-ink-soft mb-1">{selected.id}</p>
                <h2 className="text-lg font-bold text-ink">{selected.customer_name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-ink-soft hover:text-ink text-lg">✕</button>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-soft mb-1">Contacto</p>
                <p className="text-ink">{selected.customer_email}</p>
                <p className="text-ink">{selected.customer_phone}</p>
                <p className="text-ink-soft">{selected.shipping_address}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-ink-soft mb-2">Productos</p>
                <ul className="flex flex-col gap-1">
                  {selected.items.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span className="text-ink">{item.quantity}× {item.name}</span>
                      <span className="text-ink-soft">{fmt(item.priceNum * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border-bk pt-3 flex flex-col gap-1">
                <div className="flex justify-between text-ink-soft">
                  <span>Subtotal</span><span>{fmt(selected.subtotal_clp)}</span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>IVA</span><span>{fmt(selected.iva_clp)}</span>
                </div>
                <div className="flex justify-between font-bold text-ink">
                  <span>Total</span><span>{fmt(selected.total_clp)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[selected.status]}`}>
                  {statusLabel[selected.status]}
                </span>
                {selected.payment_provider && (
                  <span className="text-xs text-ink-soft">
                    {selected.payment_provider.toUpperCase()} · {selected.payment_ref}
                  </span>
                )}
              </div>

              <p className="text-xs text-ink-soft">
                Creado: {fmtDate(selected.created_at)} · Actualizado: {fmtDate(selected.updated_at)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
