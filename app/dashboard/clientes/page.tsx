'use client'
import { useState } from 'react'

const CLIENTES = [
  { id: 'CLI-001', nombre: 'Andrea Muñoz',    email: 'andrea@gmail.com',       telefono: '+56 9 8123 4567', pedidos: 3, ultima: '2025-05-10', ciudad: 'Santiago' },
  { id: 'CLI-002', nombre: 'Carlos Pérez',    email: 'carlos.perez@email.cl',  telefono: '+56 9 7234 5678', pedidos: 2, ultima: '2025-05-04', ciudad: 'Providencia' },
  { id: 'CLI-003', nombre: 'Valentina Rojas', email: 'valerojasm@hotmail.com', telefono: '+56 9 6345 6789', pedidos: 1, ultima: '2025-05-16', ciudad: 'Las Condes' },
  { id: 'CLI-004', nombre: 'Martín Herrera',  email: 'martin.h@empresa.cl',    telefono: '+56 9 5456 7890', pedidos: 4, ultima: '2025-05-06', ciudad: 'Ñuñoa' },
  { id: 'CLI-005', nombre: 'Sofía Lara',      email: 'sofia.lara@gmail.com',   telefono: '+56 9 4567 8901', pedidos: 2, ultima: '2025-04-26', ciudad: 'Vitacura' },
  { id: 'CLI-006', nombre: 'Diego Fuentes',   email: 'dfuentes@correo.cl',     telefono: '+56 9 3678 9012', pedidos: 1, ultima: '2025-04-20', ciudad: 'Maipú' },
]

export default function ClientesPage() {
  const [busqueda, setBusqueda] = useState('')

  const lista = CLIENTES.filter(c =>
    !busqueda ||
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
            Clientes
          </h1>
          <p className="text-sm text-ink-soft mt-1">{CLIENTES.length} clientes en cartera</p>
        </div>
        <button className="bg-wood text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-wood-dark transition-colors">
          + Nuevo cliente
        </button>
      </div>

      <div className="mb-5">
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="border border-border-bk rounded-xl px-4 py-2 text-sm text-ink bg-white focus:outline-none focus:border-wood w-72 placeholder:text-ink-soft/40"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lista.map(c => (
          <div key={c.id} className="bg-white border border-border-bk rounded-2xl p-5 hover:border-wood hover:shadow-sm transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-wood/15 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-wood">{c.nombre.charAt(0)}</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-ink text-sm truncate">{c.nombre}</p>
                <p className="text-xs text-ink-soft truncate">{c.ciudad}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-ink-soft mb-4">
              <span className="truncate">✉ {c.email}</span>
              <span>📱 {c.telefono}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border-bk pt-3">
              <div>
                <p className="text-xs text-ink-soft/60">Pedidos</p>
                <p className="text-sm font-bold text-ink">{c.pedidos}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-soft/60">Última compra</p>
                <p className="text-xs text-ink-soft">{c.ultima}</p>
              </div>
              <button className="text-xs text-wood hover:text-wood-dark transition-colors font-medium">
                Ver →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
