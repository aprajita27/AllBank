import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	Alert,
	TouchableOpacity,
	Modal,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function Banking() {
	const [account, setAccount] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);

	const staticRoutingNumber = "021000021"; // Static routing number

	useEffect(() => {
		const fetchAccount = async () => {
			try {
				const user = auth.currentUser; // Fetch current user
				if (user) {
					const docRef = doc(db, "users", user.uid); // Reference the user's document
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						const userData = docSnap.data();
						setAccount({
							accountNumber: userData.accountNumber,
							balance: userData.accounts.savings.currentBalance,
							virtualCard: userData.cardDetails,
						});
					} else {
						setAccount(null); // No account exists
					}
				}
			} catch (error) {
				console.error("Error fetching account details:", error);
				Alert.alert("Error", "Failed to fetch account details.");
			}
		};

		fetchAccount();
	}, []);

	if (!account) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					You do not have an account yet.
				</Text>
			</View>
		);
	}

	const { accountNumber, balance, virtualCard } = account;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Banking</Text>
			<Text style={styles.label}>Account Number</Text>
			<Text style={styles.value}>{accountNumber}</Text>
			<Text style={styles.label}>Routing Number</Text>
			<Text style={styles.value}>{staticRoutingNumber}</Text>
			<Text style={styles.label}>Balance</Text>
			<Text style={styles.value}>${balance.toFixed(2)}</Text>

			<TouchableOpacity
				style={styles.showCardButton}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.buttonText}>Show Card Details</Text>
			</TouchableOpacity>

			{/* Modal for Card Details */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.cardNumber}>
							{virtualCard.cardNumber}
						</Text>
						<View style={styles.cardDetails}>
							<Text style={styles.cardText}>
								Expiry: {virtualCard.expiryDate}
							</Text>
							<Text style={styles.cardText}>
								CVV: {virtualCard.cvv}
							</Text>
						</View>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setModalVisible(false)}
						>
							<Text style={styles.buttonText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
		padding: 20,
		justifyContent: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 20,
		textAlign: "center",
	},
	label: {
		fontSize: 16,
		color: "#555",
		marginBottom: 5,
	},
	value: {
		fontSize: 18,
		color: "#333",
		fontWeight: "bold",
		marginBottom: 20,
	},
	message: {
		fontSize: 18,
		color: "#555",
		textAlign: "center",
	},
	showCardButton: {
		backgroundColor: "#7399C6",
		paddingVertical: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.7)",
	},
	modalContent: {
		backgroundColor: "#7399C6",
		padding: 20,
		borderRadius: 12,
		width: "80%",
		alignItems: "center",
	},
	cardNumber: {
		fontSize: 24,
		color: "#fff",
		letterSpacing: 2,
		marginBottom: 10,
		textAlign: "center",
	},
	cardDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginBottom: 20,
	},
	cardText: {
		fontSize: 16,
		color: "#fff",
	},
	closeButton: {
		backgroundColor: "#FF4C4C",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
	},
});
