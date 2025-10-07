import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider, signInWithPopup, serverTimestamp } from '../firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * AuthContext provides user, loading, and helper functions.
 * On sign-up we create a `users/{uid}` document storing role and profile.
 */

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // user doc from firestore
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const snap = await getDoc(docRef);
        setProfile(snap.exists() ? snap.data() : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const register = async (email, password, displayName, role) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName });
    // create user profile doc
    const docRef = doc(db, 'users', res.user.uid);
    await setDoc(docRef, {
      displayName,
      role,
      createdAt: serverTimestamp()
    });
    return res.user;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    // ensure user doc exists
    const docRef = doc(db, 'users', res.user.uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, {
        displayName: res.user.displayName || '',
        role: 'student', // default to student for Google sign-ins - adjust as needed
        createdAt: serverTimestamp()
      });
    }
    return res.user;
  };
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, profile, loading, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
