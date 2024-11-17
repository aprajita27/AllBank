import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Firestore instance
import { auth } from "../firebaseConfig"; // Firebase Auth instance
import Banking from "./Banking";
import Investing from "./Investing";
import AIBanker from "./AIBanker";
import Profile from "./Profile";

const Tab = createBottomTabNavigator();

export default function Home({ navigation }) {
	const [accountExists, setAccountExists] = useState(false);
	const [loading, setLoading] = useState(true);

	const checkAccountExistence = async () => {
		try {
			const user = auth.currentUser;
			if (user) {
				const docRef = doc(db, "accounts", user.uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setAccountExists(true);
				} else {
					setAccountExists(false);
				}
			}
		} catch (error) {
			console.error("Error checking account existence:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkAccountExistence();
	}, []);

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#7399C6" />
			</View>
		);
	}

	if (!accountExists) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>No Account Found</Text>
				<TouchableOpacity
					style={styles.buttonPrimary}
					onPress={() => navigation.navigate("CreateAccount")}
				>
					<Text style={styles.buttonText}>Create Account</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.buttonSecondary}
					onPress={() => navigation.navigate("AI Banker")}
				>
					<Text style={styles.buttonText}>AI Assistant</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => {
					let iconName;
					if (route.name === "Banking") iconName = "card-outline";
					else if (route.name === "Investing")
						iconName = "stats-chart-outline";
					else if (route.name === "AI Banker")
						iconName = "chatbubble-ellipses-outline";
					else if (route.name === "Profile")
						iconName = "person-outline";

					return (
						<Ionicons name={iconName} size={size} color={color} />
					);
				},
				tabBarActiveTintColor: "#7399C6",
				tabBarInactiveTintColor: "gray",
				tabBarStyle: {
					backgroundColor: "#F8F9FA",
					borderTopWidth: 0,
					height: 60,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "bold",
				},
				headerShown: false,
			})}
		>
			<Tab.Screen name="Banking" component={Banking} />
			<Tab.Screen name="Investing" component={Investing} />
			<Tab.Screen name="AI Banker" component={AIBanker} />
			<Tab.Screen name="Profile" component={Profile} />
		</Tab.Navigator>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F8F9FA",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 20,
	},
	buttonPrimary: {
		backgroundColor: "#7399C6",
		paddingVertical: 15,
		borderRadius: 50,
		width: "80%",
		alignItems: "center",
		marginBottom: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5,
	},
	buttonSecondary: {
		backgroundColor: "#E0E0E0",
		paddingVertical: 15,
		borderRadius: 50,
		width: "80%",
		alignItems: "center",
		marginBottom: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5,
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});
