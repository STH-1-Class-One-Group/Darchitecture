import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PointLogItem({ amount, earnedAt }) {
  return (
    <View style={styles.row}>
      <Text style={styles.amount}>+{amount}p</Text>
      <Text style={styles.date}>{new Date(earnedAt).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E3DED3',
  },
  amount: {
    fontFamily: 'serif',
    color: '#1F3A2E',
  },
  date: {
    fontSize: 12,
    color: '#4A5E4F',
  },
});
