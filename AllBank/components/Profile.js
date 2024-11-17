import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth } from "../firebaseConfig";

export default function Profile({ navigation }) {
	const handleSignOut = async () => {
		try {
			await auth.signOut();
			Alert.alert("Success", "You have been signed out.");
		} catch (error) {
			console.error("Error signing out:", error);
			Alert.alert("Error", "Failed to sign out. Please try again.");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Profile</Text>
			{/* Add your profile details here */}
			<TouchableOpacity
				style={styles.signOutButton}
				onPress={handleSignOut}
			>
				<Text style={styles.buttonText}>Sign Out</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
		padding: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 20,
		textAlign: "center",
	},
	signOutButton: {
		backgroundColor: "#FF4C4C",
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});
