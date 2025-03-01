import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_XTCloGmvkSpmffsW0YhjU6qOBbtAMaA",
  authDomain: "schatapp-c7480.firebaseapp.com",
  projectId: "schatapp-c7480",
  storageBucket: "schatapp-c7480.firebasestorage.app",
  messagingSenderId: "627541169435",
  appId: "1:627541169435:web:5f6fca323cd1db3dceefbe",
  measurementId: "G-XN1STWN2ZB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);