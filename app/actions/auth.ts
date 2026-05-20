'use server'

import { redirect } from 'next/navigation'
import { createSession, deleteSession } from '@/lib/session'

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

export async function login(formData: FormData) {
  const username = (formData.get('username') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  const user = USERS[username]
  if (!user || user.password !== password) {
    return { error: 'Usuario o contraseña incorrectos' }
  }

  await createSession(username, user.displayName)
  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
