import React, { useState } from "react";
import {
	View,
	TextInput,
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function SignUp({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSignUp = async () => {
		if (!email || !password || !name || !phoneNumber) {
			Alert.alert("Error", "All fields are required.");
			return;
		}

		if (password.length < 6) {
			Alert.alert(
				"Error",
				"Password must be at least 6 characters long."
			);
			return;
		}

		setLoading(true);

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Save user data to Firestore
			await setDoc(doc(db, "users", user.uid), {
				name,
				email,
				phoneNumber,
				accounts: {
					savings: {
						currentBalance: 0,
					},
					goals: [],
					investments: {
						funds: [],
					},
					transactions: [],
				},
			});

			Alert.alert("Success", "Account created successfully.");
			navigation.navigate("Login");
		} catch (error) {
			Alert.alert("Sign-Up Failed", error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Sign Up</Text>
			<TextInput
				style={styles.input}
				placeholder="Full Name"
				value={name}
				onChangeText={setName}
			/>
			<TextInput
				style={styles.input}
				placeholder="Phone Number"
				value={phoneNumber}
				onChangeText={setPhoneNumber}
				keyboardType="phone-pad"
			/>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			<TouchableOpacity
				style={[styles.button, loading && styles.disabledButton]}
				onPress={handleSignUp}
				disabled={loading}
			>
				<Text style={styles.buttonText}>
					{loading ? "Creating Account..." : "Sign Up"}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate("Login")}>
				<Text style={styles.link}>Already have an account? Log In</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		backgroundColor: "#F8F9FA",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		marginBottom: 10,
		borderRadius: 5,
		fontSize: 16,
	},
	button: {
		backgroundColor: "#7399C6",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
	},
	disabledButton: {
		backgroundColor: "#A0A0A0",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	link: {
		marginTop: 10,
		textAlign: "center",
		color: "#7399C6",
	},
});
