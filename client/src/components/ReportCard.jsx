import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Card from './Card';

export default function ReportCard({ report, onPress }) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>이동 {report.distanceKm}km</Text>
      <Text style={styles.meta}>탄소 절감 {report.carbonReductionKg}kg</Text>
      <Text style={styles.meta}>포인트 +{report.pointsEarned}p</Text>
      {onPress && (
        <Text style={styles.link} onPress={onPress}>
          자세히 보기
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#1F3A2E',
  },
  meta: {
    marginTop: 4,
    color: '#4A5E4F',
  },
  link: {
    marginTop: 10,
    color: '#1F3A2E',
    fontWeight: '700',
  },
});
