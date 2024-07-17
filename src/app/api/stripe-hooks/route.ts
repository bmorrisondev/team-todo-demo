import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string

export async function updateLicenseCount(stripeCustomerId: string, quantity: number) {
  const sql = neon(process.env.DATABASE_URL as string)
  await sql`update orgs set license_count=${quantity} where stripe_customer_id=${stripeCustomerId}`
}

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');

  if(!sig) {
    throw new Error("Missing signature")
  }

  try {
    const body = await request.text()
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        await updateLicenseCount(
          event.data.object.customer as string,
          // @ts-ignore
          event.data.object.quantity
        )
        break;
      case 'customer.subscription.updated':
        await updateLicenseCount(
          event.data.object.customer as string,
          // @ts-ignore
          event.data.object.quantity
        )
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return new NextResponse(null, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({
      "error": err?.toString()
    }, { status: 400 })
  }
}