import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      return NextResponse.json({ error: 'Missing secret or signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle the event
    // For simple integration, we usually handle payment.captured or order.paid
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const userId = event.payload.order?.entity?.notes?.userId || payment.notes?.userId;

      if (userId) {
        const supabase = await createAdminClient();
        await supabase
          .from('users')
          .update({ subscription_status: 'active' })
          .eq('id', userId);

        console.log(`[Webhook] Subscription activated for user: ${userId}`);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('[RAZORPAY_WEBHOOK_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
