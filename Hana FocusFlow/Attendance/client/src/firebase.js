// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCV2HveOr6a_Ot4sKn_gaI4Y76MHzGfoe0",
  authDomain: "attendance-91014.firebaseapp.com",
  projectId: "attendance-91014",
  messagingSenderId: "124846863273",
  appId: "1:124846863273:web:dd6070e5cd68aac68d4ab8",
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const messaging = getMessaging(app);

export default app;
