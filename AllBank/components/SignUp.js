import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { signUpUser } from "../utils/firebaseAuth"; // Assuming firebaseAuth.js contains Firebase functions

const SignUp = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSignUp = async () => {
		setError(""); // Clear previous errors
		if (!email.includes("@")) {
			setError("Please enter a valid email address.");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters long.");
			return;
		}

		try {
			const { user } = await signUpUser(email, password);
			console.log("User signed up successfully:", user);
			navigation.navigate("Login"); // Navigate to Login screen after sign-up
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Sign Up</Text>
			{error ? <Text style={styles.error}>{error}</Text> : null}
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={(text) => setEmail(text)}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={password}
				onChangeText={(text) => setPassword(text)}
				secureTextEntry
			/>
			<Button title="Sign Up" onPress={handleSignUp} />
			<Text
				style={styles.link}
				onPress={() => navigation.navigate("Login")}
			>
				Already have an account? Log In
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
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
	},
	error: {
		color: "red",
		textAlign: "center",
		marginBottom: 10,
	},
	link: {
		color: "blue",
		marginTop: 20,
		textAlign: "center",
	},
});

export default SignUp;
