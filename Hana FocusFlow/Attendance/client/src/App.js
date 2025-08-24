import React, { useEffect, useState } from "react";
import { auth, } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import AttendancePage from "./AttendancePage";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  if (user) {
    return (
      <div>
        <button onClick={() => signOut(auth)} style={{ marginBottom: 20 }}>
          Log Out
        </button>
        <AttendancePage />
      </div>
    );
  }

  return showSignup ? (
    <SignupPage onSwitchToLogin={() => setShowSignup(false)} />
  ) : (
    <LoginPage onSwitchToSignup={() => setShowSignup(true)} />
  );
}

export default App;
