import { createClient } from '@supabase/supabase-js'
import type { Design } from '@/types/blattkids'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
// Use service role key server-side so RLS applies to anon requests but not to our server
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured =
  supabaseUrl.startsWith('https://') && supabaseKey.length > 20

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null

// ── Designs CRUD ──────────────────────────────────────────────

export async function saveDesign(
  design: Omit<Design, 'id' | 'created_at'>
): Promise<Design | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('designs')
    .insert(design)
    .select()
    .single()
  if (error) { console.error('supabase insert error', error); return null }
  return data
}

export async function getDesigns(userId: string): Promise<Design[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) { console.error('supabase select error', error); return [] }
  return data || []
}

export async function getDesign(id: string): Promise<Design | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function deleteDesign(id: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('designs').delete().eq('id', id)
  return !error
}
