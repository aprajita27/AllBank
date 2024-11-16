import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { loginUser } from "../utils/firebaseAuth"; // Assuming firebaseAuth.js contains Firebase functions

const Login = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleLogin = async () => {
		setError(""); // Clear previous errors

		if (!email.includes("@")) {
			setError("Please enter a valid email address.");
			return;
		}

		if (password.trim() === "") {
			setError("Password cannot be empty.");
			return;
		}

		try {
			const { user } = await loginUser(email, password);
			console.log("User logged in successfully:", user);
			navigation.navigate("Dashboard"); // Navigate to Home screen after login
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Log In</Text>
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
			<Button title="Log In" onPress={handleLogin} />
			<Text
				style={styles.link}
				onPress={() => navigation.navigate("SignUp")}
			>
				Don't have an account? Sign Up
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

export default Login;
