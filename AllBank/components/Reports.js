import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

export default function Reports() {
  const chartData = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
    datasets: [
      {
        data: [400, 450, 500, 550, 600, 650],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reports</Text>
      <View style={styles.summary}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Money In</Text>
          <Text style={styles.summaryValue}>+ $3,456.98</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Money Out</Text>
          <Text style={styles.summaryValue}>- $567.25</Text>
        </View>
      </View>
      <Text style={styles.chartTitle}>Monthly Spending</Text>
      <BarChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#f7f7f7',
          backgroundGradientFrom: '#6c63ff',
          backgroundGradientTo: '#9b63ff',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: 'gray',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 10,
  },
});
