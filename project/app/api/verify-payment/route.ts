import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import connectDB from '@/lib/mongodb'
import Tip from '@/lib/models/Tip'
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

    await connectDB()

    // Update tip status
    const tip = await Tip.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        status: 'completed',
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!tip) {
      return NextResponse.json({ error: 'Tip not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, tip })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}