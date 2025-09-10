import { NextRequest, NextResponse } from 'next/server'
import { getFirebaseUser } from '@/lib/auth'
import { adminDb } from '@/lib/firebaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const firebaseUser = await getFirebaseUser(req)
    if (!firebaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const snapshot = await adminDb.collection('tip_buttons')
      .where('user_uid', '==', firebaseUser.uid)
      .get()

    const tipButtons = snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(tipButtons)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const firebaseUser = await getFirebaseUser(req)
    if (!firebaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug, title, description, suggested_amount, thank_you_message } = await req.json()

    // Check slug uniqueness
    const existingSnapshot = await adminDb.collection('tip_buttons')
      .where('slug', '==', slug)
      .get()
    
    if (!existingSnapshot.empty) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const docRef = await adminDb.collection('tip_buttons').add({
      user_uid: firebaseUser.uid,
      slug,
      title,
      description,
      suggested_amount,
      thank_you_message,
      currency: 'INR',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id: docRef.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
