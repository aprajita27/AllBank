import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "./components/Onboarding";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import SendMoney from "./components/SendMoney"; // Replace with your actual Send Money screen
import Home from "./components/Home"; // Replace with your actual Home screen
import { auth } from "./firebaseConfig"; // Import Firebase Auth
// import initializeMockData from "./Scripts/initializeMockData";

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
							name="CreateAccount"
							component={CreateAccount}
						/>
					</>
				) : (
					<>
						<Stack.Screen
							name="Onboarding"
							component={Onboarding}
						/>
						<Stack.Screen name="SignUp" component={SignUp} />
						<Stack.Screen name="Login" component={Login} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
