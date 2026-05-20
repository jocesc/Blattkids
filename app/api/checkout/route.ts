import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/orders'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/checkout
//
// Para activar un proveedor de pago:
//   1. Agrega las claves en .env.local (ver .env.example)
//   2. Descomenta el bloque correspondiente abajo
//   3. Comenta o elimina el bloque "STUB" al final
//
// Webhooks listos en:
//   • /api/webhook/flow
//   • /api/webhook/mp
//   • /api/webhook/stripe
// ─────────────────────────────────────────────────────────────────────────────

interface OrderItem {
  slug: string
  name: string
  quantity: number
  priceNum: number
  note: string
}

interface Customer {
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  region: string
  depto: string
}

interface CheckoutBody {
  customer: Customer
  items: OrderItem[]
  subtotal: number
  iva: number
  total: number
}

function generateOrderId(): string {
  return `BK-${Date.now().toString(36).toUpperCase()}`
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json()
    const { customer, items, subtotal, iva, total } = body

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer?.email ?? '')
    if (!emailOk || !items?.length || !total) {
      return NextResponse.json({ error: 'Datos incompletos o email inválido' }, { status: 400 })
    }

    const orderId = generateOrderId()
    const shippingAddress = [
      customer.direccion,
      customer.depto ? customer.depto : null,
      customer.ciudad,
      customer.region,
    ].filter(Boolean).join(', ')

    // Persist order to Supabase (status: pending until payment confirmed)
    await createOrder({
      id: orderId,
      customer_name: `${customer.nombre} ${customer.apellido}`,
      customer_email: customer.email,
      customer_phone: customer.telefono,
      shipping_address: shippingAddress,
      items,
      subtotal_clp: subtotal,
      iva_clp: iva,
      total_clp: total,
      status: 'pending',
    })

    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

    // ── Flow.cl ────────────────────────────────────────────────────────────────
    // Docs: https://www.flow.cl/docs/api.html
    // Env:  FLOW_API_KEY, FLOW_SECRET_KEY
    //
    // if (process.env.FLOW_API_KEY) {
    //   const crypto = await import('crypto')
    //   const params: Record<string, string> = {
    //     apiKey:          process.env.FLOW_API_KEY,
    //     commerceOrder:   orderId,
    //     subject:         'Pedido Blattkids',
    //     amount:          String(total),
    //     email:           customer.email,
    //     urlReturn:       `${baseUrl}/checkout/exito?orden=${orderId}`,
    //     urlConfirmation: `${baseUrl}/api/webhook/flow`,
    //   }
    //   // Sign: sort keys alphabetically, concatenate key+value, HMAC-SHA256
    //   const keys = Object.keys(params).sort()
    //   const toSign = keys.map(k => `${k}${params[k]}`).join('')
    //   params.s = crypto.createHmac('sha256', process.env.FLOW_SECRET_KEY!).update(toSign).digest('hex')
    //   const body = new URLSearchParams(params)
    //   const flowRes = await fetch('https://sandbox.flow.cl/api/payment/create', { method: 'POST', body })
    //   if (!flowRes.ok) throw new Error('Flow API error')
    //   const { url, token } = await flowRes.json()
    //   return NextResponse.json({ orderId, redirectUrl: `${url}?token=${token}` })
    // }
    // ──────────────────────────────────────────────────────────────────────────

    // ── Mercado Pago ──────────────────────────────────────────────────────────
    // Docs: https://www.mercadopago.cl/developers/es/docs/checkout-pro
    // Env:  MP_ACCESS_TOKEN
    //
    // if (process.env.MP_ACCESS_TOKEN) {
    //   const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
    //     method: 'POST',
    //     headers: {
    //       Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       items: items.map(i => ({
    //         id: i.slug,
    //         title: i.name,
    //         quantity: i.quantity,
    //         unit_price: i.priceNum,
    //         currency_id: 'CLP',
    //       })),
    //       payer: { email: customer.email },
    //       back_urls: {
    //         success: `${baseUrl}/checkout/exito?orden=${orderId}`,
    //         failure: `${baseUrl}/checkout?error=mp`,
    //         pending: `${baseUrl}/checkout/exito?orden=${orderId}&estado=pendiente`,
    //       },
    //       auto_return: 'approved',
    //       external_reference: orderId,
    //       notification_url: `${baseUrl}/api/webhook/mp`,
    //     }),
    //   })
    //   if (!mpRes.ok) throw new Error('Mercado Pago API error')
    //   const { init_point } = await mpRes.json()
    //   return NextResponse.json({ orderId, redirectUrl: init_point })
    // }
    // ──────────────────────────────────────────────────────────────────────────

    // ── Stripe ────────────────────────────────────────────────────────────────
    // Docs: https://stripe.com/docs/checkout/quickstart
    // Env:  STRIPE_SECRET_KEY
    // Dep:  npm install stripe
    //
    // if (process.env.STRIPE_SECRET_KEY) {
    //   const Stripe = (await import('stripe')).default
    //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    //   const session = await stripe.checkout.sessions.create({
    //     mode: 'payment',
    //     customer_email: customer.email,
    //     line_items: items.map(i => ({
    //       price_data: {
    //         currency: 'clp',
    //         unit_amount: i.priceNum,   // CLP has no decimals
    //         product_data: { name: i.name },
    //       },
    //       quantity: i.quantity,
    //     })),
    //     success_url: `${baseUrl}/checkout/exito?orden=${orderId}`,
    //     cancel_url: `${baseUrl}/checkout`,
    //     metadata: { orderId },
    //   })
    //   return NextResponse.json({ orderId, redirectUrl: session.url })
    // }
    // ──────────────────────────────────────────────────────────────────────────

    // STUB — no payment provider configured
    // Order is persisted in Supabase as 'pending'. Team coordinates payment manually.
    void baseUrl
    console.log('[checkout] Order saved (stub):', orderId, customer.email, `$${total}`)
    return NextResponse.json({ orderId })

  } catch (err) {
    console.error('[checkout] error', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
