import { NextRequest, NextResponse } from 'next/server'
import { getFirebaseUser } from '@/lib/auth'
import { adminDb } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const firebaseUser = await getFirebaseUser(req)
    if (!firebaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { account_id } = await req.json()

    // For now, skip Firestore storage and just return success
    // TODO: Set up Firestore database in Firebase Console to enable this
    console.log('Simulating Razorpay connection for user:', firebaseUser.uid, 'with account:', account_id)
    
    /* 
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 500 })
    }

    // Update user with Razorpay account ID in Firestore
    await adminDb.collection('users').doc(firebaseUser.uid).set({
      razorpay_account_id: account_id,
      onboarding_completed: true,
      updatedAt: new Date(),
    }, { merge: true })
    */

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error connecting Razorpay:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}