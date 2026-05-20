import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDesigns, deleteDesign } from '@/lib/supabase'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const designs = await getDesigns(session.userId)
  return NextResponse.json(designs)
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await request.json()
  const ok = await deleteDesign(id)
  return NextResponse.json({ ok })
}
