import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
	Modal,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Profile({ navigation }) {
	const [userDetails, setUserDetails] = useState(null);
	const [date, setDate] = useState(new Date());
	const [modalVisible, setModalVisible] = useState(false);
	const [isScheduling, setIsScheduling] = useState(false);

	// Fetch user details from Firestore
	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				const user = auth.currentUser;
				if (user) {
					const docRef = doc(db, "users", user.uid);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						setUserDetails(docSnap.data());
					} else {
						Alert.alert(
							"Error",
							"Failed to fetch user details. Please try again."
						);
					}
				}
			} catch (error) {
				console.error("Error fetching user details:", error);
				Alert.alert("Error", "An error occurred. Please try again.");
			}
		};

		fetchUserDetails();
	}, []);

	const handleSignOut = async () => {
		try {
			await auth.signOut();
			Alert.alert("Success", "You have been signed out.");
		} catch (error) {
			console.error("Error signing out:", error);
			Alert.alert("Error", "Failed to sign out. Please try again.");
		}
	};

	const handleSchedule = () => {
		setIsScheduling(true);
		setTimeout(() => {
			Alert.alert(
				"Appointment Scheduled",
				`Your appointment is set for ${date.toLocaleString()}`
			);
			setIsScheduling(false);
			setModalVisible(false);
		}, 1000); // Simulate network delay
	};

	if (!userDetails) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Loading...</Text>
			</View>
		);
	}

	const { accountNumber, routingNumber, name } = userDetails;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Profile</Text>
			<Text style={styles.name}>Welcome, {name}</Text>

			{/* QR Code */}
			<View style={styles.qrCodeContainer}>
				<Text style={styles.label}>Your QR Code</Text>
				<QRCode
					value={JSON.stringify({
						accountNumber,
						routingNumber,
						name,
					})}
					size={150}
					backgroundColor="white"
					color="#7399C6"
				/>
			</View>

			{/* Doorstep Banking */}
			<TouchableOpacity
				style={styles.actionButton}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.buttonText}>Schedule Doorstep Banking</Text>
			</TouchableOpacity>

			{/* Modal for Appointment Scheduling */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>
							Schedule an Appointment
						</Text>
						<DateTimePicker
							value={date}
							mode="datetime"
							display="spinner"
							textColor="black"
							onChange={(event, selectedDate) =>
								setDate(selectedDate || date)
							}
						/>

						<TouchableOpacity
							style={styles.modalButton}
							onPress={handleSchedule}
							disabled={isScheduling}
						>
							<Text style={styles.buttonText}>
								{isScheduling
									? "Scheduling..."
									: "Confirm Appointment"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.modalButton}
							onPress={() => setModalVisible(false)}
						>
							<Text style={styles.buttonText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* Sign Out Button */}
			<TouchableOpacity
				style={styles.signOutButton}
				onPress={handleSignOut}
			>
				<Text style={styles.buttonText}>Sign Out</Text>
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
		alignItems: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 10,
		textAlign: "center",
	},
	name: {
		fontSize: 18,
		fontWeight: "500",
		color: "#555",
		marginBottom: 20,
		textAlign: "center",
	},
	qrCodeContainer: {
		alignItems: "center",
		marginBottom: 20,
	},
	label: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#555",
		marginBottom: 10,
		textAlign: "center",
	},
	actionButton: {
		backgroundColor: "#4CAF50",
		paddingVertical: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 15,
		width: "80%",
	},
	signOutButton: {
		backgroundColor: "#7399C6",
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
		width: "80%",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "#FFF",
		padding: 20,
		borderRadius: 12,
		width: "90%",
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 20,
	},
	modalButton: {
		backgroundColor: "#7399C6",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 15,
		width: "60%",
	},
});
