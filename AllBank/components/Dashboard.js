import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ProgressBarAndroid } from 'react-native';

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Simulate fetching balance and transactions
    const fetchedBalance = 12567.89;
    const fetchedTransactions = [
      { id: '1', title: 'Shopping', amount: '$29.90', type: 'debit' },
      { id: '2', title: 'Movie Ticket', amount: '$9.50', type: 'debit' },
      { id: '3', title: 'Amazon', amount: '$19.30', type: 'debit' },
      { id: '4', title: 'Salary', amount: '$2000.00', type: 'credit' },
    ];

    setBalance(fetchedBalance);
    setTransactions(fetchedTransactions);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, Andrea!</Text>
        <Text style={styles.streak}>🔥 Daily Streak: 5 Days</Text>
      </View>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Your Balance</Text>
        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={0.6}
          color="#FFFFFF"
        />
        <Text style={styles.balanceProgress}>60% of goal reached</Text>
      </View>
      <Text style={styles.transactionTitle}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.transactionCard,
              item.type === 'credit' ? styles.credit : styles.debit,
            ]}
          >
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.transactionAmount}>{item.amount}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaText}>Earn Rewards 🎉</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F7F9FB' },
  header: { marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#7399C6' },
  streak: { fontSize: 16, color: '#FFA500' },
  balanceCard: {
    backgroundColor: '#7399C6',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  balanceLabel: { color: '#FFFFFF', fontSize: 18 },
  balanceAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginVertical: 10 },
  balanceProgress: { color: '#FFFFFF', fontSize: 14, marginTop: 5 },
  transactionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#7399C6' },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  credit: { borderLeftColor: '#4CAF50', borderLeftWidth: 4 },
  debit: { borderLeftColor: '#FF5722', borderLeftWidth: 4 },
  transactionAmount: { fontSize: 16, fontWeight: 'bold' },
  ctaButton: { marginTop: 20, backgroundColor: '#7399C6', padding: 15, borderRadius: 10 },
  ctaText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
