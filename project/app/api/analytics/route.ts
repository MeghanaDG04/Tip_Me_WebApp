import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Tip from '@/lib/models/Tip'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Get user
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get analytics data
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Total tips
    const allTips = await Tip.find({
      user_id: user._id,
      status: 'completed'
    }).select('amount creator_amount')

    // Last 30 days tips
    const recentTips = await Tip.find({
      user_id: user._id,
      status: 'completed',
      createdAt: { $gte: thirtyDaysAgo }
    }).select('amount creator_amount createdAt')

    // Recent supporters
    const supporters = await Tip.find({
      user_id: user._id,
      status: 'completed'
    })
    .select('supporter_name supporter_email amount createdAt')
    .sort({ createdAt: -1 })
    .limit(10)

    const totalAmount = allTips.reduce((sum, tip) => sum + tip.amount, 0)
    const totalEarnings = allTips.reduce((sum, tip) => sum + tip.creator_amount, 0)
    const recentAmount = recentTips.reduce((sum, tip) => sum + tip.amount, 0)
    const recentEarnings = recentTips.reduce((sum, tip) => sum + tip.creator_amount, 0)

    return NextResponse.json({
      total: {
        tips: allTips.length,
        amount: totalAmount,
        earnings: totalEarnings,
      },
      last30Days: {
        tips: recentTips.length,
        amount: recentAmount,
        earnings: recentEarnings,
      },
      recentSupporters: supporters,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}