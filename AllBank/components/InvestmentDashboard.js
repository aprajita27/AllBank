import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import {
  analyzeFunds,
  optimizeLiquidity,
  fetchRedemptionAlerts,
} from "../utils/geminiApi";
import GoalBasedSavings from "./GoalBasedSavings";

export default function InvestmentDashboard() {
  const [funds, setFunds] = useState([]);
  const [loans, setLoans] = useState([]);
  const [savings, setSavings] = useState(null);
  const [simulations, setSimulations] = useState("");
  const [redemptionAlerts, setRedemptionAlerts] = useState("");
  const [optimizedLiquidity, setOptimizedLiquidity] = useState("");
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showSimulations, setShowSimulations] = useState(false);
  const [showLiquidityPlan, setShowLiquidityPlan] = useState(false);
  const [showRedemptionAlerts, setShowRedemptionAlerts] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();

      setFunds(userData.accounts?.investments?.funds || []);
      setLoans(userData.accounts?.loans || []);
      setGoals(userData.accounts?.goals || []);
      setSavings(userData.accounts?.savings || {});
      setSimulations(userData.accounts?.investments?.simulations || "");
      setRedemptionAlerts(userData.accounts?.investments?.redemptionAlerts || "");
      setOptimizedLiquidity(userData.accounts?.investments?.optimizedLiquidity || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const runGeminiSimulation = async () => {
    setLoading(true);
    try {
      const scenarios = await analyzeFunds(funds);
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        "accounts.investments.simulations": scenarios,
      });

      setSimulations(scenarios);
      Alert.alert("Simulation Complete", "Gemini AI has generated investment scenarios.");
    } catch (error) {
      console.error("Error running Gemini simulation:", error);
    } finally {
      setLoading(false);
    }
  };

  const runLiquidityOptimization = async () => {
    setLoading(true);
    try {
      const optimizedPlan = await optimizeLiquidity(funds);
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        "accounts.investments.optimizedLiquidity": optimizedPlan,
      });

      setOptimizedLiquidity(optimizedPlan);
      Alert.alert("Liquidity Optimization Complete", "Your optimized liquidity plan is ready!");
    } catch (error) {
      console.error("Error optimizing liquidity:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkRedemptionWindows = async () => {
    setLoading(true);
    try {
      const alerts = await fetchRedemptionAlerts(funds);
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        "accounts.investments.redemptionAlerts": alerts,
      });

      setRedemptionAlerts(alerts);
      Alert.alert("Redemption Alerts Updated", "Check the dashboard for new alerts.");
    } catch (error) {
      console.error("Error fetching redemption alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Investment Dashboard</Text>

      {/* Savings Section */}
      <Text style={styles.sectionHeader}>Savings</Text>
      <View style={styles.sectionCard}>
        {savings ? (
          <>
            <Text>Current Balance: ${savings.currentBalance.toFixed(2)}</Text>
            <Text>Monthly Deposit: ${savings.monthlyDeposit.toFixed(2)}</Text>
            <Text>Annual Interest Rate: {(savings.annualInterestRate * 100).toFixed(2)}%</Text>
          </>
        ) : (
          <Text>No savings data available.</Text>
        )}
      </View>

      {/* Loans Section */}
      <Text style={styles.sectionHeader}>Loans</Text>
      {loans.length > 0 ? (
        loans.map((loan, index) => (
          <View key={index} style={styles.sectionCard}>
            <Text>Loan Type: {loan.type}</Text>
            <Text>Principal: ${loan.principalAmount.toFixed(2)}</Text>
            <Text>Remaining Term: {loan.remainingTermMonths} months</Text>
          </View>
        ))
      ) : (
        <Text>No loans found.</Text>
      )}

      {/* Goals Section */}
      <Text style={styles.sectionHeader}>Goals</Text>
      <GoalBasedSavings /> {/* Reuse Goal-Based Savings component */}

      {/* Investments Section */}
      <Text style={styles.sectionHeader}>Investments</Text>
      <FlatList
        data={funds}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.fundCard}>
            <Text style={styles.fundName}>{item.fundName}</Text>
            <Text>Total Invested: ${item.totalInvested.toFixed(2)}</Text>
            <Text>Current Value: ${item.currentValue.toFixed(2)}</Text>
            <Text>Lock-In Period: {new Date(item.lockInPeriod).toDateString()}</Text>
            <Text>Redemption Penalty: {item.redemptionPenalty * 100}%</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No investments found.</Text>}
      />

      <TouchableOpacity style={styles.actionButton} onPress={runGeminiSimulation} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Run Gemini Simulation</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={runLiquidityOptimization} disabled={loading}>
        <Text style={styles.buttonText}>Optimize Liquidity</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={checkRedemptionWindows} disabled={loading}>
        <Text style={styles.buttonText}>Check Redemption Alerts</Text>
      </TouchableOpacity>

      {/* Toggleable Responses */}
      <View>
        <TouchableOpacity onPress={() => setShowSimulations(!showSimulations)}>
          <Text style={styles.toggleText}>Simulations {showSimulations ? "▼" : "►"}</Text>
        </TouchableOpacity>
        {showSimulations && (
          <View style={styles.resultSection}>
            <Text style={styles.resultText}>{simulations || "No Simulations Available."}</Text>
          </View>
        )}

        <TouchableOpacity onPress={() => setShowLiquidityPlan(!showLiquidityPlan)}>
          <Text style={styles.toggleText}>Optimized Liquidity Plan {showLiquidityPlan ? "▼" : "►"}</Text>
        </TouchableOpacity>
        {showLiquidityPlan && (
          <View style={styles.resultSection}>
            <Text style={styles.resultText}>{optimizedLiquidity || "No Liquidity Plan Available."}</Text>
          </View>
        )}

        <TouchableOpacity onPress={() => setShowRedemptionAlerts(!showRedemptionAlerts)}>
          <Text style={styles.toggleText}>Redemption Alerts {showRedemptionAlerts ? "▼" : "►"}</Text>
        </TouchableOpacity>
        {showRedemptionAlerts && (
          <View style={styles.resultSection}>
            <Text style={styles.resultText}>{redemptionAlerts || "No Alerts Available."}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F7F9FB" },
  title: { fontSize: 24, fontWeight: "bold", color: "#7399C6", marginBottom: 20 },
  sectionHeader: { fontSize: 20, fontWeight: "bold", color: "#555", marginVertical: 10 },
  sectionCard: { padding: 15, backgroundColor: "#FFF", borderRadius: 10, marginBottom: 10 },
  fundCard: { padding: 20, backgroundColor: "#FFF", borderRadius: 10, marginBottom: 10 },
  fundName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  actionButton: {
    backgroundColor: "#7399C6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  toggleText: { fontSize: 16, fontWeight: "bold", color: "#7399C6", marginTop: 10 },
  resultSection: { marginTop: 10, backgroundColor: "#FFF", borderRadius: 10, padding: 15 },
  resultText: { fontSize: 16, color: "#333" },
  emptyText: { textAlign: "center", fontSize: 16, color: "#555", marginTop: 20 },
});
