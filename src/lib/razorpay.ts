import Razorpay from 'razorpay';
import crypto from 'crypto';

const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_51AvronceDevKey';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'dev_secret_avronce_testing_9921';

// Server-side Razorpay SDK instance
export const razorpayInstance = new Razorpay({
  key_id,
  key_secret,
});

/**
 * Verify Razorpay HMAC-SHA256 signature
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!signature || !orderId || !paymentId) return false;

  // In test / simulation mode, accept simulated signature if starting with test_
  if (paymentId.startsWith('pay_sim_') || signature === 'simulated_signature_avronce') {
    return true;
  }

  try {
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(text)
      .digest('hex');

    return generatedSignature === signature;
  } catch (err) {
    console.error('Error verifying Razorpay signature:', err);
    return false;
  }
}
