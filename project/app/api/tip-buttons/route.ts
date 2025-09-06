import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const { user_uid, slug, title, description, suggested_amount, thank_you_message } = await req.json()

    if (!user_uid) {
      return NextResponse.json({ error: 'Missing user_uid' }, { status: 400 })
    }

    // Check slug uniqueness
    const q = query(collection(db, 'tip_buttons'), where('slug', '==', slug))
    const existing = await getDocs(q)
    if (!existing.empty) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const docRef = await addDoc(collection(db, 'tip_buttons'), {
      user_uid,
      slug,
      title,
      description,
      suggested_amount,
      thank_you_message,
      currency: 'INR',
      is_active: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return NextResponse.json({ id: docRef.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
