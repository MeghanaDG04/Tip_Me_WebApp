import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    console.log('Fetching tip button for slug:', slug)

    // Find tip button by slug
    const snapshot = await adminDb.collection('tip_buttons')
      .where('slug', '==', slug)
      .where('is_active', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Tip button not found' }, { status: 404 })
    }

    const tipButton = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    }

    console.log('Found tip button:', tipButton)
    return NextResponse.json(tipButton)
  } catch (error) {
    console.error('Error fetching tip button:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
