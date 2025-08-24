import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => 
    auth.onAuthStateChanged(user => setCurrentUser(user))
  , []);

  const signup   = (email, pw) => auth.createUserWithEmailAndPassword(email, pw);
  const login    = (email, pw) => auth.signInWithEmailAndPassword(email, pw);
  const logout   = ()       => auth.signOut();
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider);
  };

  return (
    <AuthContext.Provider value={{
      currentUser, signup, login, logout, signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
}
