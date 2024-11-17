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
import { Ionicons } from "@expo/vector-icons";

export default function Banking({ navigation }) {
	const [account, setAccount] = useState(null);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const staticRoutingNumber = "021000021"; // Static routing number

	const fetchAccount = async () => {
		try {
			setLoading(true);
			const user = auth.currentUser;
			if (user) {
				const docRef = doc(db, "users", user.uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const userData = docSnap.data();
					setAccount({
						accountNumber: userData.accountNumber,
						balance: userData.accounts.savings.currentBalance,
						virtualCard: userData.cardDetails,
					});
				} else {
					setAccount(null);
				}
			}
		} catch (error) {
			console.error("Error fetching account details:", error);
			Alert.alert("Error", "Failed to fetch account details.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
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
			<View style={styles.balanceContainer}>
				<Text style={styles.label}>Balance</Text>
				<TouchableOpacity onPress={fetchAccount}>
					<Ionicons name="refresh-circle" size={24} color="#7399C6" />
				</TouchableOpacity>
			</View>
			<Text style={styles.value}>${balance.toFixed(2)}</Text>
			<Text style={styles.label}>Account Number</Text>
			<Text style={styles.value}>{accountNumber}</Text>
			<Text style={styles.label}>Routing Number</Text>
			<Text style={styles.value}>{staticRoutingNumber}</Text>

			<TouchableOpacity
				style={styles.showCardButton}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.buttonText}>Show Card Details</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.actionButton}
				onPress={() => navigation.navigate("TransactionDetails")}
			>
				<Text style={styles.buttonText}>View Transactions</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.actionButton}
				onPress={() => navigation.navigate("SendMoney")}
			>
				<Text style={styles.buttonText}>Send Money</Text>
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
	balanceContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	showCardButton: {
		backgroundColor: "#7399C6",
		paddingVertical: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
	},
	actionButton: {
		backgroundColor: "#4CAF50",
		paddingVertical: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 15,
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
