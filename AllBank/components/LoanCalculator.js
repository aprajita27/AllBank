import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import BackButton from "./BackButton";

export default function LoanCalculator({ navigation }) {
	const [loanAmount, setLoanAmount] = useState("");
	const [interestRate, setInterestRate] = useState("");
	const [loanTerm, setLoanTerm] = useState(""); // in months
	const [result, setResult] = useState(null);

	const calculateLoanDetails = () => {
		if (!loanAmount || !interestRate || !loanTerm) {
			alert("Please fill all the fields.");
			return;
		}

		const principal = parseFloat(loanAmount);
		const annualRate = parseFloat(interestRate) / 100;
		const termMonths = parseInt(loanTerm);

		const monthlyRate = annualRate / 12;
		const numerator =
			principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths);
		const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
		const monthlyPayment = numerator / denominator;

		let totalPayment = monthlyPayment * termMonths;
		let totalInterest = totalPayment - principal;

		setResult({
			monthlyPayment: monthlyPayment.toFixed(2),
			totalPayment: totalPayment.toFixed(2),
			totalInterest: totalInterest.toFixed(2),
		});
	};

	return (
		<View style={styles.container}>
			<BackButton navigation={navigation} />
			<Text style={styles.title}>Loan Calculator</Text>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					placeholder="Loan Amount"
					value={loanAmount}
					onChangeText={setLoanAmount}
					keyboardType="numeric"
				/>
				<TextInput
					style={styles.input}
					placeholder="Annual Interest Rate (%)"
					value={interestRate}
					onChangeText={setInterestRate}
					keyboardType="numeric"
				/>
				<TextInput
					style={styles.input}
					placeholder="Loan Term (Months)"
					value={loanTerm}
					onChangeText={setLoanTerm}
					keyboardType="numeric"
				/>
				<TouchableOpacity
					style={styles.calculateButton}
					onPress={calculateLoanDetails}
				>
					<Text style={styles.buttonText}>Calculate</Text>
				</TouchableOpacity>
			</View>
			{result && (
				<View style={styles.resultContainer}>
					<Text style={styles.resultText}>
						Monthly Payment: ${result.monthlyPayment}
					</Text>
					<Text style={styles.resultText}>
						Total Payment: ${result.totalPayment}
					</Text>
					<Text style={styles.resultText}>
						Total Interest: ${result.totalInterest}
					</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 20,
		textAlign: "center",
	},
	inputContainer: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		width: "80%",
		marginBottom: 15,
	},
	calculateButton: {
		backgroundColor: "#4CAF50",
		paddingVertical: 15,
		borderRadius: 8,
		alignItems: "center",
		width: "80%",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	resultContainer: {
		marginTop: 20,
		alignItems: "center",
	},
	resultText: {
		fontSize: 18,
		color: "#333",
		marginBottom: 10,
		textAlign: "center",
	},
});
