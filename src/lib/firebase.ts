// Firebase Configuration for Britium Express
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBp779YoKiu9m-IVJLcWpcFqA7C7adaLB0",
  authDomain: "britium-express-delivery.firebaseapp.com",
  projectId: "britium-express-delivery",
  storageBucket: "britium-express-delivery.firebasestorage.app",
  messagingSenderId: "276152524509",
  appId: "1:276152524509:web:ba5ba1d58a219484f7c534",
  measurementId: "G-CVNBZW0GWL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;