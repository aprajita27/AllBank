import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";
import Onboarding from "./components/Onboarding";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import "react-native-get-random-values";

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ color, size }) => {
						let iconName;
						if (route.name === "Dashboard")
							iconName = "home-outline";
						else if (route.name === "Transfer")
							iconName = "paper-plane-outline";
						else if (route.name === "Invest")
							iconName = "stats-chart-outline";
						return (
							<Ionicons
								name={iconName}
								size={size}
								color={color}
							/>
						);
					},
					tabBarActiveTintColor: "#7399C6",
					tabBarInactiveTintColor: "gray",
					headerShown: false,
				})}
			>
				<Tab.Screen name="Onboarding" component={Onboarding} />
				<Tab.Screen name="SignUp" component={SignUp} />
				<Tab.Screen name="Login" component={Login} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}
