import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      planId,
      userId 
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
    }

    // Update subscription status in Supabase
    const supabase = await createAdminClient();
    
    // Set expiry based on plan
    const expiresAt = new Date();
    if (planId === 'Yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const { error } = await supabase
      .from('users')
      .update({ 
        subscription_status: 'active',
        // In a real app, you'd have a subscriptions table
        // For now we'll stick to the users table as per current schema
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[RAZORPAY_VERIFY_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
