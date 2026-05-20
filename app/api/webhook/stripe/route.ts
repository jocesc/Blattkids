import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/orders'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/webhook/stripe
//
// Stripe llama a esta URL cuando un checkout.session se completa o falla.
// Configura en: Stripe Dashboard → Developers → Webhooks → Add endpoint
// URL: https://tu-dominio.com/api/webhook/stripe
// Eventos: checkout.session.completed, checkout.session.expired
//
// Env: STRIPE_WEBHOOK_SECRET (generado al crear el endpoint en Stripe)
// Dep: npm install stripe
//
// Docs: https://stripe.com/docs/webhooks
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // ── Verificar firma y procesar evento ─────────────────────────────────────
    // const Stripe = (await import('stripe')).default
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    //
    // let event: import('stripe').Stripe.Event
    // try {
    //   event = stripe.webhooks.constructEvent(
    //     rawBody,
    //     signature,
    //     process.env.STRIPE_WEBHOOK_SECRET!,
    //   )
    // } catch {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    // }
    //
    // if (event.type === 'checkout.session.completed') {
    //   const session = event.data.object as import('stripe').Stripe.Checkout.Session
    //   const orderId = session.metadata?.orderId
    //   if (orderId) {
    //     await updateOrderStatus(orderId, 'confirmed', 'stripe', session.payment_intent as string)
    //   }
    // }
    //
    // if (event.type === 'checkout.session.expired') {
    //   const session = event.data.object as import('stripe').Stripe.Checkout.Session
    //   const orderId = session.metadata?.orderId
    //   if (orderId) {
    //     await updateOrderStatus(orderId, 'cancelled', 'stripe', session.id)
    //   }
    // }
    // ─────────────────────────────────────────────────────────────────────────

    // Stub: log and acknowledge. updateOrderStatus is called inside the block above.
    console.log('[webhook/stripe] event received (stub), sig:', signature.slice(0, 20))
    void rawBody  // will be consumed by stripe.webhooks.constructEvent when activated

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('[webhook/stripe] error', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
