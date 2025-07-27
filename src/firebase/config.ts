import { initializeApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAvy-5ypgeuAPomgI_PqMfuUIC3Ywt0OUM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "game-9bef3.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "game-9bef3",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "game-9bef3.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "753671705405",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:753671705405:web:45f42b2843bae488a2ab54",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-6TY6YEZHV6",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// Only initialize analytics in browser environment
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

// Connect to emulators in development (only in browser)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099")
    connectFirestoreEmulator(db, "localhost", 8080)
    connectStorageEmulator(storage, "localhost", 9199)
    connectFunctionsEmulator(functions, "localhost", 5001)
  } catch (error) {
    console.log("Emulators already connected or not available")
  }
}

export default app
