import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RoutePolyline({ points }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>실시간 경로 추적</Text>
      <Text style={styles.count}>{points}개의 좌표가 기록되었습니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B8C9B8',
    backgroundColor: '#F4F1EA',
  },
  label: {
    fontFamily: 'serif',
    color: '#1F3A2E',
  },
  count: {
    marginTop: 4,
    color: '#4A5E4F',
    fontSize: 12,
  },
});
