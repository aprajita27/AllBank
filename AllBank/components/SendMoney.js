import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from "react-native";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function SendMoney({ navigation }) {
	const [receiverAccount, setReceiverAccount] = useState("");
	const [routingNumber, setRoutingNumber] = useState("");
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSendMoney = async () => {
		if (!receiverAccount || !routingNumber || !amount) {
			Alert.alert("Error", "All fields are mandatory.");
			return;
		}

		setLoading(true);
		try {
			// Fetch sender details
			const senderRef = doc(db, "users", auth.currentUser.uid);
			const senderSnap = await getDoc(senderRef);

			if (!senderSnap.exists()) {
				Alert.alert("Error", "Sender account not found.");
				setLoading(false);
				return;
			}

			const senderData = senderSnap.data();
			const senderBalance = senderData.accounts.savings.currentBalance;

			if (parseFloat(amount) > senderBalance) {
				Alert.alert("Error", "Insufficient balance.");
				setLoading(false);
				return;
			}

			// Check if receiver exists in `accountMappings`
			const mappingRef = doc(db, "accountMappings", receiverAccount);
			const mappingSnap = await getDoc(mappingRef);

			if (!mappingSnap.exists()) {
				Alert.alert("Error", "Receiver account does not exist.");
				setLoading(false);
				return;
			}

			// Fetch receiver details
			const receiverUid = mappingSnap.data().uid;
			const receiverRef = doc(db, "users", receiverUid);
			const receiverSnap = await getDoc(receiverRef);

			if (!receiverSnap.exists()) {
				Alert.alert("Error", "Receiver account data missing.");
				setLoading(false);
				return;
			}

			const receiverData = receiverSnap.data();

			// Update sender account
			await updateDoc(senderRef, {
				"accounts.savings.currentBalance":
					senderBalance - parseFloat(amount),
				"accounts.transactions": arrayUnion({
					transactionId: `txn_${Date.now()}`,
					senderAccountNumber: senderData.accountNumber,
					receiverAccountNumber: receiverAccount,
					type: "transfer",
					description: "Money Transfer",
					amount: parseFloat(amount),
					timestamp: new Date().toISOString(),
				}),
			});

			// Update receiver account
			await updateDoc(receiverRef, {
				"accounts.savings.currentBalance":
					receiverData.accounts.savings.currentBalance +
					parseFloat(amount),
				"accounts.transactions": arrayUnion({
					transactionId: `txn_${Date.now()}`,
					senderAccountNumber: senderData.accountNumber,
					receiverAccountNumber: receiverAccount,
					type: "receive",
					description: "Money Received",
					amount: parseFloat(amount),
					timestamp: new Date().toISOString(),
				}),
			});

			Alert.alert("Success", "Money sent successfully!");
			// navigation.navigate("Banking");
		} catch (error) {
			console.error("Error sending money:", error);
			Alert.alert("Error", "Failed to send money. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Send Money</Text>
			<TextInput
				style={styles.input}
				placeholder="Receiver Account Number"
				value={receiverAccount}
				onChangeText={setReceiverAccount}
				keyboardType="numeric"
			/>
			<TextInput
				style={styles.input}
				placeholder="Routing Number"
				value={routingNumber}
				onChangeText={setRoutingNumber}
				keyboardType="numeric"
			/>
			<TextInput
				style={styles.input}
				placeholder="Amount"
				value={amount}
				onChangeText={setAmount}
				keyboardType="numeric"
			/>
			<TouchableOpacity
				style={styles.sendButton}
				onPress={handleSendMoney}
				disabled={loading}
			>
				<Text style={styles.buttonText}>
					{loading ? "Sending..." : "Send Money"}
				</Text>
			</TouchableOpacity>
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
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		marginBottom: 15,
	},
	sendButton: {
		backgroundColor: "#7399C6",
		paddingVertical: 15,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});
