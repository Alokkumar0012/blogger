// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 ADD this line

const firebaseConfig = {
  apiKey: "AIzaSyBDanczGpeAZdzr5liCThgjSCpOrVnpAfk",
  authDomain: "chat-e9374.firebaseapp.com",
  projectId: "chat-e9374",
  storageBucket: "chat-e9374.firebasestorage.app",
  messagingSenderId: "562614811559",
  appId: "1:562614811559:web:ddc712fbf0e85194611482",
  measurementId: "G-N02HYN7D6J"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // 👈 EXPORT Firestore
