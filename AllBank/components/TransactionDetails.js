import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Alert,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import BackButton from "./BackButton";

export default function TransactionDetails({ navigation }) {
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const docRef = doc(db, "users", auth.currentUser.uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setTransactions(docSnap.data().accounts.transactions || []);
				} else {
					setTransactions([]);
				}
			} catch (error) {
				console.error("Error fetching transactions:", error);
				Alert.alert("Error", "Failed to fetch transactions.");
			}
		};

		fetchTransactions();
	}, []);

	const generatePDF = async () => {
		const htmlContent = `
      <html>
        <body>
          <h1>Transaction Statement</h1>
          <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${transactions
					.map(
						(txn) => `
                <tr>
                  <td>${txn.transactionId}</td>
                  <td>${txn.type}</td>
                  <td>${txn.description}</td>
                  <td>${txn.amount}</td>
                  <td>${new Date(txn.timestamp).toLocaleString()}</td>
                </tr>`
					)
					.join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

		try {
			const { uri } = await Print.printToFileAsync({ html: htmlContent });
			await Sharing.shareAsync(uri);
		} catch (error) {
			console.error("Error generating PDF:", error);
			Alert.alert("Error", "Failed to export transactions as PDF.");
		}
	};

	return (
		<View style={styles.container}>
			<BackButton navigation={navigation} />
			<Text style={styles.title}>Transactions</Text>
			<FlatList
				data={transactions}
				keyExtractor={(item) => item.transactionId}
				renderItem={({ item }) => (
					<View style={styles.transactionItem}>
						<Text style={styles.transactionText}>
							{item.description} - ${item.amount}
						</Text>
						<Text style={styles.transactionDate}>
							{new Date(item.timestamp).toLocaleString()}
						</Text>
					</View>
				)}
			/>
			<TouchableOpacity style={styles.exportButton} onPress={generatePDF}>
				<Text style={styles.buttonText}>Export PDF</Text>
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
	},
	transactionItem: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 8,
		marginBottom: 10,
		elevation: 2,
	},
	transactionText: {
		fontSize: 16,
		color: "#333",
	},
	transactionDate: {
		fontSize: 14,
		color: "#666",
		marginTop: 5,
	},
	exportButton: {
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
