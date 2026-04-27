import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from './config'

const provider = new GoogleAuthProvider()

function isTouchDevice(): boolean {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

export async function signInWithGoogle(): Promise<void> {
  if (isTouchDevice()) {
    await signInWithRedirect(auth, provider)
  } else {
    await signInWithPopup(auth, provider)
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}
