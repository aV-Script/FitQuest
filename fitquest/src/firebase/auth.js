import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, sendPasswordResetEmail,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import app from './config'

const auth = getAuth(app)

// App secondaria per creare account cliente senza fare logout del trainer
const SECONDARY_CONFIG = {
  apiKey:            "AIzaSyABkp7d91Wb2JG0SsJzDIhrceH_cma0Qc0",
  authDomain:        "fitquest-60a09.firebaseapp.com",
  projectId:         "fitquest-60a09",
  storageBucket:     "fitquest-60a09.firebasestorage.app",
  messagingSenderId: "684894217887",
  appId:             "1:684894217887:web:685adbbd3b67254de3e4aa",
}
const secondaryApp  = initializeApp(SECONDARY_CONFIG, 'secondary')
const secondaryAuth = getAuth(secondaryApp)

export const login         = (email, pw) => signInWithEmailAndPassword(auth, email, pw)
export const register      = (email, pw) => createUserWithEmailAndPassword(auth, email, pw)
export const logout        = ()          => signOut(auth)
export const resetPassword = (email)     => sendPasswordResetEmail(auth, email)
export const onAuthChange  = (cb)        => onAuthStateChanged(auth, cb)
export const getCurrentUser = ()         => auth.currentUser

export async function createClientAccount(email, password) {
  const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password)
  await signOut(secondaryAuth)
  return cred.user.uid
}
