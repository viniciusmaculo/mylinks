import { initializeApp } from 'firebase/app';
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCMsOoFojPIwdL0p6kv6YCdLBSbpeANNxU",
  authDomain: "my-links-774f9.firebaseapp.com",
  projectId: "my-links-774f9",
  storageBucket: "my-links-774f9.appspot.com",
  messagingSenderId: "798408956400",
  appId: "1:798408956400:web:d1c2cf37cf78da4b60e535",
  measurementId: "G-RLQZCNT2E7"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const auth = getAuth(app)
const db = getFirestore(app)

export {auth, db}