import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';

export default function ReportScreen({ report, onBack, onViewList }) {
  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>리포트가 아직 없습니다.</Text>
        <Button label="지도 화면으로" onPress={onBack} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>이번 이용 리포트</Text>
        <Text style={styles.meta}>거리: {report.distanceKm} km</Text>
        <Text style={styles.meta}>시간: {report.durationMin} 분</Text>
        <Text style={styles.meta}>탄소 절감: {report.carbonReductionKg} kg</Text>
        <Text style={styles.meta}>적립 포인트: +{report.pointsEarned}p</Text>
        <Text style={styles.date}>기록 시각: {new Date(report.createdAt).toLocaleString()}</Text>
      </Card>
      <Button label="전체 리포트 보기" onPress={onViewList} />
      <View style={styles.spacer} />
      <Button label="지도 화면으로" onPress={onBack} variant="ghost" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 16,
    color: '#1F3A2E',
  },
  meta: {
    marginTop: 6,
    color: '#4A5E4F',
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    color: '#6A7A6B',
  },
  spacer: {
    height: 8,
  },
  empty: {
    color: '#4A5E4F',
    marginBottom: 14,
  },
});
