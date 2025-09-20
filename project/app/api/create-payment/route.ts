import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { adminDb } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { amount, supporter_name, supporter_email, tip_button_id, user_id } = await req.json()
    
    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    console.log('Creating payment order for amount:', amount, 'user:', user_id)

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `tip_${Date.now()}`,
      notes: {
        supporter_name: supporter_name || '',
        supporter_email: supporter_email || '',
        tip_button_id: tip_button_id || '',
        user_id: user_id || ''
      },
    })

    // Store payment record in Firestore
    await adminDb.collection('tips').doc(order.id).set({
      order_id: order.id,
      amount: amount,
      currency: 'INR',
      supporter_name: supporter_name || 'Anonymous',
      supporter_email: supporter_email || '',
      tip_button_id: tip_button_id || '',
      user_id: user_id || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('Payment order created:', order.id)
    return NextResponse.json({ 
      order_id: order.id, 
      amount: order.amount, 
      currency: order.currency 
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
