import { createWebhooksHandler } from "@brianmmdev/clerk-webhooks-handler"
import { neon } from "@neondatabase/serverless";
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_KEY as string);
const sql = neon(process.env.DATABASE_URL as string)

const handler = createWebhooksHandler({
  secret: process.env.CLERK_WEBHOOK_SECRET as string,
  onOrganizationCreated: async (org) => {

    // Create customer in Stripe
    const customer = await stripe.customers.create({
      name: org.name
    })

    // Create record in neon
    await sql`insert into orgs (org_id, stripe_customer_id) values (${org.id}, ${customer.id})`
  }
})

export const POST = handler.POST