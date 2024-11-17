import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
	Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function CreateAccount({ navigation }) {
	const [ssn, setSSN] = useState("");
	const [idProof, setIdProof] = useState(null); // ID Proof image URI
	const [addressProof, setAddressProof] = useState(null); // Address Proof image URI
	const [isAgreed, setIsAgreed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [userDetails, setUserDetails] = useState({
		name: "",
		phoneNumber: "",
	});

	// Fetch user details from Firestore
	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				const user = auth.currentUser;
				if (user) {
					const docRef = doc(db, "users", user.uid);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						const userData = docSnap.data();
						setUserDetails({
							name: userData.name,
							phoneNumber: userData.phoneNumber,
						});
					} else {
						Alert.alert(
							"Error",
							"User details not found in the database. Please update your profile."
						);
					}
				}
			} catch (error) {
				console.error("Error fetching user details:", error);
				Alert.alert("Error", "Failed to fetch user details.");
			}
		};

		fetchUserDetails();
	}, []);

	const generateVirtualCard = () => {
		const cardNumber = Array(16)
			.fill(0)
			.map((id) => Math.floor(Math.random() * 10))
			.join(""); // Generate a 16-digit card number
		const expiryDate = `${new Date().getMonth() + 1}/${
			new Date().getFullYear() + 5
		}`; // Card expiry 5 years from now
		const cvv = Math.floor(100 + Math.random() * 900).toString(); // Generate a 3-digit CVV
		return { cardNumber, expiryDate, cvv };
	};

	const pickImage = async (setter) => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setter(result.uri);
		}
	};

	const handleSubmit = async () => {
		if (!ssn || !isAgreed) {
			Alert.alert(
				"Error",
				"SSN and agreement are mandatory. Please complete the form."
			);
			return;
		}

		setLoading(true);
		try {
			// Generate a unique account number
			const accountNumber =
				Math.floor(Math.random() * 9000000000) + 1000000000;

			// Generate a virtual card
			const virtualCard = generateVirtualCard();

			// Prepare the account data
			const accountData = {
				accountNumber,
				routingNumber: "021000021", // Static routing number
				cardDetails: virtualCard,
				accounts: {
					savings: {
						currentBalance: 0,
						monthlyDeposit: 0,
						annualInterestRate: 0.03,
						savingsGoal: 0,
					},
					goals: [],
					investments: {
						funds: [],
						simulations: [],
					},
					loans: [],
					transactions: [],
				},
				ssn,
				idProof: idProof || null,
				addressProof: addressProof || null,
			};

			// Update the user document in Firestore with account details
			const userRef = doc(db, "users", auth.currentUser.uid);
			await updateDoc(userRef, accountData);

			// Add a mapping in `accountMappings` collection
			const mappingRef = doc(
				db,
				"accountMappings",
				accountNumber.toString()
			);
			await setDoc(mappingRef, { uid: auth.currentUser.uid });

			Alert.alert("Success", "Your account has been created!", [
				{ text: "OK", onPress: () => navigation.navigate("Home") },
			]);
		} catch (error) {
			console.error("Error creating account:", error);
			Alert.alert("Error", "Failed to create account. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Create Account</Text>

			<View style={styles.fieldContainer}>
				<Text style={styles.label}>Name</Text>
				<Text style={styles.field}>{userDetails.name}</Text>
			</View>

			<View style={styles.fieldContainer}>
				<Text style={styles.label}>Phone Number</Text>
				<Text style={styles.field}>{userDetails.phoneNumber}</Text>
			</View>

			<TextInput
				style={styles.input}
				placeholder="Enter SSN"
				value={ssn}
				onChangeText={setSSN}
				keyboardType="numeric"
				maxLength={9}
			/>

			<View style={styles.uploadContainer}>
				<Text style={styles.label}>ID Proof</Text>
				{idProof && (
					<Image source={{ uri: idProof }} style={styles.image} />
				)}
				<TouchableOpacity
					style={styles.uploadButton}
					onPress={() => pickImage(setIdProof)}
				>
					<Text style={styles.buttonText}>Choose ID Proof</Text>
				</TouchableOpacity>
				<Text
					style={{
						fontSize: 14,
						marginTop: 5,
						textAlign: "center",
						color: "#00A000", // Always show as Complete
					}}
				>
					Complete
				</Text>
			</View>

			<View style={styles.uploadContainer}>
				<Text style={styles.label}>Address Proof</Text>
				{addressProof && (
					<Image
						source={{ uri: addressProof }}
						style={styles.image}
					/>
				)}
				<TouchableOpacity
					style={styles.uploadButton}
					onPress={() => pickImage(setAddressProof)}
				>
					<Text style={styles.buttonText}>Choose Address Proof</Text>
				</TouchableOpacity>
				<Text
					style={{
						fontSize: 14,
						marginTop: 5,
						textAlign: "center",
						color: "#00A000", // Always show as Complete
					}}
				>
					Complete
				</Text>
			</View>

			<View style={styles.checkboxContainer}>
				<TouchableOpacity onPress={() => setIsAgreed(!isAgreed)}>
					<View
						style={[styles.checkbox, isAgreed && styles.checked]}
					/>
				</TouchableOpacity>
				<Text style={styles.checkboxLabel}>
					I agree to the terms and conditions.
				</Text>
			</View>

			<TouchableOpacity
				style={[
					styles.submitButton,
					!isAgreed && styles.disabledButton,
				]}
				onPress={handleSubmit}
				disabled={!isAgreed || loading}
			>
				<Text style={styles.buttonText}>
					{loading ? "Submitting..." : "Submit"}
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
	fieldContainer: {
		marginBottom: 15,
	},
	label: {
		fontSize: 16,
		color: "#555",
		marginBottom: 5,
	},
	field: {
		fontSize: 18,
		color: "#333",
		fontWeight: "bold",
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
	uploadContainer: {
		marginBottom: 15,
	},
	uploadButton: {
		backgroundColor: "#7399C6",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: "center",
	},
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderWidth: 1,
		borderColor: "#ccc",
		backgroundColor: "#fff",
		marginRight: 10,
	},
	checked: {
		backgroundColor: "#7399C6",
	},
	checkboxLabel: {
		fontSize: 14,
		color: "#555",
	},
	submitButton: {
		backgroundColor: "#7399C6",
		paddingVertical: 15,
		borderRadius: 50,
		alignItems: "center",
	},
	disabledButton: {
		backgroundColor: "#A0A0A0",
	},
});
