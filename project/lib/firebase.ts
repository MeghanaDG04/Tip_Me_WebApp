// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZAI0W1ak8S_orQ4EbSIZ_ma7nA50TJCo",
  authDomain: "tip-me-ab401.firebaseapp.com",
  projectId: "tip-me-ab401",
  storageBucket: "tip-me-ab401.firebasestorage.app",
  messagingSenderId: "385859085222",
  appId: "1:385859085222:web:6f68742e4f2157cba12567",
  measurementId: "G-J3E0NEQXP6"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
