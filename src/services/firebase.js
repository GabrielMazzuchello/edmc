// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjCI7zw5h0G3T3RRbaCjViiYAk2bYcPmY",
  authDomain: "edmc-b8b8d.firebaseapp.com",
  databaseURL: "https://edmc-b8b8d-default-rtdb.firebaseio.com",
  projectId: "edmc-b8b8d",
  storageBucket: "edmc-b8b8d.firebasestorage.app",
  messagingSenderId: "232186621599",
  appId: "1:232186621599:web:1f7342e8a6f85623857caa",
  measurementId: "G-ZP6E3FSHXX",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
