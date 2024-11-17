// import React, { useState, useEffect } from "react";
// import {
// 	View,
// 	Text,
// 	StyleSheet,
// 	Alert,
// 	TouchableOpacity,
// 	Modal,
// } from "react-native";
// import { doc, getDoc } from "firebase/firestore";
// import { db, auth } from "../firebaseConfig";
// import { Ionicons } from "@expo/vector-icons";

// export default function Banking({ navigation }) {
// 	const [account, setAccount] = useState(null);
// 	const [loading, setLoading] = useState(false);
// 	const [modalVisible, setModalVisible] = useState(false);

// 	const staticRoutingNumber = "021000021"; // Static routing number

// 	const fetchAccount = async () => {
// 		try {
// 			setLoading(true);
// 			const user = auth.currentUser;
// 			if (user) {
// 				const docRef = doc(db, "users", user.uid);
// 				const docSnap = await getDoc(docRef);

// 				if (docSnap.exists()) {
// 					const userData = docSnap.data();
// 					setAccount({
// 						accountNumber: userData.accountNumber,
// 						balance: userData.accounts.savings.currentBalance,
// 						virtualCard: userData.cardDetails,
// 					});
// 				} else {
// 					setAccount(null);
// 				}
// 			}
// 		} catch (error) {
// 			console.error("Error fetching account details:", error);
// 			Alert.alert("Error", "Failed to fetch account details.");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchAccount();
// 	}, []);

// 	if (!account) {
// 		return (
// 			<View style={styles.container}>
// 				<Text style={styles.message}>
// 					You do not have an account yet.
// 				</Text>
// 			</View>
// 		);
// 	}

// 	const { accountNumber, balance, virtualCard } = account;

// 	return (
// 		<View style={styles.container}>
// 			<Text style={styles.title}>Banking</Text>
// 			<View style={styles.balanceContainer}>
// 				<Text style={styles.label}>Balance</Text>
// 				<TouchableOpacity onPress={fetchAccount}>
// 					<Ionicons name="refresh-circle" size={24} color="#7399C6" />
// 				</TouchableOpacity>
// 			</View>
// 			<Text style={styles.value}>${balance.toFixed(2)}</Text>
// 			<Text style={styles.label}>Account Number</Text>
// 			<Text style={styles.value}>{accountNumber}</Text>
// 			<Text style={styles.label}>Routing Number</Text>
// 			<Text style={styles.value}>{staticRoutingNumber}</Text>

// 			<TouchableOpacity
// 				style={styles.showCardButton}
// 				onPress={() => setModalVisible(true)}
// 			>
// 				<Text style={styles.buttonText}>Show Card Details</Text>
// 			</TouchableOpacity>

// 			<TouchableOpacity
// 				style={styles.actionButton}
// 				onPress={() => navigation.navigate("TransactionDetails")}
// 			>
// 				<Text style={styles.buttonText}>View Transactions</Text>
// 			</TouchableOpacity>

// 			<TouchableOpacity
// 				style={styles.actionButton}
// 				onPress={() => navigation.navigate("SendMoney")}
// 			>
// 				<Text style={styles.buttonText}>Send Money</Text>
// 			</TouchableOpacity>
// 			<TouchableOpacity
// 				style={styles.actionButton}
// 				onPress={() => navigation.navigate("Loans")}
// 			>
// 				<Text style={styles.buttonText}>View Loans</Text>
// 			</TouchableOpacity>

// 			{/* Modal for Card Details */}
// 			<Modal
// 				animationType="slide"
// 				transparent={true}
// 				visible={modalVisible}
// 				onRequestClose={() => setModalVisible(false)}
// 			>
// 				<View style={styles.modalContainer}>
// 					<View style={styles.modalContent}>
// 						<Text style={styles.cardNumber}>
// 							{virtualCard.cardNumber}
// 						</Text>
// 						<View style={styles.cardDetails}>
// 							<Text style={styles.cardText}>
// 								Expiry: {virtualCard.expiryDate}
// 							</Text>
// 							<Text style={styles.cardText}>
// 								CVV: {virtualCard.cvv}
// 							</Text>
// 						</View>
// 						<View style={styles.cardDetails}>
// 						<Text style={styles.cardText}>Card Holder Name: John Doe </Text>
// 							<Text></Text>
// 						</View>
// 						<TouchableOpacity
// 							style={styles.closeButton}
// 							onPress={() => setModalVisible(false)}>
// 							<Text style={styles.closeButtonText}>Close</Text>
// 						</TouchableOpacity>
// 					</View>
// 				</View>
// 			</Modal>
// 		</View>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#F8F9FA",
// 		padding: 20,
// 		justifyContent: "center",
// 	},
// 	title: {
// 		fontSize: 28,
// 		fontWeight: "bold",
// 		color: "#333",
// 		marginBottom: 20,
// 		textAlign: "center",
// 	},
// 	label: {
// 		fontSize: 16,
// 		color: "#555",
// 		marginBottom: 5,
// 	},
// 	value: {
// 		fontSize: 18,
// 		color: "#333",
// 		fontWeight: "bold",
// 		marginBottom: 20,
// 	},
// 	message: {
// 		fontSize: 18,
// 		color: "#555",
// 		textAlign: "center",
// 	},
// 	balanceContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 		marginBottom: 10,
// 	},
// 	showCardButton: {
// 		backgroundColor: "#7399C6",
// 		paddingVertical: 15,
// 		borderRadius: 8,
// 		alignItems: "center",
// 		marginTop: 20,
// 	},
// 	actionButton: {
// 		backgroundColor: "#4CAF50",
// 		paddingVertical: 15,
// 		borderRadius: 8,
// 		alignItems: "center",
// 		marginTop: 15,
// 	},
// 	buttonText: {
// 		color: "#FFF",
// 		fontSize: 16,
// 		fontWeight: "bold",
// 	},
// 	closeButtonText: {
// 		color: "#000",
// 		fontSize: 16,
// 		fontWeight: "bold",
// 	},
// 	modalContainer: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "rgba(0, 0, 0, 0.7)",
// 	},
// 	modalContent: {
// 		backgroundColor: "#7399C6",
// 		padding: 20,
// 		borderRadius: 12,
// 		width: "80%",
// 		alignItems: "center",
// 	},
// 	cardNumber: {
// 		fontSize: 20,
// 		color: "#fff",
// 		letterSpacing: 2,
// 		marginBottom: 10,
// 		textAlign: "center",
// 	},
// 	cardDetails: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		width: "100%",
// 		marginBottom: 20,
// 	},
// 	cardText: {
// 		fontSize: 16,
// 		color: "#fff",
// 	},
// 	closeButton: {
// 		backgroundColor: "#FFF",
// 		paddingVertical: 10,
// 		paddingHorizontal: 20,
// 		borderRadius: 8,
// 		alignItems: "center",
// 	},
// });

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
import { LinearGradient } from "expo-linear-gradient";

export default function Banking({ navigation }) {
	const [account, setAccount] = useState(null);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const staticRoutingNumber = "021000021";

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
			<View style={styles.card}>
				<View style={styles.balanceContainer}>
					<Text style={styles.label}>Balance</Text>
				</View>
				<Text style={styles.value}>${balance.toFixed(2)}</Text>
			</View>

			<View style={styles.card}>
				<Text style={styles.label}>Account Number</Text>
				<Text style={styles.value}>{accountNumber}</Text>
				<Text style={styles.label}>Routing Number</Text>
				<Text style={styles.value}>{staticRoutingNumber}</Text>
			</View>

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

			<TouchableOpacity
				style={styles.actionButton}
				onPress={() => navigation.navigate("Loans")}
			>
				<Text style={styles.buttonText}>View Loans</Text>
			</TouchableOpacity>

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
							<Text style={styles.cardText}>CVV: {virtualCard.cvv}</Text>
						</View>
						<Text style={styles.cardText}>Card Holder Name: John Doe</Text>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setModalVisible(false)}
						>
							<Text style={styles.closeButtonText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<TouchableOpacity onPress={fetchAccount}>
						<Ionicons name="refresh-circle" size={28} color="#7399C6" />
					</TouchableOpacity>
		</View>
		
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingTop: 90,
		paddingLeft: 30,
		paddingRight: 30
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 20,
		textAlign: "center",
	},
	card: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 15,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 10,
		elevation: 5,
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
		marginBottom: 10,
	},
	showCardButton: {
		backgroundColor: "#7399C6",
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 10,
		shadowColor: "#7399C6",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
	actionButton: {
		backgroundColor: "#4A77C0",
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
	},
	buttonText: {
		color: "#FFF",
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
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 15,
		width: "85%",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
	},
	cardNumber: {
		fontSize: 20,
		color: "#333",
		letterSpacing: 1,
		marginBottom: 10,
		textAlign: "center",
		fontWeight: "bold"
	},
	cardDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginBottom: 15,
	},
	cardText: {
		fontSize: 16,
		color: "#333"
	},
	closeButton: {
		backgroundColor: "#7399C6",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 15
	},
	closeButtonText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
	},
});
