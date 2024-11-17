import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Function to store user data in Firestore
export const storeUserData = async (userId, userData) => {
	try {
		// Set the user document in the 'users' collection
		await setDoc(doc(db, "users", userId), userData);
		console.log("User data stored successfully!");
	} catch (error) {
		console.error("Error storing user data:", error);
		throw new Error("Failed to store user data.");
	}
};
