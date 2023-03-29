import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "@/firebase/google";
import { User } from "firebase/auth";
import { UserInfo, AuthState } from "@/types";

/**
 * Firebase auth subscriber. return user and loading
 */
export function useFirebaseAuth() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const u: UserInfo = {
      displayName: authState.displayName,
      email: authState.email,
      phoneNumber: authState.phoneNumber,
      photoURL: authState.photoURL,
      providerId: authState.providerId,
      uid: authState.uid,
    };
    setUser(u);
    setLoading(false);
  };

  // listen for firebase state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
  };
}

export const authContext = createContext<AuthState>({
  user: null,
  loading: false,
});

/**
 * Retrieve user and loading from authContext
 */
export const useAuth = () => {
  return useContext(authContext);
};
