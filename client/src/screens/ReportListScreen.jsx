import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import ReportCard from '../components/ReportCard';

export default function ReportListScreen({ reports, onSelectReport, onEmptyAction }) {
  if (!reports.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>아직 리포트가 없습니다.</Text>
        <Button label="타슈 이용 시작" onPress={onEmptyAction} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 이용 리포트</Text>
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          onPress={() => onSelectReport(report)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 16,
    color: '#1F3A2E',
    marginBottom: 12,
  },
  empty: {
    color: '#4A5E4F',
    marginBottom: 12,
  },
});
