import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBSH-hvCVkKhhMrdtfnoqSZ0TZzjmPMulo",
  authDomain: "verdia-4401d.firebaseapp.com",
  projectId: "verdia-4401d",
  storageBucket: "verdia-4401d.firebasestorage.app",
  messagingSenderId: "639552213584",
  appId: "1:639552213584:web:b1ede9db70fc1cceb63755",
  measurementId: "G-YV1L49M89L"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);