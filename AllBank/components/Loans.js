import React, { useEffect, useState } from "react";
import BackButton from "./BackButton";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	Alert,
	TouchableOpacity,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Loans({ navigation }) {
	const [loans, setLoans] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchLoans = async () => {
		try {
			setLoading(true);
			const user = auth.currentUser;
			if (user) {
				const docRef = doc(db, "users", user.uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const userData = docSnap.data();
					const userLoans = userData.accounts?.loans || [];
					setLoans(userLoans);
				} else {
					Alert.alert("Error", "No user data found.");
				}
			}
		} catch (error) {
			console.error("Error fetching loans:", error);
			Alert.alert("Error", "Failed to fetch loans.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLoans();
	}, []);

	const renderLoanItem = ({ item }) => (
		<View style={styles.loanItem}>
			<Text style={styles.loanText}>Type: {item.type || "N/A"}</Text>
			<Text style={styles.loanText}>
				Principal: $
				{item.principalAmount
					? item.principalAmount.toFixed(2)
					: "0.00"}
			</Text>
			<Text style={styles.loanText}>
				Duration: {item.durationMonths || "N/A"} months
			</Text>
			<Text style={styles.loanText}>Status: {item.status || "N/A"}</Text>
		</View>
	);

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#7399C6" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<BackButton navigation={navigation} />
			<Text style={styles.title}>My Loans</Text>
			{loans.length > 0 ? (
				<FlatList
					data={loans}
					keyExtractor={(item, index) => `${item.type}_${index}`}
					renderItem={renderLoanItem}
				/>
			) : (
				<Text style={styles.message}>No loans found.</Text>
			)}
			<TouchableOpacity
				style={styles.applyButton}
				onPress={() => navigation.navigate("LoanCalculator")}
			>
				<Text style={styles.buttonText}>Loan Calculator</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.applyButton}
				onPress={() => navigation.navigate("LoanApplication")}
			>
				<Text style={styles.buttonText}>Apply for Loan</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
		padding: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 20,
		textAlign: "center",
		marginTop: 90
	},
	message: {
		fontSize: 18,
		color: "#555",
		textAlign: "center",
	},
	loanItem: {
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 15,
		marginBottom: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 2,
	},
	loanText: {
		fontSize: 16,
		color: "#333",
		marginBottom: 5,
	},
	applyButton: {
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
	backButton: {
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
});
