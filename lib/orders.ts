import { supabase, isSupabaseConfigured } from './supabase'

export type OrderStatus = 'pending' | 'confirmed' | 'in_production' | 'delivered' | 'cancelled'
export type PaymentProvider = 'flow' | 'mp' | 'stripe'

export interface OrderItem {
  slug: string
  name: string
  quantity: number
  priceNum: number
  note: string
}

export interface Order {
  id: string
  created_at: string
  updated_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  items: OrderItem[]
  subtotal_clp: number
  iva_clp: number
  total_clp: number
  status: OrderStatus
  payment_provider: PaymentProvider | null
  payment_ref: string | null
  notes: string | null
}

export type NewOrder = Omit<Order, 'created_at' | 'updated_at' | 'payment_provider' | 'payment_ref' | 'notes'> & {
  status?: OrderStatus
}

export async function createOrder(order: NewOrder): Promise<Order | null> {
  if (!supabase || !isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('orders')
    .insert({ ...order, status: order.status ?? 'pending' })
    .select()
    .single()
  if (error) { console.error('[orders] insert error', error); return null }
  return data
}

export async function getOrders(): Promise<Order[]> {
  if (!supabase || !isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) { console.error('[orders] select error', error); return [] }
  return data ?? []
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!supabase || !isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  paymentProvider?: PaymentProvider,
  paymentRef?: string,
): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false
  const patch: Partial<Order> = { status }
  if (paymentProvider) patch.payment_provider = paymentProvider
  if (paymentRef) patch.payment_ref = paymentRef
  const { error } = await supabase.from('orders').update(patch).eq('id', id)
  if (error) { console.error('[orders] update error', error); return false }
  return true
}
