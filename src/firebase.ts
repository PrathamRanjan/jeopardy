import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBA_xQcwIOFPN88l6ex4bValCUDZII2rY",
  authDomain: "jeopardy-ddf3f.firebaseapp.com",
  projectId: "jeopardy-ddf3f",
  storageBucket: "jeopardy-ddf3f.firebasestorage.app",
  messagingSenderId: "410278231823",
  appId: "1:410278231823:web:3037e2f6160d1a7e99087a",
  measurementId: "G-V8750CHQE9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
