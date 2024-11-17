import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // If using Firestore

const firebaseConfig = {
	apiKey: "AIzaSyC4nBxGY6ZJ6SP3rIXimvIDH8k8M5oynwE",
	authDomain: "allbank-51e33.firebaseapp.com",
	projectId: "allbank-51e33",
	storageBucket: "allbank-51e33.firebasestorage.app",
	messagingSenderId: "603164592116",
	appId: "1:603164592116:web:ff08be9dbe7829f85e1ba1",
	measurementId: "G-C2J1KP2NLC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // If using Firestore
