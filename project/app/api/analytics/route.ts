import { NextRequest, NextResponse } from 'next/server'
import { getFirebaseUser } from '@/lib/auth'
import { adminDb } from '@/lib/firebaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const firebaseUser = await getFirebaseUser(req)
    if (!firebaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from Firestore
    const userDoc = await adminDb.collection('users').doc(firebaseUser.uid).get()
    const user = userDoc.data()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get analytics data from Firestore
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get tips collection
    const tipsSnapshot = await adminDb.collection('tips')
      .where('user_id', '==', firebaseUser.uid)
      .where('status', '==', 'completed')
      .get()

    const allTips = tipsSnapshot.docs.map(doc => doc.data())

    // Filter recent tips
    const recentTips = allTips.filter(tip => 
      new Date(tip.createdAt.toDate ? tip.createdAt.toDate() : tip.createdAt) >= thirtyDaysAgo
    )

    // Get recent supporters (last 10)
    const supportersSnapshot = await adminDb.collection('tips')
      .where('user_id', '==', firebaseUser.uid)
      .where('status', '==', 'completed')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get()

    const supporters = supportersSnapshot.docs.map(doc => doc.data())

    const totalAmount = allTips.reduce((sum, tip) => sum + (tip.amount || 0), 0)
    const totalEarnings = allTips.reduce((sum, tip) => sum + (tip.creator_amount || 0), 0)
    const recentAmount = recentTips.reduce((sum, tip) => sum + (tip.amount || 0), 0)
    const recentEarnings = recentTips.reduce((sum, tip) => sum + (tip.creator_amount || 0), 0)

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