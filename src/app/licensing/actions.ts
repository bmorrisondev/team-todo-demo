'use server'
import { clerkClient } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { getStripeCustomerIdFromOrgId } from '../actions';
import { neon } from '@neondatabase/serverless';

const stripe = new Stripe(process.env.STRIPE_KEY as string);
const sql = neon(process.env.DATABASE_URL as string);

export async function toggleUserLicense(orgId: string, userId: string, status: boolean) {
  await clerkClient.organizations.updateOrganizationMembershipMetadata({
    organizationId: orgId,
    userId: userId,
    publicMetadata: {
      isLicensed: status
    }
  })
}

export async function getCheckoutUrl(clerkOrgId: string, quantity: number) {
  const [row] = await sql`select stripe_customer_id from orgs where org_id=${clerkOrgId}`
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: row.stripe_customer_id,
    line_items: [
      {
        price: 'price_1PajlBGVJ29rMAV1JmqqgEwa',
        quantity: quantity,
        adjustable_quantity: {
          enabled: true,
          minimum: 1
        }
      }
    ],
    success_url: "http://localhost:3005/licensing",
    cancel_url: "http://localhost:3005/licensing",
  })
  return session.url
}

export async function getPortalUrl(clerkOrgId: string) {
  const [row] = await sql`select stripe_customer_id from orgs where org_id=${clerkOrgId}`
  const session = await stripe.billingPortal.sessions.create({
    customer: row.stripe_customer_id,
    return_url: 'http://localhost:3005/licensing',
  });
  return session.url
}