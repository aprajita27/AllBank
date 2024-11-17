import React, { useState } from "react";
import {
	View,
	TextInput,
	Text,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { loginUser } from "../utils/firebaseAuth"; // Firebase auth logic

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
			// navigation.navigate("Dashboard"); // Navigate to Dashboard after login
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<View style={styles.container}>
			<Animatable.Text animation="bounceIn" style={styles.title}>
				Log In
			</Animatable.Text>

			{error ? (
				<Animatable.Text animation="fadeIn" style={styles.error}>
					{error}
				</Animatable.Text>
			) : null}

			<Animatable.View
				animation="slideInUp"
				style={styles.inputContainer}
			>
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
			</Animatable.View>

			<TouchableOpacity
				style={styles.buttonPrimary}
				onPress={handleLogin}
			>
				<Text style={styles.buttonText}>Log In</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
				<Text style={styles.footerText}>
					Don’t have an account?{" "}
					<Text style={styles.linkText}>Sign Up</Text>
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F8F9FA",
		padding: 20,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 20,
		textAlign: "center",
	},
	inputContainer: {
		width: "100%",
		alignItems: "center",
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 12,
		marginBottom: 10,
		fontSize: 16,
		width: "80%",
	},
	buttonPrimary: {
		backgroundColor: "#7399C6",
		paddingVertical: 15,
		borderRadius: 50,
		width: "80%",
		alignItems: "center",
		marginBottom: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5,
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	footerText: {
		fontSize: 14,
		color: "#333",
	},
	linkText: {
		color: "#7399C6",
		fontWeight: "bold",
	},
	error: {
		color: "red",
		marginBottom: 10,
		textAlign: "center",
	},
});

export default Login;
