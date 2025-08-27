// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAXRCTnK21ncaHPgQkiSWvgZA5lcQPxgYg",
    authDomain: "expense-tracker-a8c62.firebaseapp.com",
    projectId: "expense-tracker-a8c62",
    storageBucket: "expense-tracker-a8c62.firebasestorage.app",
    messagingSenderId: "761470678481",
    appId: "1:761470678481:web:93cb0cdd5fc48065b71cf0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// DB
export const firestore = getFirestore(app);