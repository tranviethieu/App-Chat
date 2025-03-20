// lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC2Dr9p-XV6ITKFJDZEaNUL__f4I0Q-Z8A",
  authDomain: "chat-my-app-6251e.firebaseapp.com",
  projectId: "chat-my-app-6251e",
  storageBucket: "chat-my-app-6251e.firebasestorage.app",
  messagingSenderId: "331395745861",
  appId: "1:331395745861:web:df3fa7595344d9d52c7b2c",
  measurementId: "G-XVTP6VHRK2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export {
  db,
  auth,
  googleProvider,
  collection,
  addDoc,
  facebookProvider,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  getDoc,
  setDoc,
};
