// services/authService.ts
'use client';
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

async function saveUser(uid: string, email: string, name: string) {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { email, name, createdAt: new Date() });
    }
  } catch (error) {
    console.error("Error saving user:", error);
    // Continue without saving user data if offline
  }
}

export async function signUp(email: string, password: string, name: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  // Save user data in background, don't block auth flow
  saveUser(cred.user.uid, email, name).catch(console.error);
  return cred.user;
}

export async function logIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function googleLogin() {
  const provider = new GoogleAuthProvider();
  try {
    // Try popup first
    const cred = await signInWithPopup(auth, provider);
    // Save user data in background, don't block auth flow
    saveUser(cred.user.uid, cred.user.email || "", cred.user.displayName || "").catch(console.error);
    return cred.user;
  } catch (error: any) {
    // If popup is blocked, try redirect instead
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, provider);
      // Note: signInWithRedirect doesn't return immediately, page will redirect
      return null;
    }
    throw error;
  }
}

export async function logOut() {
  await signOut(auth);
}

// Handle redirect result from Google sign-in
export async function handleGoogleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      // Save user data in background
      saveUser(result.user.uid, result.user.email || "", result.user.displayName || "").catch(console.error);
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error handling Google redirect:", error);
    throw error;
  }
}
