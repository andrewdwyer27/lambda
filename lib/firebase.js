// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAImtXy0MKb2-TcFMDzNNpAxo9pciONWOM",
  authDomain: "lambda-ab294.firebaseapp.com",
  projectId: "lambda-ab294",
  storageBucket: "lambda-ab294.firebasestorage.app",
  messagingSenderId: "269073574410",
  appId: "1:269073574410:web:b6e620c662c8d2c8d88df3",
  measurementId: "G-M8JXV4YQRR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };