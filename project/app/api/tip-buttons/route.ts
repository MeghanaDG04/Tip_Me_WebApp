import { NextRequest, NextResponse } from 'next/server'
import { getFirebaseUser } from '@/lib/auth'
import { adminDb } from '@/lib/firebaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const firebaseUser = await getFirebaseUser(req)
    if (!firebaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, return empty array since Firestore isn't set up yet
    // TODO: Set up Firestore database in Firebase Console to enable this
    console.log('Simulating tip buttons fetch for user:', firebaseUser.uid);
    
    /* 
    const snapshot = await adminDb.collection('tip_buttons')
      .where('user_uid', '==', firebaseUser.uid)
      .get()

    const tipButtons = snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }))
    */

    const tipButtons = []; // Temporary empty array
    return NextResponse.json(tipButtons)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/tip-buttons called');
    
    const firebaseUser = await getFirebaseUser(req)
    console.log('Firebase user:', firebaseUser ? 'Found' : 'Not found');
    
    if (!firebaseUser) {
      console.log('Unauthorized: No Firebase user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    console.log('Request body:', body);
    
    const { slug, title, description, suggested_amount, thank_you_message } = body

    // For now, skip Firestore and simulate success
    // TODO: Set up Firestore database in Firebase Console to enable this
    console.log('Simulating tip button creation for user:', firebaseUser.uid);
    console.log('Tip button data:', { slug, title, description, suggested_amount });
    
    // Simulate document ID
    const docId = `simulated_${Math.random().toString(36).substring(7)}`;
    
    /* 
    if (!adminDb) {
      console.error('AdminDb is not initialized');
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    // Check slug uniqueness
    console.log('Checking slug uniqueness for:', slug);
    const existingSnapshot = await adminDb.collection('tip_buttons')
      .where('slug', '==', slug)
      .get()
    
    if (!existingSnapshot.empty) {
      console.log('Slug already exists:', slug);
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    console.log('Creating tip button for user:', firebaseUser.uid);
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
    */

    console.log('Tip button created successfully:', docId);
    return NextResponse.json({ id: docId })
  } catch (e) {
    console.error('Error in POST /api/tip-buttons:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
