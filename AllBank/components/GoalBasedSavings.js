import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	Modal,
	Alert,
	ProgressBarAndroid,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function GoalBasedSavings() {
	const [goals, setGoals] = useState([]);
	const [customAmount, setCustomAmount] = useState(""); // For user contribution
	const [modalVisible, setModalVisible] = useState(false);
	const [goalName, setGoalName] = useState("");
	const [targetAmount, setTargetAmount] = useState("");
	const [motivation, setMotivation] = useState("");
	const [loading, setLoading] = useState(false);
	const [balance, setBalance] = useState(0); // User's current savings balance

	useEffect(() => {
		fetchUserData();
	}, []);

	const fetchUserData = async () => {
		try {
			const userId = auth.currentUser.uid;
			const userRef = doc(db, "users", userId);
			const userSnapshot = await getDoc(userRef);
			const userData = userSnapshot.data();

			setGoals(userData?.accounts?.goals || []);
			setBalance(userData?.accounts?.savings?.currentBalance || 0);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

    const createGoal = async () => {
        if (!goalName || !targetAmount) {
            Alert.alert("Error", "Please provide all required details.");
            return;
        }
        setLoading(true);
    
        try {
            const userId = auth.currentUser.uid;
            const userRef = doc(db, "users", userId);
            const userSnapshot = await getDoc(userRef);
    
            const userData = userSnapshot.data();
            const existingGoals = userData.accounts?.goals || [];
    
            const newGoal = {
                goalName,
                targetAmount: parseFloat(targetAmount),
                savedAmount: 0,
                startDate: new Date().toISOString(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // Example: 30 days from now
                motivation,
                milestones: calculateMilestones(parseFloat(targetAmount)),
            };
    
            await updateDoc(userRef, {
                "accounts.goals": [...existingGoals, newGoal],
            });
    
            // Schedule a reminder for 3 days before the deadline
            const daysRemaining = 27; // Reminder 3 days before the deadline
            scheduleGoalReminder(newGoal.goalName, daysRemaining);
    
            setModalVisible(false);
            fetchUserData();
        } catch (error) {
            console.error("Error creating goal:", error);
        } finally {
            setLoading(false);
        }
    };
    

	const calculateMilestones = (target) => {
		const milestones = [];
		for (let i = 0.25; i <= 1; i += 0.25) {
			milestones.push(Math.floor(target * i));
		}
		return milestones;
	};

    const generateSavingSuggestion = (goal) => {
        const remainingAmount = goal.targetAmount - goal.savedAmount;
        const remainingDays = (new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24);
        const suggestedAmount = (remainingAmount / remainingDays).toFixed(2);
    
        return `To achieve your goal, save $${suggestedAmount} daily.`;
    };    

    const contributeToGoal = async (goalIndex, contribution) => {
        if (!contribution || contribution <= 0) {
            Alert.alert("Error", "Please enter a valid contribution amount.");
            return;
        }
    
        if (contribution > balance) {
            Alert.alert("Error", "Insufficient balance for this contribution.");
            return;
        }
    
        try {
            const userId = auth.currentUser.uid;
            const userRef = doc(db, "users", userId);
            const userSnapshot = await getDoc(userRef);
    
            const userData = userSnapshot.data();
            const updatedGoals = [...userData.accounts.goals];
            const updatedGoal = updatedGoals[goalIndex];
    
            // Update goal and balance
            updatedGoal.savedAmount = Math.min(
                updatedGoal.savedAmount + contribution,
                updatedGoal.targetAmount
            );
    
            updatedGoals[goalIndex] = updatedGoal;
    
            // Update Firestore
            await updateDoc(userRef, {
                "accounts.goals": updatedGoals,
                "accounts.savings.currentBalance": balance - contribution,
            });
    
            // Reschedule reminder if goal progress is close to the next milestone
            const daysRemaining = Math.ceil(
                (new Date(updatedGoal.endDate) - new Date()) / (1000 * 60 * 60 * 24)
            ) - 3; // Reminder 3 days before the deadline
            scheduleGoalReminder(updatedGoal.goalName, daysRemaining);
    
            setCustomAmount(""); // Clear input field
            fetchUserData();
        } catch (error) {
            console.error("Error contributing to goal:", error);
        }
    };
    
    
    const checkMilestones = (goal) => {
        const milestones = goal.milestones.map((milestone) => {
            if (!milestone.achieved && goal.savedAmount >= (goal.targetAmount * milestone.percentage) / 100) {
                milestone.achieved = true;
                awardReward(milestone.percentage);
            }
            return milestone;
        });
        return milestones;
    };
    
    const awardReward = (percentage) => {
        Alert.alert("Congratulations!", `You've reached ${percentage}% of your goal!`);
        // Increment reward points in Firestore
        incrementRewardPoints(percentage);
    };
    
    const incrementRewardPoints = async (percentage) => {
        try {
            const userId = auth.currentUser.uid;
            const userRef = doc(db, "users", userId);
            const userSnapshot = await getDoc(userRef);
            const rewardPoints = userSnapshot.data().accounts.rewardPoints || 0;
    
            await updateDoc(userRef, {
                "accounts.rewardPoints": rewardPoints + percentage,
            });
        } catch (error) {
            console.error("Error updating reward points:", error);
        }
    };    

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Savings Goals</Text>
			<Text style={styles.balance}>Current Balance: ${balance.toFixed(2)}</Text>
			<FlatList
				data={goals}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item, index }) => (
					<View style={styles.goalCard}>
						<Text style={styles.goalName}>{item.goalName}</Text>
						<Text style={styles.progressText}>
							${item.savedAmount.toFixed(2)} / ${item.targetAmount.toFixed(2)}
						</Text>
						<ProgressBarAndroid
							styleAttr="Horizontal"
							indeterminate={false}
							progress={item.savedAmount / item.targetAmount}
							color="#7399C6"
						/>
						<TextInput
							style={styles.input}
							placeholder="Enter amount"
							value={customAmount}
							onChangeText={setCustomAmount}
							keyboardType="numeric"
						/>
						<TouchableOpacity
							style={styles.addButton}
							onPress={() => contributeToGoal(index, parseFloat(customAmount))}
						>
							<Text style={styles.addButtonText}>Contribute</Text>
						</TouchableOpacity>
                        <Text style={styles.suggestion}>{generateSavingSuggestion(goal)}</Text>
					</View>
				)}
				ListEmptyComponent={
					<Text style={styles.emptyText}>
						No goals yet. Start by creating a new goal!
					</Text>
				}
			/>
			<TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
				<Text style={styles.createButtonText}>+ Create New Goal</Text>
			</TouchableOpacity>

			{/* Modal for Creating Goals */}
			<Modal visible={modalVisible} animationType="slide" transparent={true}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Create a Savings Goal</Text>
						<TextInput
							style={styles.input}
							placeholder="Goal Name"
							value={goalName}
							onChangeText={setGoalName}
						/>
						<TextInput
							style={styles.input}
							placeholder="Target Amount ($)"
							value={targetAmount}
							onChangeText={setTargetAmount}
							keyboardType="numeric"
						/>
						<TextInput
							style={styles.input}
							placeholder="Motivation (optional)"
							value={motivation}
							onChangeText={setMotivation}
						/>
						<TouchableOpacity style={styles.saveButton} onPress={createGoal}>
							<Text style={styles.saveButtonText}>
								{loading ? "Saving..." : "Save Goal"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: "#F7F9FB" },
	title: { fontSize: 24, fontWeight: "bold", color: "#7399C6", marginBottom: 20, textAlign: "center" },
	balance: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 20 },
	goalCard: { padding: 20, backgroundColor: "#fff", borderRadius: 15, marginBottom: 15 },
	goalName: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 },
	progressText: { fontSize: 14, color: "#555", marginBottom: 10 },
	input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 15 },
	addButton: { backgroundColor: "#7399C6", padding: 10, borderRadius: 10, alignItems: "center" },
	addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
	createButton: { backgroundColor: "#7399C6", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
	createButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
	modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
	modalContent: { width: "90%", padding: 20, backgroundColor: "#fff", borderRadius: 15 },
	modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#7399C6", textAlign: "center" },
	saveButton: { backgroundColor: "#7399C6", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 10 },
	saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
	cancelButton: { backgroundColor: "#E0E0E0", padding: 15, borderRadius: 10, alignItems: "center" },
	cancelButtonText: { color: "#555", fontSize: 16 },
	emptyText: { textAlign: "center", fontSize: 16, color: "#555", marginTop: 20 },
});