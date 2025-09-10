import { NextRequest } from 'next/server';
import { adminAuth } from './firebaseAdmin';

export async function getFirebaseUser(request: NextRequest) {
  try {
    if (!adminAuth) {
      console.error('Firebase Admin not initialized. Check your environment variables.');
      return null;
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return null;
  }
}
