import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const q = query(collection(db, 'tip_buttons'), where('slug', '==', params.slug), where('is_active', '==', true))
    const snap = await getDocs(q)
    if (snap.empty) {
      return NextResponse.json({ error: 'Tip button not found' }, { status: 404 })
    }
    const doc = snap.docs[0]
    const data = doc.data()
    return NextResponse.json({ id: doc.id, ...data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
