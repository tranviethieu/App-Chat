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
} from "firebase/firestore";

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

export { db, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy };
