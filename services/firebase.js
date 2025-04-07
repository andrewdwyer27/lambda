// services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration - replace with your actual Firebase project details
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
const db = getFirestore(app);

// Save donation data to Firestore
export const saveDonation = async (donationData) => {
    try {
        const donationsRef = collection(db, 'donations');

        // Add timestamp
        const dataWithTimestamp = {
            ...donationData,
            timestamp: serverTimestamp()
        };

        const docRef = await addDoc(donationsRef, dataWithTimestamp);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error saving donation:", error);
        return { success: false, error: error.message };
    }
};

export default { saveDonation };