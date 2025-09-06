import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { account_id } = await req.json()

    await connectDB()

    // Update user with Razorpay account ID
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        razorpay_account_id: account_id,
        onboarding_completed: true,
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error connecting Razorpay:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}