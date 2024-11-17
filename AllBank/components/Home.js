import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Firebase configuration
import Insights from "./Insights";

const Home = ({ navigation }) => {
	const handleSignOut = async () => {
		try {
			await signOut(auth);
			console.log("User signed out.");
			// navigation.replace("Onboarding"); // Redirect to Onboarding after logout
		} catch (error) {
			console.error("Sign-Out Error:", error.message);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
			<Button title="Sign Out" onPress={handleSignOut} />
			<Insights/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	welcomeText: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
});

export default Home;
