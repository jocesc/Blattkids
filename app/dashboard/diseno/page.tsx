import { getDesigns } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import DisenoClient from './DisenoClient'

export default async function DisenoPage() {
  const session = await getSession()
  const designs = await getDesigns(session!.userId)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
          Diseño con IA
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          Genera planos técnicos Montessori con medidas certificadas y lista de piezas.
        </p>
      </div>
      <DisenoClient initialDesigns={designs} />
    </div>
  )
}
