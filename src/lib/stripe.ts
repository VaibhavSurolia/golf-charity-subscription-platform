import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any,
  appInfo: {
    name: 'Golf Charity Subscription Platform',
    version: '0.1.0'
  }
});
