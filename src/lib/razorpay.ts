import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

export const getRazorpay = () => {
  if (razorpayInstance) return razorpayInstance;

  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  // For build-time or mock-mode where keys might be missing
  if (!key_id || !key_secret) {
    return new Razorpay({
      key_id: 'mock_key',
      key_secret: 'mock_secret',
    });
  }

  razorpayInstance = new Razorpay({
    key_id,
    key_secret,
  });

  return razorpayInstance;
};
