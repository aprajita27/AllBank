import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "./components/Onboarding";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Insights from "./components/Insights";
import CreateAccount from "./components/CreateAccount";
import TransactionDetails from "./components/TransactionDetails"; // Import Transactions
import SendMoney from "./components/SendMoney"; // Import Send Money
import Loans from "./components/Loans"; // Import Loans
import Home from "./components/Home"; // Replace with your actual Home screen
import AIBanker from "./components/AIBanker";
import { auth } from "./firebaseConfig"; // Import Firebase Auth
import LoanCalculator from "./components/LoanCalculator"; // Ensure the path matches where LoanCalculator.js is located
import LoanApplication from "./components/LoanApplication"; // Adjust the path as needed
// import initializeMockData from "./Scripts/initializeMockData";
import GoalBasedSavings from "./components/GoalBasedSavings";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import insertMockData from "./utils/insertMockData";

const Stack = createStackNavigator();

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	// Listen to authentication state changes
	useEffect(() => {
		// initializeMockData();
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setIsLoggedIn(!!user); // Set true if user exists, false otherwise
			setLoading(false); // Stop loading spinner
		});
		return unsubscribe; // Cleanup on unmount
	}, []);

	// useEffect(() => {
	// 	insertMockData();
	// }, []);

	useEffect(() => {
		const registerForPushNotifications = async () => {
			const { status } = await Permissions.getAsync(
				Permissions.NOTIFICATIONS
			);
			if (status !== "granted") {
				const { status: newStatus } = await Permissions.askAsync(
					Permissions.NOTIFICATIONS
				);
				if (newStatus !== "granted") return;
			}
			const token = await Notifications.getExpoPushTokenAsync();
			console.log("Notification Token:", token);
		};
		registerForPushNotifications();
	}, []);

	// Show a loading spinner while determining auth state
	if (loading) {
		return null; // Replace with a splash screen or loader if desired
	}

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{isLoggedIn ? (
					<>
						<Stack.Screen name="Home" component={Home} />
						<Stack.Screen name="SendMoney" component={SendMoney} />
						<Stack.Screen
							name="LoanApplication"
							component={LoanApplication}
						/>
						<Stack.Screen
							name="LoanCalculator"
							component={LoanCalculator}
						/>
						<Stack.Screen name="Loans" component={Loans} />
						<Stack.Screen
							name="TransactionDetails"
							component={TransactionDetails}
							options={{ title: "Transactions" }}
						/>
						<Stack.Screen
							name="CreateAccount"
							component={CreateAccount}
						/>
            <Stack.Screen name="AI Banker" component={AIBanker} />
					</>
				) : (
					<>
						<Stack.Screen
							name="Onboarding"
							component={Onboarding}
						/>
						<Stack.Screen name="SignUp" component={SignUp} />
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="GoalBasedSaving" component={GoalBasedSavings} />
            			<Stack.Screen name="Insights" component={Insights} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
