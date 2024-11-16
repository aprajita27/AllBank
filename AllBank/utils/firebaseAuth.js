import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import your Firebase setup

// Sign-Up User
export const signUpUser = async (email, password) => {
	try {
		// Create a new user in Firebase Authentication
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		console.log("Sign-Up Successful:", userCredential.user);
		return { message: "Sign-Up successful", user: userCredential.user };
	} catch (error) {
		console.error("Sign-Up Error:", error.message);
		throw new Error("Failed to sign up. " + error.message);
	}
};

// Login User
export const loginUser = async (email, password) => {
	try {
		// Sign in an existing user
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		console.log("Login Successful:", userCredential.user);
		return { message: "Login successful", user: userCredential.user };
	} catch (error) {
		console.error("Login Error:", error.message);
		throw new Error("Failed to log in. " + error.message);
	}
};
