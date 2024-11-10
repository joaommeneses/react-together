// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDKU_frgiY3OE6PCquYqrXidcA4m3DHUlU",
    authDomain: "hacktogether-180f3.firebaseapp.com",
    projectId: "hacktogether-180f3",
    storageBucket: "hacktogether-180f3.firebasestorage.app",
    messagingSenderId: "979134427543",
    appId: "1:979134427543:web:b466029794b0f2a32a94d2",
    measurementId: "G-CVMFQCZJYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default firebaseConfig;
