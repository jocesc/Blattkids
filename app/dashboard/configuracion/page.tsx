export default function ConfiguracionPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
          Configuración
        </h1>
        <p className="text-sm text-ink-soft mt-1">Ajustes del sistema y datos del negocio.</p>
      </div>

      <div className="flex flex-col gap-5">

        {/* Empresa */}
        <section className="bg-white border border-border-bk rounded-2xl p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-wood mb-5">Datos del negocio</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Nombre', value: 'Blattkids' },
              { label: 'Email de contacto', value: 'hola@blattkids.cl' },
              { label: 'Teléfono', value: '+56 9 1234 5678' },
              { label: 'Ciudad', value: 'Santiago, Chile' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-medium text-ink-soft uppercase tracking-wide mb-1.5">{f.label}</label>
                <input
                  defaultValue={f.value}
                  className="w-full border border-border-bk rounded-xl px-4 py-2.5 text-sm text-ink bg-cream focus:outline-none focus:border-wood transition-colors"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Tiempos de producción */}
        <section className="bg-white border border-border-bk rounded-2xl p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-wood mb-5">Tiempos de producción (semanas)</p>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Estantería / Mesa / Silla', value: '2' },
              { label: 'Cama piso / Armario',       value: '3' },
              { label: 'Diseño personalizado',      value: '4' },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">{f.label}</span>
                <input
                  defaultValue={f.value}
                  type="number"
                  min={1}
                  className="w-16 border border-border-bk rounded-lg px-3 py-1.5 text-sm text-ink text-center bg-cream focus:outline-none focus:border-wood transition-colors"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Usuarios */}
        <section className="bg-white border border-border-bk rounded-2xl p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-wood mb-5">Usuarios del sistema</p>
          <div className="flex flex-col gap-3">
            {[
              { user: 'jm',    role: 'Administrador' },
              { user: 'socio', role: 'Socio' },
            ].map(u => (
              <div key={u.user} className="flex items-center justify-between py-2 border-b border-border-bk last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-wood/15 flex items-center justify-center">
                    <span className="text-xs font-bold text-wood">{u.user.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{u.user}</p>
                    <p className="text-xs text-ink-soft/60">{u.role}</p>
                  </div>
                </div>
                <button className="text-xs text-ink-soft/40 hover:text-wood transition-colors">
                  Cambiar contraseña
                </button>
              </div>
            ))}
          </div>
        </section>

        <button className="bg-wood text-white py-3 rounded-xl text-sm font-medium hover:bg-wood-dark transition-colors">
          Guardar cambios
        </button>
      </div>
    </div>
  )
}
