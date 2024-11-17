import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as Animatable from "react-native-animatable";

export default function Onboarding({ navigation }) {
	return (
		<View style={styles.container}>
			{/* Animated Logo */}
			<Animatable.View
				animation="bounceIn"
				delay={300}
				style={styles.logoContainer}
			>
				<Image
					source={require("../assets/logo.png")} // Replace with your logo path
					style={styles.logo}
				/>
			</Animatable.View>

			{/* Animated Title */}
			<Animatable.Text
				animation="fadeInDown"
				delay={600}
				style={styles.title}
			>
				Welcome to AllBank
			</Animatable.Text>

			{/* Animated Subtitle */}
			<Animatable.Text
				animation="fadeIn"
				delay={900}
				style={styles.subtitle}
			>
				Banking tailored for you. Manage, invest, and grow your wealth
				with confidence.
			</Animatable.Text>

			{/* Buttons with Slide-In Animation */}
			<Animatable.View
				animation="slideInUp"
				delay={1200}
				style={styles.buttonContainer}
			>
				<TouchableOpacity
					style={styles.buttonPrimary}
					onPress={() => navigation.navigate("SignUp")}
				>
					<Text style={styles.buttonText}>Create Account</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.buttonSecondary}
					onPress={() => navigation.navigate("Login")}
				>
					<Text style={styles.buttonSecondaryText}>Log In</Text>
				</TouchableOpacity>
			</Animatable.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F8F9FA",
		padding: 20,
	},
	logoContainer: {
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 6,
		elevation: 5, // For Android shadow
	},
	logo: {
		width: 120, // Adjust size as needed
		height: 120,
		borderRadius: 60, // Makes the logo circular
		borderWidth: 2,
		borderColor: "#7399C6", // Border matching the theme
	},
	title: {
		fontSize: 36,
		fontWeight: "bold",
		color: "#7399C6",
		textAlign: "center",
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 18,
		color: "#5F6368",
		textAlign: "center",
		marginBottom: 30,
		paddingHorizontal: 20,
		lineHeight: 24,
	},
	buttonContainer: {
		width: "100%",
		alignItems: "center",
	},
	buttonPrimary: {
		backgroundColor: "#7399C6",
		paddingVertical: 15,
		paddingHorizontal: 25,
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
	buttonSecondary: {
		backgroundColor: "#F8F9FA",
		paddingVertical: 15,
		paddingHorizontal: 25,
		borderRadius: 50,
		width: "80%",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#7399C6",
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "bold",
	},
	buttonSecondaryText: {
		color: "#7399C6",
		fontSize: 18,
		fontWeight: "bold",
	},
});
