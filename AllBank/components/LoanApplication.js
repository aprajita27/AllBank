import React, { useState } from "react";
import BackButton from "./BackButton";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from "react-native";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
export default function LoanApplication({ navigation }) {
	const [loanType, setLoanType] = useState("");
	const [amount, setAmount] = useState("");
	const [duration, setDuration] = useState(""); // Duration in months
	const [loading, setLoading] = useState(false);

	const handleApplyLoan = async () => {
		if (!loanType || !amount || !duration) {
			Alert.alert("Error", "All fields are mandatory.");
			return;
		}

		if (isNaN(amount) || isNaN(duration)) {
			Alert.alert("Error", "Amount and Duration must be numeric.");
			return;
		}

		setLoading(true);

		try {
			const user = auth.currentUser;

			if (user) {
				const loanApplication = {
					type: loanType,
					principalAmount: parseFloat(amount),
					durationMonths: parseInt(duration, 10),
					status: "Pending",
					appliedOn: new Date().toISOString(),
				};

				await updateDoc(doc(db, "users", user.uid), {
					"accounts.loans": arrayUnion(loanApplication),
				});

				Alert.alert(
					"Success",
					"Loan application submitted successfully!",
					[{ text: "OK", onPress: () => navigation.goBack() }]
				);
			}
		} catch (error) {
			console.error("Error applying for loan:", error);
			Alert.alert("Error", "Failed to apply for loan. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<BackButton navigation={navigation} />
			<Text style={styles.title}>Apply for a Loan</Text>
			<TextInput
				style={styles.input}
				placeholder="Loan Type (e.g., Personal, Home)"
				value={loanType}
				onChangeText={setLoanType}
			/>
			<TextInput
				style={styles.input}
				placeholder="Loan Amount"
				value={amount}
				onChangeText={setAmount}
				keyboardType="numeric"
			/>
			<TextInput
				style={styles.input}
				placeholder="Duration (in months)"
				value={duration}
				onChangeText={setDuration}
				keyboardType="numeric"
			/>

			<TouchableOpacity
				style={styles.submitButton}
				onPress={handleApplyLoan}
				disabled={loading}
			>
				<Text style={styles.buttonText}>
					{loading ? "Submitting..." : "Submit Application"}
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
	submitButton: {
		backgroundColor: "#4CAF50",
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
