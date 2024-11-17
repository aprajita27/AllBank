import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function BackButton({ navigation }) {
	return (
		<TouchableOpacity
			style={styles.backButton}
			onPress={() => navigation.goBack()}
		>
			<Text style={styles.backButtonText}>{"< Back"}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	backButton: {
		position: "absolute",
		top: 50,
		left: 20,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
	},
	backButtonText: {
		fontSize: 16,
		color: "#7399C6",
		fontWeight: "bold",
	},
});
