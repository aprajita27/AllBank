import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Firestore instance
import { auth } from "../firebaseConfig"; // Firebase Auth instance

export default function Banking({ navigation }) {
	const [account, setAccount] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchAccountDetails = async () => {
		try {
			const user = auth.currentUser;
			if (user) {
				const docRef = doc(db, "accounts", user.uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setAccount(docSnap.data());
				} else {
					setAccount(null);
				}
			}
		} catch (error) {
			console.error("Error fetching account details:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAccountDetails();
	}, []);

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#7399C6" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{account ? (
				<View>
					<Text style={styles.title}>Your Account</Text>
					<Text style={styles.accountText}>
						Account Number: {account.accountNumber}
					</Text>
					<Text style={styles.accountText}>
						Balance: ${account.balance}
					</Text>
				</View>
			) : (
				<View>
					<Text style={styles.title}>No Account Found</Text>
					<TouchableOpacity
						style={styles.buttonPrimary}
						onPress={() => navigation.navigate("CreateAccount")}
					>
						<Text style={styles.buttonText}>Create Account</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.buttonSecondary}
						onPress={() => navigation.navigate("AI Banker")}
					>
						<Text style={styles.buttonText}>AI Assistant</Text>
					</TouchableOpacity>
				</View>
			)}
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
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 20,
	},
	accountText: {
		fontSize: 18,
		color: "#666",
		marginBottom: 10,
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
	buttonSecondary: {
		backgroundColor: "#E0E0E0",
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
});
