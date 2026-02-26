// Convex HTTP router.
// This file is the ONLY entry point for external HTTP requests into Convex.
// It handles the Stripe webhook directly inside Convex's runtime so that
// Stripe signature verification and order fulfillment happen in the same trusted
// context — no public-facing Convex action is required.
//
// Environment variables that must be set in the Convex dashboard
// (npx convex env set KEY value):
//   STRIPE_SECRET_KEY      — Stripe secret key
//   STRIPE_WEBHOOK_SECRET  — Stripe webhook signing secret

import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'
import Stripe from 'stripe'
import { Id } from './_generated/dataModel'

const http = httpRouter()

http.route({
  path: '/stripe-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripeSecretKey || !webhookSecret) {
      console.error(
        'Missing Stripe environment variables in Convex dashboard:',
        !stripeSecretKey ? 'STRIPE_SECRET_KEY' : 'STRIPE_WEBHOOK_SECRET',
      )
      return new Response('Server misconfiguration', { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-01-28.clover',
    })

    const signature = request.headers.get('stripe-signature')
    if (!signature) {
      return new Response('Missing stripe-signature header', { status: 400 })
    }

    // Read the raw body text — must be the unmodified bytes that Stripe signed.
    const body = await request.text()

    let event: Stripe.Event
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret,
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Invalid signature', { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const orderId = session.metadata?.orderId
      const deviceId = session.metadata?.deviceId

      if (!orderId || !deviceId) {
        // 5xx so Stripe retries — missing metadata is a bug on our side.
        console.error(
          'Missing orderId or deviceId in session metadata',
          session.id,
        )
        return new Response('Missing required metadata', { status: 500 })
      }

      const shippingDetails = session.collected_information?.shipping_details

      try {
        await ctx.runAction(internal.orders.processPaymentSuccess, {
          orderId: orderId as Id<'orders'>,
          deviceId,
          stripeSessionId: session.id,
          customerEmail: session.customer_details?.email ?? undefined,
          shippingAddress: shippingDetails?.address
            ? {
                name: shippingDetails.name ?? '',
                line1: shippingDetails.address.line1 ?? '',
                line2: shippingDetails.address.line2 ?? undefined,
                city: shippingDetails.address.city ?? '',
                state: shippingDetails.address.state ?? '',
                postalCode: shippingDetails.address.postal_code ?? '',
                country: shippingDetails.address.country ?? '',
              }
            : undefined,
          stripePaymentIntentId:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : undefined,
        })
      } catch (err) {
        console.error('Error fulfilling order:', err)
        return new Response('Error processing webhook', { status: 500 })
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
})

export default http
