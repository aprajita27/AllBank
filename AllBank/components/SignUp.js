// import React, { useState } from "react";
// import {
// 	View,
// 	TextInput,
// 	Text,
// 	TouchableOpacity,
// 	StyleSheet,
// } from "react-native";
// import * as Animatable from "react-native-animatable";
// import { signUpUser } from "../utils/firebaseAuth"; // Firebase auth logic

// const SignUp = ({ navigation }) => {
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [error, setError] = useState("");

// 	const handleSignUp = async () => {
// 		setError(""); // Clear previous errors
// 		if (!email.includes("@")) {
// 			setError("Please enter a valid email address.");
// 			return;
// 		}

// 		if (password.length < 6) {
// 			setError("Password must be at least 6 characters long.");
// 			return;
// 		}

// 		try {
// 			const { user } = await signUpUser(email, password);
// 			console.log("User signed up successfully:", user);
// 			navigation.navigate("Login"); // Navigate to Login screen after sign-up
// 		} catch (err) {
// 			setError(err.message);
// 		}
// 	};

// 	return (
// 		<View style={styles.container}>
// 			<Animatable.Text animation="bounceIn" style={styles.title}>
// 				Sign Up
// 			</Animatable.Text>

// 			{error ? (
// 				<Animatable.Text animation="fadeIn" style={styles.error}>
// 					{error}
// 				</Animatable.Text>
// 			) : null}

// 			<Animatable.View
// 				animation="slideInUp"
// 				style={styles.inputContainer}
// 			>
// 				<TextInput
// 					style={styles.input}
// 					placeholder="Email"
// 					value={email}
// 					onChangeText={setEmail}
// 					keyboardType="email-address"
// 					autoCapitalize="none"
// 				/>
// 				<TextInput
// 					style={styles.input}
// 					placeholder="Password"
// 					value={password}
// 					onChangeText={setPassword}
// 					secureTextEntry
// 				/>
// 			</Animatable.View>

// 			<TouchableOpacity
// 				style={styles.buttonPrimary}
// 				onPress={handleSignUp}
// 			>
// 				<Text style={styles.buttonText}>Sign Up</Text>
// 			</TouchableOpacity>

// 			<TouchableOpacity onPress={() => navigation.navigate("Login")}>
// 				<Text style={styles.footerText}>
// 					Already have an account?{" "}
// 					<Text style={styles.linkText}>Log In</Text>
// 				</Text>
// 			</TouchableOpacity>
// 		</View>
// 	);
// };

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "#F8F9FA",
// 		padding: 20,
// 	},
// 	title: {
// 		fontSize: 32,
// 		fontWeight: "bold",
// 		color: "#333",
// 		marginBottom: 20,
// 		textAlign: "center",
// 	},
// 	inputContainer: {
// 		width: "100%",
// 		alignItems: "center",
// 		marginBottom: 20,
// 	},
// 	input: {
// 		borderWidth: 1,
// 		borderColor: "#ccc",
// 		backgroundColor: "#fff",
// 		borderRadius: 8,
// 		padding: 12,
// 		marginBottom: 10,
// 		fontSize: 16,
// 		width: "80%",
// 	},
// 	buttonPrimary: {
// 		backgroundColor: "#7399C6",
// 		paddingVertical: 15,
// 		borderRadius: 50,
// 		width: "80%",
// 		alignItems: "center",
// 		marginBottom: 15,
// 		shadowColor: "#000",
// 		shadowOffset: { width: 0, height: 4 },
// 		shadowOpacity: 0.3,
// 		shadowRadius: 6,
// 		elevation: 5,
// 	},
// 	buttonText: {
// 		color: "#fff",
// 		fontSize: 18,
// 		fontWeight: "bold",
// 	},
// 	footerText: {
// 		fontSize: 14,
// 		color: "#333",
// 	},
// 	linkText: {
// 		color: "#7399C6",
// 		fontWeight: "bold",
// 	},
// 	error: {
// 		color: "red",
// 		marginBottom: 10,
// 		textAlign: "center",
// 	},
// });

// export default SignUp;

import React, { useState } from "react";
import {
	View,
	TextInput,
	Text,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { signUpUser } from "../utils/firebaseAuth"; // Firebase Authentication logic
import { storeUserData } from "../utils/firebaseFirestore"; // Firestore logic

const SignUp = ({ navigation }) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSignUp = async () => {
		setError(""); // Clear previous errors

		// Validate fields
		if (
			!firstName ||
			!lastName ||
			!username ||
			!phone ||
			!email ||
			!password
		) {
			setError("All fields are required.");
			return;
		}
		if (!email.includes("@")) {
			setError("Please enter a valid email address.");
			return;
		}
		if (password.length < 6) {
			setError("Password must be at least 6 characters long.");
			return;
		}
		if (!/^\d{10}$/.test(phone)) {
			setError("Please enter a valid 10-digit phone number.");
			return;
		}

		try {
			// Create user in Firebase Authentication
			const { user } = await signUpUser(email, password);
			console.log("User signed up successfully:", user);

			// Store additional user info in Firestore
			await storeUserData(user.uid, {
				firstName,
				lastName,
				username,
				phone,
				email,
			});

			// Navigate to Login screen
			// navigation.navigate("Login");
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<View style={styles.container}>
			<Animatable.Text animation="bounceIn" style={styles.title}>
				Sign Up
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
					placeholder="First Name"
					value={firstName}
					onChangeText={setFirstName}
				/>
				<TextInput
					style={styles.input}
					placeholder="Last Name"
					value={lastName}
					onChangeText={setLastName}
				/>
				<TextInput
					style={styles.input}
					placeholder="Username"
					value={username}
					onChangeText={setUsername}
				/>
				<TextInput
					style={styles.input}
					placeholder="Phone Number"
					value={phone}
					onChangeText={setPhone}
					keyboardType="numeric"
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
			</Animatable.View>

			<TouchableOpacity
				style={styles.buttonPrimary}
				onPress={handleSignUp}
			>
				<Text style={styles.buttonText}>Sign Up</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => navigation.navigate("Login")}>
				<Text style={styles.footerText}>
					Already have an account?{" "}
					<Text style={styles.linkText}>Log In</Text>
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

export default SignUp;
