import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { analyzeFunds, optimizeLiquidity, fetchRedemptionAlerts } from "../utils/geminiApi";

export default function InvestmentDashboard() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [simulations, setSimulations] = useState([]);
  const [redemptionAlerts, setRedemptionAlerts] = useState([]);
  const [optimizedLiquidity, setOptimizedLiquidity] = useState(null);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);

      const userData = userSnapshot.data();
      setFunds(userData.accounts?.investments?.funds || []);
      setSimulations(userData.accounts?.investments?.simulations || []);
    } catch (error) {
      console.error("Error fetching investments:", error);
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
    <View style={styles.container}>
      <Text style={styles.title}>Investment Dashboard</Text>
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>No investments found. Start by adding funds!</Text>
        }
      />
      <TouchableOpacity
        style={styles.actionButton}
        onPress={runGeminiSimulation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Run Gemini Simulation</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={runLiquidityOptimization}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Optimize Liquidity</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={checkRedemptionWindows}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Check Redemption Alerts</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F7F9FB" },
  title: { fontSize: 24, fontWeight: "bold", color: "#7399C6", marginBottom: 20 },
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
  emptyText: { textAlign: "center", fontSize: 16, color: "#555", marginTop: 20 },
});
