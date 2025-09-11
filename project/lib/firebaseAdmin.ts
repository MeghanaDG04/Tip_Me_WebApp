import * as admin from 'firebase-admin';

// Check if we have the required environment variables
const hasCredentials = process.env.FIREBASE_PROJECT_ID && 
                      process.env.FIREBASE_CLIENT_EMAIL && 
                      process.env.FIREBASE_PRIVATE_KEY;

let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;

if (hasCredentials) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    };

    console.log('Initializing Firebase Admin with project:', serviceAccount.projectId);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.projectId,
      });
    }

    adminAuth = admin.auth();
    adminDb = admin.firestore();
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
  }
} else {
  console.warn('Firebase Admin credentials not found. Missing vars:', {
    projectId: !!process.env.FIREBASE_PROJECT_ID,
    clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL, 
    privateKey: !!process.env.FIREBASE_PRIVATE_KEY
  });
}

export { adminAuth, adminDb };
