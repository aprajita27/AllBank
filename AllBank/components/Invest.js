import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ProgressBarAndroid } from 'react-native';

export default function Invest() {
  const [investmentProgress, setInvestmentProgress] = useState(0.4); // 40%

  useEffect(() => {
    // Simulate API call to fetch progress
    fetchInvestmentProgress();
  }, []);

  const fetchInvestmentProgress = async () => {
    const progress = 0.75; // 75%
    setInvestmentProgress(progress);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Invest</Text>
      <Text style={styles.subHeader}>Your Investment Progress</Text>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={investmentProgress}
        color="#7399C6"
      />
      <Text style={styles.progressText}>{Math.round(investmentProgress * 100)}% Completed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FB',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7399C6',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: 'gray',
  },
});
