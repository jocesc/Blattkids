import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/orders'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/webhook/mp
//
// Mercado Pago llama a esta URL (notification_url) cuando cambia el estado
// de un pago. Configura también en el panel de MP → Tus integraciones → Webhooks.
//
// Docs: https://www.mercadopago.cl/developers/es/docs/notifications/webhooks
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { type, data } = body as { type?: string; data?: { id?: string } }

    if (type !== 'payment' || !data?.id) {
      // MP also sends test pings — acknowledge silently
      return new NextResponse('OK', { status: 200 })
    }

    // ── Verificar pago con Mercado Pago API ───────────────────────────────────
    // const paymentId = data.id
    // const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    //   headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    // })
    // if (!mpRes.ok) throw new Error('MP payment fetch failed')
    //
    // const payment = await mpRes.json()
    // const orderId: string = payment.external_reference
    // const mpStatus: string = payment.status  // 'approved' | 'rejected' | 'cancelled' | 'pending'
    //
    // const statusMap: Record<string, Parameters<typeof updateOrderStatus>[1]> = {
    //   approved:  'confirmed',
    //   rejected:  'cancelled',
    //   cancelled: 'cancelled',
    // }
    // const newStatus = statusMap[mpStatus]
    // if (newStatus) {
    //   await updateOrderStatus(orderId, newStatus, 'mp', String(paymentId))
    // }
    // ─────────────────────────────────────────────────────────────────────────

    // Stub: log and acknowledge. updateOrderStatus is called inside the block above.
    console.log('[webhook/mp] payment notification (stub):', data.id)

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('[webhook/mp] error', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
