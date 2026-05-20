import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/orders'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/webhook/flow
//
// Flow llama a esta URL cuando el estado de un pago cambia.
// Configura esta URL en Flow como "urlConfirmation" al crear el pago.
//
// Para activar: descomentar la verificación de firma y el fetch a /payment/getStatus
// Docs: https://www.flow.cl/docs/api.html#tag/payment/operation/confirm
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData()
    const token = body.get('token') as string | null

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
    }

    // ── Verificar estado del pago con Flow ────────────────────────────────────
    // const crypto = await import('crypto')
    // const apiKey = process.env.FLOW_API_KEY!
    // const secret = process.env.FLOW_SECRET_KEY!
    //
    // const params: Record<string, string> = { apiKey, token }
    // const keys = Object.keys(params).sort()
    // const toSign = keys.map(k => `${k}${params[k]}`).join('')
    // const signature = crypto.createHmac('sha256', secret).update(toSign).digest('hex')
    // params.s = signature
    //
    // const statusRes = await fetch(
    //   `https://sandbox.flow.cl/api/payment/getStatus?${new URLSearchParams(params)}`
    // )
    // if (!statusRes.ok) throw new Error('Flow getStatus failed')
    //
    // const payment = await statusRes.json()
    // const orderId: string = payment.commerceOrder
    // const flowStatus: number = payment.status  // 1=pending, 2=paid, 3=rejected, 4=cancelled
    //
    // const statusMap: Record<number, Parameters<typeof updateOrderStatus>[1]> = {
    //   2: 'confirmed',
    //   3: 'cancelled',
    //   4: 'cancelled',
    // }
    // const newStatus = statusMap[flowStatus]
    // if (newStatus) {
    //   await updateOrderStatus(orderId, newStatus, 'flow', token)
    // }
    // ─────────────────────────────────────────────────────────────────────────

    // Stub: log and acknowledge. updateOrderStatus is called inside the block above.
    console.log('[webhook/flow] token received (stub):', token)

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('[webhook/flow] error', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
