/**
 * Firebase initialization (modular SDK v9+)
 * Make sure to create a .env in project root with the REACT_APP_FIREBASE_* keys.
 */
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAu3OtxcIq_Q58ne6vZoDbJRD8o_t1uYAw",
  authDomain: "digital-classroom-5ca62.firebaseapp.com",
  projectId: "digital-classroom-5ca62",
  storageBucket: "digital-classroom-5ca62.firebasestorage.app",
  messagingSenderId: "466660725943",
  appId: "1:466660725943:web:910166325e2d780a616932",
  measurementId: "G-BC5EVMCG33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export utility functions
export { serverTimestamp, signInWithPopup };
