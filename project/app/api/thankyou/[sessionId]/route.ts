import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Tip from '@/lib/models/Tip'

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    await connectDB()

    const tip = await Tip.findOne({
      razorpay_order_id: params.sessionId,
      status: 'completed'
    })
    .populate({
      path: 'tip_button_id',
      select: 'title thank_you_message slug',
      populate: {
        path: 'user_id',
        select: 'name email'
      }
    })

    if (!tip) {
      return NextResponse.json({ error: 'Thank you page not found' }, { status: 404 })
    }

    return NextResponse.json({
      tip: {
        amount: tip.amount,
        currency: tip.currency,
        supporter_name: tip.supporter_name,
        supporter_email: tip.supporter_email
      },
      tipButton: {
        title: tip.tip_button_id.title,
        thank_you_message: tip.tip_button_id.thank_you_message,
        slug: tip.tip_button_id.slug,
        users: {
          name: tip.tip_button_id.user_id.name,
          email: tip.tip_button_id.user_id.email
        }
      }
    })
  } catch (error) {
    console.error('Error fetching thank you data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}