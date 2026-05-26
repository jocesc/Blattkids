import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/session'
import { checkRateLimit } from '@/lib/rateLimit'

const USERS: Record<string, { password: string; displayName: string }> = {
  jm: {
    password: process.env.USER_JM_PASSWORD || 'blattkids2024',
    displayName: 'José María',
  },
  socio: {
    password: process.env.USER_SOCIO_PASSWORD || 'blattkids2024',
    displayName: 'Socio',
  },
}

export async function POST(req: NextRequest) {
  // Rate limit por IP: 5 intentos por minuto
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'

  const { allowed } = checkRateLimit(`login:${ip}`)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera un minuto e intenta de nuevo.' },
      { status: 429 }
    )
  }

  const { username, password } = await req.json()

  const user = USERS[username?.trim().toLowerCase()]
  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 })
  }

  await createSession(username.trim().toLowerCase(), user.displayName)
  return NextResponse.json({ ok: true })
}
