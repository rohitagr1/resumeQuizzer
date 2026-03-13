"use client";

import { useCallback, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, ensureAuthPersistence, googleProvider } from "../lib/firebase";
import { getFirebaseAuthErrorMessage } from "../lib/authError";

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authLoading, setAuthLoading] = useState(true);
  const [authActionLoading, setAuthActionLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    ensureAuthPersistence()
      .catch(() => {
        // Ignore persistence failures and still continue with auth listener.
      })
      .finally(() => {
        unsubscribe = onAuthStateChanged(auth, (nextUser) => {
          setUser(nextUser);
          setAuthLoading(false);
        });
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setAuthActionLoading(true);
    try {
      await ensureAuthPersistence();
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      throw new Error(getFirebaseAuthErrorMessage(error));
    } finally {
      setAuthActionLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthActionLoading(true);
    try {
      await signOut(auth);
    } finally {
      setAuthActionLoading(false);
    }
  }, []);

  return {
    user,
    authLoading,
    authActionLoading,
    isLoggedIn: Boolean(user),
    loginWithGoogle,
    logout,
  };
}
