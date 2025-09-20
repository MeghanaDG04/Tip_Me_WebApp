import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { adminDb } from '@/lib/firebaseAdmin'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    // Verify payment signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    console.log('Verifying payment for order:', razorpay_order_id)

    // Update tip status in Firestore
    const tipRef = adminDb.collection('tips').doc(razorpay_order_id)
    const tipDoc = await tipRef.get()

    if (!tipDoc.exists) {
      return NextResponse.json({ error: 'Tip not found' }, { status: 404 })
    }

    const tipData = tipDoc.data()
    const creatorAmount = Math.floor(tipData?.amount * 0.95) // 95% to creator, 5% platform fee

    await tipRef.update({
      razorpay_payment_id,
      razorpay_signature,
      status: 'completed',
      creator_amount: creatorAmount,
      platform_fee: tipData?.amount - creatorAmount,
      updatedAt: new Date(),
    })

    const updatedTip = await tipRef.get()
    console.log('Payment verified successfully for order:', razorpay_order_id)

    return NextResponse.json({ 
      success: true, 
      tip: { id: updatedTip.id, ...updatedTip.data() }
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}