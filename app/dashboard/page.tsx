import { getSession } from '@/lib/session'

const kpis = [
  { label: 'Pedidos este mes',   value: '12',    sub: '+3 vs mes anterior',  color: '#C8924A' },
  { label: 'En producción',      value: '5',     sub: 'Entrega en 2–3 sem.',  color: '#7A9E7E' },
  { label: 'Clientes activos',   value: '28',    sub: 'Total en cartera',     color: '#2C1A0E' },
  { label: 'Cotizaciones abiertas', value: '7',  sub: 'Pendientes de respuesta', color: '#E8A838' },
]

const recent = [
  { id: 'PED-042', cliente: 'Andrea Muñoz',   producto: 'Estantería Montessori',   monto: '$185.000', estado: 'En producción', dias: 8  },
  { id: 'PED-041', cliente: 'Carlos Pérez',    producto: 'Cama piso Montessori',    monto: '$220.000', estado: 'Entregado',     dias: 14 },
  { id: 'PED-040', cliente: 'Valentina Rojas', producto: 'Mesa y silla Montessori', monto: '$145.000', estado: 'Cotización',    dias: 2  },
  { id: 'PED-039', cliente: 'Martín Herrera',  producto: 'Torre de aprendizaje',    monto: '$95.000',  estado: 'En producción', dias: 12 },
  { id: 'PED-038', cliente: 'Sofía Lara',      producto: 'Armario Montessori',      monto: '$310.000', estado: 'Entregado',     dias: 22 },
]

const statusColor: Record<string, string> = {
  'En producción': 'bg-[#7A9E7E]/15 text-[#3D6E42]',
  'Entregado':     'bg-[#C8924A]/10 text-[#8B5E2D]',
  'Cotización':    'bg-[#E8A838]/15 text-[#9B6B08]',
}

export default async function DashboardPage() {
  const session = await getSession()

  return (
    <div className="max-w-5xl mx-auto">

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
          Hola, {session?.displayName} 👋
        </h1>
        <p className="text-sm text-ink-soft mt-1">Aquí tienes el resumen de hoy.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(k => (
          <div key={k.label} className="bg-white border border-border-bk rounded-2xl p-5">
            <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: k.color }} />
            <p className="text-2xl font-bold text-ink mb-1">{k.value}</p>
            <p className="text-xs font-medium text-ink mb-0.5">{k.label}</p>
            <p className="text-[10px] text-ink-soft/60">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-border-bk rounded-2xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-border-bk flex items-center justify-between">
          <p className="font-semibold text-ink text-sm">Pedidos recientes</p>
          <a href="/dashboard/pedidos" className="text-xs text-wood hover:text-wood-dark transition-colors">
            Ver todos →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-bk bg-cream/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-soft uppercase tracking-wide">ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-soft uppercase tracking-wide">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-soft uppercase tracking-wide">Producto</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-soft uppercase tracking-wide">Monto</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-soft uppercase tracking-wide">Estado</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-soft uppercase tracking-wide">Días</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-bk">
              {recent.map(r => (
                <tr key={r.id} className="hover:bg-cream/40 transition-colors">
                  <td className="px-6 py-3.5 text-xs font-mono text-ink-soft">{r.id}</td>
                  <td className="px-6 py-3.5 font-medium text-ink">{r.cliente}</td>
                  <td className="px-6 py-3.5 text-ink-soft">{r.producto}</td>
                  <td className="px-6 py-3.5 font-medium text-ink">{r.monto}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[r.estado]}`}>
                      {r.estado}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-ink-soft text-xs">{r.dias}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/pedidos', icon: '📦', title: 'Nuevo pedido',     text: 'Registrar un pedido de cliente' },
          { href: '/dashboard/diseno',  icon: '✏️', title: 'Generar diseño',   text: 'Crear planos con asistente IA' },
          { href: '/dashboard/clientes',icon: '👤', title: 'Ver clientes',     text: 'Historial y contacto' },
        ].map(a => (
          <a key={a.href} href={a.href}
            className="bg-white border border-border-bk rounded-2xl p-5 hover:border-wood hover:shadow-sm transition-all">
            <span className="text-2xl mb-3 block">{a.icon}</span>
            <p className="font-semibold text-ink text-sm mb-1">{a.title}</p>
            <p className="text-xs text-ink-soft">{a.text}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
