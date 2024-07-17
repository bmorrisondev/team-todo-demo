'use server'
import { clerkClient } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { getStripeCustomerIdFromOrgId } from '../actions';

const stripe = new Stripe(process.env.STRIPE_KEY as string);

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
  const stripeId = await getStripeCustomerIdFromOrgId(clerkOrgId)
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: stripeId,
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
  const stripeId = await getStripeCustomerIdFromOrgId(clerkOrgId)
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeId,
    return_url: 'http://localhost:3005/licensing',
  });
  return session.url
}