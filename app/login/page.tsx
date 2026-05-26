'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Error de conexión, intenta de nuevo')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-wood-dark mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Blatt<span className="text-sage">kids</span>
          </h1>
          <p className="text-sm text-ink-soft opacity-70">Diseñador Montessori</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-border-bk rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-ink mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-ink-soft uppercase tracking-wide mb-1.5">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="jm · socio"
                className="w-full border border-border-bk rounded-xl px-4 py-3 text-sm bg-cream text-ink placeholder:text-ink-soft/40 outline-none focus:border-wood transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-ink-soft uppercase tracking-wide mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full border border-border-bk rounded-xl px-4 py-3 text-sm bg-cream text-ink outline-none focus:border-wood transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 bg-ink text-white rounded-xl py-3 text-sm font-medium hover:bg-wood-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pending ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Accent line */}
        <div className="h-0.5 mt-6 rounded-full mx-auto w-20" style={{ background: 'linear-gradient(90deg, var(--color-wood), var(--color-sage))' }} />
      </div>
    </div>
  )
}
