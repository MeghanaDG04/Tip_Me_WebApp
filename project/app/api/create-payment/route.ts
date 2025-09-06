import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  try {
    const { amount, supporter_name, supporter_email } = await req.json()
    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `tip_${Date.now()}`,
      notes: {
        supporter_name: supporter_name || '',
        supporter_email: supporter_email || '',
      },
    })
    return NextResponse.json({ order_id: order.id, amount: order.amount, currency: order.currency })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
